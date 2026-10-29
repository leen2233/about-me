// HTML templates: editor chrome (tab bar, sidebar, status bar) and pages.

const SITE_NAME = 'leen2233';

export const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// ------------------------------------------------------------ inline icons
const svg = (d, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;

const icons = {
  chevron: svg('<polyline points="9 18 15 12 9 6"/>'),
  folderClosed:
    svg('<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>'),
  folderOpen:
    svg('<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>'),
  fileText:
    svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
  menu: svg('<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>', 'class="menu-icon"'),
};

// ----------------------------------------------------------------- chrome

const TABS = [
  { name: 'index.md', path: '/' },
  { name: 'projects.md', path: '/projects/' },
  { name: 'work.md', path: '/work/' },
  { name: 'books.md', path: '/books/' },
  { name: 'games.md', path: '/games/' },
  { name: 'music.md', path: '/music/' },
];

function tabDisplayName(path) {
  if (path === '/') return 'index.md';
  if (path.startsWith('/posts')) {
    return (
      path
        .split('/')
        .filter(Boolean)
        .join('/') + '.md'
    );
  }
  return path.split('/').filter(Boolean).pop() + '.md';
}

function tabBar(activePath) {
  const normalized = activePath.endsWith('/') && activePath !== '/' ? activePath : activePath;
  const isTab = TABS.some((t) => t.path === normalized);
  const tabs = TABS.map(
    (t) =>
      `<a class="tab${t.path === normalized ? ' active' : ''}" href="${t.path}">${esc(t.name)}</a>`
  ).join('');
  const current = isTab
    ? ''
    : `<span class="tab active">${esc(tabDisplayName(normalized))}</span>`;
  return `<div class="tabbar">${tabs}${current}</div>`;
}

function statusFilePath(path) {
  if (path === '/') return 'content/index.md';
  if (path.startsWith('/posts')) return `content${path.replace(/\/$/, '')}.md`;
  if (path.startsWith('/about')) return 'content/about.md';
  return `content${path === '/' ? '/index' : path.replace(/\/$/, '')}.md`;
}

function statusBar(path) {
  return `<div class="statusbar">
    <div class="status-indicator"></div>
    <div class="status-triangle"></div>
    <div class="status-file">${esc(statusFilePath(path))}</div>
    <div class="status-right"><span>utf-8</span><span>markdown</span></div>
  </div>`;
}

function isAncestorOf(node, activePath) {
  const prefix = node.path === '/' ? '/' : node.path.replace(/\/$/, '') + '/';
  return node.type === 'folder' && activePath.startsWith(prefix);
}

function renderTreeNodes(nodes, activePath, depth) {
  return nodes
    .map((node) => {
      const pad = `padding-left:${depth * 1 + 0.5}rem`;
      const expanded = depth < 2 || isAncestorOf(node, activePath);
      if (node.type === 'folder') {
        const children = renderTreeNodes(node.children ?? [], activePath, depth + 1);
        return `<div class="tree-folder${expanded ? '' : ' closed'}">
  <button class="tree-row folder" style="${pad}" aria-expanded="${expanded}">
    <span class="chevron">${icons.chevron}</span>
    <span class="icon folder-icon-open">${icons.folderOpen}</span>
    <span class="icon folder-icon-closed">${icons.folderClosed}</span>
    <span>${esc(node.name)}</span>
  </button>
  ${children ? `<div class="tree-children">${children}</div>` : ''}
</div>`;
      }
      const active = node.path === activePath ? ' active' : '';
      return `<a class="tree-row file${active}" style="${pad}" href="${node.path}"><span class="icon">${icons.fileText}</span><span>${esc(node.name)}</span></a>`;
    })
    .join('\n');
}

function sidebar(tree, activePath) {
  return `<aside class="sidebar" id="sidebar">
  <div class="sidebar-header">~/projects/sp/blog/..</div>
  <nav class="tree" aria-label="Content folders">${renderTreeNodes(tree, activePath, 0)}</nav>
</aside>`;
}

export function layout({ title, description, activePath, tree, content }) {
  const pageTitle = title ? `${SITE_NAME} — ${title}` : SITE_NAME;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)}</title>
  ${description ? `<meta name="description" content="${esc(description)}" />` : ''}
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/style.css" />
  <script src="/site.js" defer></script>
