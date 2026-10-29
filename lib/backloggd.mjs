// Backloggd library scraper. Backloggd has no public API; this reads the
// public profile's game-grid pages and solves the site's Anubis
// proof-of-work challenge first (what a real browser does). Successful
// results are cached to .cache/backloggd.json so a failed scrape never
// breaks the build while a cached copy exists.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const BASE = 'https://backloggd.com';
const USER = process.env.BACKLOGGD_USER ?? 'leen2233';
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const STATUSES = ['played', 'backlog', 'wishlist'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let cookies = {};

function cookieHeader() {
  return Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

function captureCookies(res) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [kv] = c.split(';');
    const eq = kv.indexOf('=');
    cookies[kv.slice(0, eq)] = kv.slice(eq + 1);
  }
}

async function get(url, tries = 5) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Cookie: cookieHeader() },
        redirect: 'manual',
      });
      captureCookies(res);
      return res;
    } catch (err) {
      lastErr = err;
      await sleep(800);
    }
  }
  throw lastErr;
}

async function authenticate(pageHtml) {
  const match = pageHtml.match(/anubis_challenge[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return false;

  const challenge = JSON.parse(match[1]).challenge;
  const prefix = '0'.repeat(challenge.difficulty);
  let nonce = 0;
  let hash = '';
  while (true) {
    hash = crypto.createHash('sha256').update(challenge.randomData + nonce).digest('hex');
    if (hash.startsWith(prefix)) break;
    nonce++;
  }

  // look like a browser: spend a moment before submitting the proof
  await sleep(1500 + Math.floor(Math.random() * 1500));
  const passUrl =
    `${BASE}/.within.website/x/cmd/anubis/api/pass-challenge` +
    `?id=${challenge.id}&response=${hash}&nonce=${nonce}` +
    `&redir=${encodeURIComponent(`/u/${USER}/`)}&elapsedTime=2000`;
  await get(passUrl);
  return true;
}

async function fetchPage(url) {
  let res = await get(url);
  let body = await res.text();
  if (body.includes('anubis_challenge')) {
    await authenticate(body);
    res = await get(url);
    body = await res.text();
  }
  if (body.includes('anubis_challenge')) {
    throw new Error('Backloggd bot check could not be passed');
  }
  if (res.status !== 200) {
    throw new Error(`Backloggd returned ${res.status} for ${url}`);
  }
  return body;
}

const decodeEntities = (s) =>
  s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");

function parseGames(html) {
  const games = [];
  const cardRe =
    /<div class="card mx-auto game-cover quick-access(?: user-rating)?" game_id="(\d+)"(?:\s+data-rating="(\d+)")?\s*>[\s\S]*?<a href="\/games\/([a-z0-9-]+)\/?"[\s\S]*?alt="([^"]*)"/g;
  let m;
  while ((m = cardRe.exec(html))) {
    games.push({
      id: m[1],
      rating: m[2] ? Number(m[2]) : null,
      slug: m[3],
      title: decodeEntities(m[4]),
    });
  }
  return games;
}

async function scrapeLibrary() {
  const library = { user: USER };
  for (const status of STATUSES) {
    const html = await fetchPage(`${BASE}/u/${USER}/games/${status}/`);
    library[status] = parseGames(html);
    await sleep(1000);
  }
  return library;
}

export async function getGamesLibrary() {
  try {
    const data = await scrapeLibrary();
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(path.join(CACHE_DIR, 'backloggd.json'), JSON.stringify(data));
    return data;
  } catch (err) {
    try {
      const cached = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, 'backloggd.json'), 'utf8'));
      console.warn(`[backloggd] scrape failed (${err.message}), using cached copy`);
      return cached;
    } catch {
      throw err;
    }
  }
}
