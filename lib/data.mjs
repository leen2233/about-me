// Build-time data fetching for Hardcover (GraphQL) and Last.fm (REST).
// Successful results are cached to .cache/ so a failed API call never
// breaks the build while a cached copy exists.

import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readCache(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, name), 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(name, data) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, name), JSON.stringify(data));
}

async function cached(name, fetcher) {
  try {
    const data = await fetcher();
    writeCache(name, data);
    return data;
  } catch (err) {
    const cachedData = readCache(name);
    if (cachedData) {
      console.warn(`[data] ${name}: fetch failed (${err.message}), using cached copy`);
      return cachedData;
    }
    throw err;
  }
}

// ---------------------------------------------------------------- Hardcover

const HARDCOVER_API_URL = 'https://api.hardcover.app/v1/graphql';

async function graphql(query, variables) {
  const apiKey = process.env.HARDCOVER_API_KEY;
  if (!apiKey) throw new Error('HARDCOVER_API_KEY is not set');

  const res = await fetch(HARDCOVER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Hardcover API error: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? 'Hardcover GraphQL error');
  return json.data;
}

async function getUserId() {
  if (process.env.HARDCOVER_USER_ID) return Number(process.env.HARDCOVER_USER_ID);
  const data = await graphql('query Me { me { id } }');
  const id = data.me[0]?.id;
  if (!id) throw new Error('Could not resolve Hardcover user id');
  return id;
}

const LIBRARY_QUERY = `
query Library($userId: Int!) {
  read: user_books(
    where: { user_id: { _eq: $userId }, status_id: { _eq: 3 } }
    order_by: { date_added: desc }
    limit: 200
  ) {
    rating
    last_read_date
    first_read_date
    date_added
    user_book_reads { finished_at }
    book {
      title
      slug
      contributions {
        contribution
        author { name }
      }
    }
  }
  want: user_books(
    where: { user_id: { _eq: $userId }, status_id: { _eq: 1 } }
    order_by: { date_added: desc }
    limit: 200
  ) {
    rating
    date_added
    book {
      title
      slug
      contributions {
        contribution
        author { name }
      }
    }
  }
}
`;

function toAuthors(contributions) {
  return contributions
    .filter((c) => c.contribution === null || c.contribution === 'Author')
    .map((c) => c.author.name);
}

function finishedDate(entry) {
  const readDates = entry.user_book_reads
    .map((r) => r.finished_at)
    .filter(Boolean)
    .sort();
  return readDates[readDates.length - 1] ?? entry.last_read_date ?? entry.first_read_date ?? null;
}

function toBook(entry, date) {
  return {
    title: entry.book.title,
    authors: toAuthors(entry.book.contributions),
    rating: entry.rating,
    date,
    slug: entry.book.slug,
  };
}

const byDateDesc = (a, b) => (b.date ?? '').localeCompare(a.date ?? '');

export function getLibrary() {
  return cached('hardcover.json', async () => {
    const userId = await getUserId();
    const data = await graphql(LIBRARY_QUERY, { userId });
    return {
      read: data.read.map((e) => toBook(e, finishedDate(e))).sort(byDateDesc),
      wantToRead: data.want.map((e) => toBook(e, e.date_added)).sort(byDateDesc),
    };
  });
}

// ------------------------------------------------------------------ Last.fm

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const LIMIT = 10;

const asArray = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

async function lastfm(method, params = {}) {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) throw new Error('LASTFM_API_KEY is not set');
  const username = process.env.LASTFM_USERNAME;
  if (!username) throw new Error('LASTFM_USERNAME is not set');

  const search = new URLSearchParams({
    method,
    user: username,
    api_key: apiKey,
    format: 'json',
    limit: String(LIMIT),
    ...params,
  });

  const res = await fetch(`${LASTFM_API_URL}?${search}`);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Last.fm API error: ${res.status} ${body.slice(0, 120)}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(json.message ?? 'Last.fm API error');
  return json;
}

// Last.fm occasionally throttles bursts or drops connections; retry once.
async function lastfmRetry(method, params) {
  try {
    return await lastfm(method, params);
  } catch (err) {
    await sleep(1500);
    return lastfm(method, params);
  }
}

function toTopItem(raw) {
  return {
    name: raw.name,
    subtitle: raw.artist?.['#text'] ?? null,
    playcount: Number(raw.playcount),
    url: raw.url,
  };
}

const TOP_ITEM_KEYS = { topartists: 'artist', toptracks: 'track', topalbums: 'album' };

async function getTop(kind, period) {
  const data = await lastfmRetry(`user.get${kind}`, { period });
  return asArray(data[kind]?.[TOP_ITEM_KEYS[kind]]).map(toTopItem);
}

export function getMusicData() {
  return cached('lastfm.json', async () => {
    const info = await lastfmRetry('user.getinfo', {});
    const recentRes = await lastfmRetry('user.getrecenttracks', {});
    const artistsWeek = await getTop('topartists', '7day');
    const artistsOverall = await getTop('topartists', 'overall');
    const tracksWeek = await getTop('toptracks', '7day');
    const tracksOverall = await getTop('toptracks', 'overall');
    const albumsWeek = await getTop('topalbums', '7day');
    const albumsOverall = await getTop('topalbums', 'overall');

    const user = info.user;
    const memberSince = new Date(Number(user.registered.unixtime) * 1000).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });

    const recent = asArray(recentRes.recenttracks.track)
      .filter((t) => t.date || t['@attr']?.nowplaying === 'true')
      .map((t) => ({
        name: t.name,
        artist: t.artist['#text'],
        album: t.album?.['#text'] || null,
        url: t.url,
        playedAt: t.date ? new Date(Number(t.date.uts) * 1000).toISOString() : null,
        nowPlaying: t['@attr']?.nowplaying === 'true',
      }));

    return {
      user: {
        name: user.name,
        url: user.url,
        scrobbles: Number(user.playcount),
        memberSince,
      },
      recent,
      topArtists: { week: artistsWeek, overall: artistsOverall },
      topTracks: { week: tracksWeek, overall: tracksOverall },
      topAlbums: { week: albumsWeek, overall: albumsOverall },
    };
  });
}