</head>
<body>
  <button class="hamburger" aria-label="Toggle sidebar">${icons.menu}</button>
  ${tabBar(activePath)}
  <div class="shell">
    ${sidebar(tree, activePath)}
    <div class="backdrop" id="backdrop"></div>
    <main><div class="content">
${content}
    </div></main>
  </div>
  ${statusBar(activePath)}
</body>
</html>
`;
}

// ------------------------------------------------------------------ pages

function metaRow(post) {
  const tags =
    post.tags.length > 0
      ? ` <span>|</span> <span class="tags">${post.tags.map((t) => `<span class="tag">#${esc(t)}</span>`).join(' ')}</span>`
      : '';
  return `<div class="meta-row"><time>${esc(post.date)}</time>${tags}</div>`;
}

export function contentPage(post) {
  return `<article>
  <header class="page-header">
    <h1>${esc(post.title)}</h1>
    ${metaRow(post)}
    ${post.description ? `<p class="description">${esc(post.description)}</p>` : ''}
  </header>
  ${post.html}
</article>
`;
}

export function fallbackPage(name) {
  return `<div>
  <h1>${esc(name)}</h1>
  <p>No content found. Create content/${esc(name.toLowerCase())}.md to see this page.</p>
</div>
`;
}

export function postsIndexPage(posts) {
  const byYear = new Map();
  for (const post of posts) {
    const year = post.slug.match(/posts\/(\d{4})/)?.[1] || 'Other';
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(post);
  }

  const sections = [...byYear.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, yearPosts]) => {
      const rows = yearPosts
        .map(
          (p) => `<a class="row" href="/${esc(p.slug)}/">
  <div class="row-sub"><span>${esc(p.slug.split('/').pop())}.md</span><span class="check">✓</span></div>
  <h3 class="row-title">${esc(p.title)}</h3>
  <p class="row-desc">${esc(p.description)}</p>
</a>`
        )
        .join('\n');
      return `<div class="section">
  <h2 class="section-h"><span class="arrow">▸</span>${esc(year)}/</h2>
  <div class="list">${rows}</div>
</div>`;
    })
    .join('\n');

  const empty =
    posts.length === 0
      ? '<p class="muted">No posts found. Create your first post in content/posts/</p>'
      : '';

  return `<div>
  <h1 class="page-title">Blog Posts</h1>
  ${sections}
  ${empty}
</div>
`;
}

function bookRow(book) {
  const href = book.slug ? `https://hardcover.app/books/${book.slug}` : undefined;
  const meta = [book.rating !== null ? `★ ${book.rating}` : null, book.date]
    .filter(Boolean)
    .join('  ·  ');
  const tag = href ? 'a' : 'span';
  const attrs = href ? ` href="${href}" target="_blank" rel="noopener noreferrer"` : '';
  return `<${tag}${attrs} class="row${href ? '' : ' static'}">
  <div class="row-main"><span class="row-title">${esc(book.title)}</span><span class="row-meta">${esc(meta)}</span></div>
  <div class="row-sub">${esc(book.authors.join(', '))}</div>
</${tag}>`;
}

function bookSection(name, books) {
  const rows = books.length
    ? `<div class="list">${books.map(bookRow).join('\n')}</div>`
    : '<p class="muted">empty/</p>';
  return `<section class="section">
  <h2 class="section-h"><span class="arrow">▸</span>${esc(name)}/${books.length}</h2>
  ${rows}
</section>`;
}

export function booksPage(library) {
  return `<article>
  <header class="page-header">
    <h1>books.md</h1>
    <div class="meta-row"><span>synced from hardcover.app</span><span>|</span><span>updates hourly</span></div>
    <p class="description">What I've read and what's on the shelf, straight from my Hardcover library.</p>
  </header>
  ${bookSection('read', library.read)}
  ${bookSection('want-to-read', library.wantToRead)}
</article>
`;
}

