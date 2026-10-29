#!/usr/bin/env node
// Zero-dependency static site builder.
// Reads markdown from content/, fetches books/music data, writes site/.

import fs from 'fs';
import path from 'path';
import { mdToHtml } from './lib/md.mjs';
import { getLibrary, getMusicData } from './lib/data.mjs';
import {
  layout,
  contentPage,
  fallbackPage,
  postsIndexPage,
  booksPage,
  musicPage,
  dataErrorPage,
} from './lib/render.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'site');

// ---------------------------------------------------------------- .env

for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)?\s*$/);
  if (m && process.env[m[1]] === undefined) {
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// ---------------------------------------------------------------- content

const contentDir = path.join(ROOT, 'content');

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { frontmatter: {}, content: src };
  const frontmatter = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, value] = kv;
    value = value.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      frontmatter[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      frontmatter[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  return { frontmatter, content: src.slice(m[0].length) };
}

function walkMd(dir, base = '') {
  const slugs = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) slugs.push(...walkMd(path.join(dir, entry.name), rel));
    else if (entry.name.endsWith('.md')) slugs.push(rel.slice(0, -3));
  }
  return slugs;
}

function loadPost(slug) {
  const raw = fs.readFileSync(path.join(contentDir, `${slug}.md`), 'utf8');
  const { frontmatter, content } = parseFrontmatter(raw);
  return {
    slug,
    title: frontmatter.title || 'Untitled',
    date: frontmatter.date || '',
    description: frontmatter.description || '',
    tags: frontmatter.tags || [],
    html: mdToHtml(content),
  };
}

function getAllPosts() {
  return walkMd(contentDir)
    .map(loadPost)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

// Virtual pages rendered by the app but not backed by content/*.md
const virtualFiles = [
  { name: 'books.md', type: 'file', path: '/books/' },
  { name: 'music.md', type: 'file', path: '/music/' },
  { name: 'work.md', type: 'file', path: '/work/' },
];

function buildFileTree(dir, basePath = '') {
  const nodes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = basePath ? `${basePath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        type: 'folder',
        path: '/' + rel,
        children: buildFileTree(path.join(dir, entry.name), rel),
      });
    } else if (entry.name.endsWith('.md')) {
      let route = rel.replace(/\.md$/, '');
      if (route === 'index') route = '';
      nodes.push({ name: entry.name, type: 'file', path: '/' + route });
    }
  }
  return nodes.sort((a, b) => (a.type !== b.type ? (a.type === 'folder' ? -1 : 1) : a.name.localeCompare(b.name)));
}

function getFileTree() {
  if (!fs.existsSync(contentDir)) return virtualFiles;
  const tree = buildFileTree(contentDir);
  const existing = new Set(tree.map((n) => n.name));
  const sortNodes = (list) =>
    list.sort((a, b) => (a.type !== b.type ? (a.type === 'folder' ? -1 : 1) : a.name.localeCompare(b.name)));
  return sortNodes([...tree, ...virtualFiles.filter((v) => !existing.has(v.name))]);
}

// ---------------------------------------------------------------- output

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

function writePage(route, html) {
  const dir = path.join(OUT, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const tree = getFileTree();

function render(route, activePath, pageHtml, title, description) {
  writePage(route, layout({ title, description, activePath, tree, content: pageHtml }));
}

const posts = getAllPosts();

// content pages
const contentPages = ['index', 'projects', 'about', 'work'];
for (const name of contentPages) {
  let post = null;
  try {
    post = loadPost(name);
  } catch {}
  const html = post
    ? contentPage(post)
    : name === 'index'
      ? `<div><h1>Welcome</h1><p>No content found. Create content/index.md to see your home page.</p></div>`
      : fallbackPage(name.charAt(0).toUpperCase() + name.slice(1));
  const route = name === 'index' ? '.' : name;
  render(route, name === 'index' ? '/' : `/${name}/`, html, name === 'index' ? null : post?.title, post?.description);
}

// posts index
render('posts', '/posts/', postsIndexPage(posts), 'Blog Posts');

// individual posts
for (const post of posts.filter((p) => p.slug.startsWith('posts/'))) {
  const route = post.slug.replace(/^posts\/?/, '');
  render(`posts/${route}`, `/${post.slug}/`, contentPage(post), post.title, post.description);
}

// data pages
try {
  render('books', '/books/', booksPage(await getLibrary()), 'books');
} catch (err) {
  console.warn(`[books] ${err.message}`);
  render('books', '/books/', dataErrorPage('books', err.message), 'books');
}

try {
  render('music', '/music/', musicPage(await getMusicData()), 'music');
} catch (err) {
  console.warn(`[music] ${err.message}`);
  render('music', '/music/', dataErrorPage('music', err.message), 'music');
}

// static assets
fs.copyFileSync(path.join(ROOT, 'assets/style.css'), path.join(OUT, 'style.css'));
fs.copyFileSync(path.join(ROOT, 'assets/site.js'), path.join(OUT, 'site.js'));
try {
  fs.copyFileSync(path.join(ROOT, 'assets/favicon.ico'), path.join(OUT, 'favicon.ico'));
} catch {}

const pages = (function count(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) n += count(path.join(dir, e.name));
    else if (e.name === 'index.html') n++;
  }
  return n;
})(OUT);

console.log(`built ${pages} pages → site/`);
