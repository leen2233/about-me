// Zero-dependency markdown → HTML converter.
// Supports: headings, hr, fenced code (naive highlighting), blockquotes,
// tables, nested lists, paragraphs, and inline code/bold/italic/links/images.

const escapeHtml = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const TOKEN =
  /(\/\*[\s\S]*?\*\/|(?:\/\/|#)[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(0x[\da-fA-F]+|\d+(?:\.\d+)?)\b|\b(const|let|var|function|return|if|else|elif|for|while|class|import|export|from|def|async|await|new|try|catch|throw|finally|switch|case|break|continue|do|this|self|super|extends|implements|interface|type|enum|struct|impl|fn|mut|pub|use|match|where|with|as|in|is|not|and|or|lambda|yield|pass|raise|print|true|false|null|nil|none|undefined|void|int|str|string|bool|float|double|char|public|private|protected|static|FROM|SELECT|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|GROUP|BY|ORDER|LIMIT|DISTINCT|CREATE|TABLE|ALTER|DROP|EXPOSE|RUN|CMD|COPY|ADD|WORKDIR|ENV|ENTRYPOINT|AS|curl|sudo|apt|docker|git|npm|cd|ls|echo|export)\b/g;

function highlight(code) {
  let out = '';
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    out += escapeHtml(code.slice(last, m.index));
    const cls = m[1] ? 'hljs-comment' : m[2] ? 'hljs-string' : m[3] ? 'hljs-number' : 'hljs-keyword';
    out += `<span class="${cls}">${escapeHtml(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(code.slice(last));
}

function inline(src) {
  const codes = [];
  let s = src.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\x00${codes.length - 1}\x00`;
  });

  s = escapeHtml(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) => `<img src="${url}" alt="${alt}" />`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => `<a href="${url}">${text}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (_, a, b) => `<strong>${a ?? b}</strong>`);
  s = s.replace(/\*([^*]+)\*|_([^_]+)_/g, (_, a, b) => `<em>${a ?? b}</em>`);
  s = s.replace(/\x00(\d+)\x00/g, (_, i) => `<code>${escapeHtml(codes[Number(i)])}</code>`);
  return s;
}

function parseListBlock(lines) {
  const roots = [];
  const stack = [];

  for (const line of lines) {
    const m = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    if (!m) continue;
    const indent = m[1].length;
    const ordered = /\d./.test(m[2]);
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const node = { indent, ordered, text: m[3], children: [] };
    if (!stack.length) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }

  const wrap = (nodes) => {
    const ordered = nodes[0].ordered;
    const tag = ordered ? 'ol' : 'ul';
    const lis = nodes
      .map((n) => `<li>${inline(n.text)}${n.children.length ? wrap(n.children) : ''}</li>`)
      .join('\n');
    return `<${tag}>\n${lis}\n</${tag}>`;
  };
  return wrap(roots);
}

function parseTable(lines) {
  const cells = (row) =>
    row
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());
  const head = cells(lines[0]);
  const body = lines.slice(2).map(cells);
  const th = head.map((c) => `<th>${inline(c)}</th>`).join('');
  const trs = body
    .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
    .join('\n');
  return `<table><thead><tr>${th}</tr></thead><tbody>\n${trs}\n</tbody></table>`;
}

export function mdToHtml(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      const code = buf.join('\n');
      out.push(
        `<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ''}>${highlight(code)}</code></pre>`
      );
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2].replace(/\s+#+\s*$/, ''))}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push('<hr />');
      i++;
      continue;
    }

    if (line.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>\n<p>${inline(buf.join(' '))}</p>\n</blockquote>`);
      continue;
    }

    if (
      /^\s*\|.*\|\s*$/.test(line) &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) &&
      lines[i + 1].includes('-')
    ) {
      const buf = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) buf.push(lines[i++]);
      out.push(parseTable(buf));
      continue;
    }

    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && (/^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        buf.push(lines[i++]);
      }
      out.push(parseListBlock(buf));
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,6}\s|```|>|\s*(?:[-*+]|\d+\.)\s+)/.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      buf.push(lines[i++]);
    }
    out.push(`<p>${inline(buf.join('\n')).replaceAll('\n', '<br />\n')}</p>`);
  }

  return out.join('\n');
}