function formatPlayedAt(playedAt) {
  if (!playedAt) return '';
  const minutes = Math.floor((Date.now() - new Date(playedAt).getTime()) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function recentTrackRow(t) {
  return `<a href="${t.url}" target="_blank" rel="noopener noreferrer" class="row">
  <div class="row-main"><span class="row-title">${esc(t.name)}${t.nowPlaying ? '<span class="playing">▸ playing</span>' : ''}</span><span class="row-meta">${t.nowPlaying ? 'now' : esc(formatPlayedAt(t.playedAt))}</span></div>
  <div class="row-sub">${esc(t.artist)}${t.album ? ` — ${esc(t.album)}` : ''}</div>
</a>`;
}

function topItemRow(item) {
  return `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="row">
  <div class="row-main"><span class="row-title">${esc(item.name)}</span><span class="row-meta">${item.playcount.toLocaleString('en-US')} plays</span></div>
  ${item.subtitle ? `<div class="row-sub">${esc(item.subtitle)}</div>` : ''}
</a>`;
}

function itemList(items) {
  if (items.length === 0) return '<p class="muted">empty/</p>';
  return `<div class="list">${items.map((i) => ('nowPlaying' in i ? recentTrackRow(i) : topItemRow(i))).join('\n')}</div>`;
}

function section(name, inner) {
  return `<section class="section">
  <h2 class="section-h"><span class="arrow">▸</span>${esc(name)}/</h2>
  ${inner}
</section>`;
}

function periodColumn(label, items) {
  return `<div><h3 class="period-h">${esc(label)}</h3>${itemList(items)}</div>`;
}

function topSection(name, data) {
  return section(
    name,
    `<div class="cols">${periodColumn('7 days', data.week)}${periodColumn('all time', data.overall)}</div>`
  );
}

export function musicPage(data) {
  const u = data.user;
  return `<article>
  <header class="page-header">
    <h1>music.md</h1>
    <div class="meta-row"><a href="${u.url}" target="_blank" rel="noopener noreferrer" class="profile-link">last.fm/${esc(u.name)}</a><span>|</span><span>${u.scrobbles.toLocaleString('en-US')} scrobbles</span><span>|</span><span>since ${esc(u.memberSince)}</span><span>|</span><span>updates hourly</span></div>
    <p class="description">What I've been listening to, straight from my Last.fm scrobbles.</p>
  </header>
  ${section('recent', itemList(data.recent))}
  ${topSection('top-artists', data.topArtists)}
  ${topSection('top-tracks', data.topTracks)}
  ${topSection('top-albums', data.topAlbums)}
</article>
`;
}

export function dataErrorPage(kind, message) {
  return `<article>
  <header class="page-header">
    <h1>${esc(kind)}.md</h1>
  </header>
  <div class="error-block">
    <p>Failed to load ${esc(kind)} data: ${esc(message)}</p>
    <p class="muted">Check that the API keys are set in .env and valid.</p>
  </div>
</article>
`;
}

function gameRow(game) {
  return `<a href="https://backloggd.com/games/${game.slug}/" target="_blank" rel="noopener noreferrer" class="row">
  <div class="row-main"><span class="row-title">${esc(game.title)}</span><span class="row-meta">${game.rating !== null ? `★ ${game.rating}` : ''}</span></div>
</a>`;
}

function gamesSection(name, games) {
  const rows = games.length
    ? `<div class="list">${games.map(gameRow).join('\n')}</div>`
    : '<p class="muted">empty/</p>';
  return `<section class="section">
  <h2 class="section-h"><span class="arrow">▸</span>${esc(name)}/${games.length}</h2>
  ${rows}
</section>`;
}

export function gamesPage(library) {
  return `<article>
  <header class="page-header">
    <h1>games.md</h1>
    <div class="meta-row"><a href="https://www.backloggd.com/u/${esc(library.user)}/" target="_blank" rel="noopener noreferrer" class="profile-link">backloggd.com/${esc(library.user)}</a><span>|</span><span>synced on build</span></div>
    <p class="description">My game library, tracked on Backloggd.</p>
  </header>
  ${gamesSection('played', library.played)}
  ${gamesSection('backlog', library.backlog)}
  ${gamesSection('wishlist', library.wishlist)}
</article>
`;
}
