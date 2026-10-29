# leen2233's website

A static personal site styled as a vim/Gruvbox editor, built with a
zero-dependency Node script. No frameworks, no runtime JS libraries —
just plain HTML, CSS and ~1 KB of vanilla JavaScript per page.

## Structure

- `build.mjs` — build script: reads markdown, fetches data, writes `site/`
- `lib/md.mjs` — minimal markdown → HTML converter (with naive syntax highlighting)
- `lib/data.mjs` — Hardcover + Last.fm API clients (successful responses cached to `.cache/`)
- `lib/render.mjs` — HTML templates (editor chrome + pages)
- `assets/` — `style.css` and `site.js` (copied verbatim into the output)
- `serve.mjs` — tiny static server for previewing `site/`
- `content/` — markdown source (pages, posts)

## Usage

```bash
npm run build     # regenerate site/ (fetches fresh books/music data)
npm run preview   # serve site/ at http://localhost:8787
npm run dev       # rebuild automatically when content/lib/assets change
```

Deploy by pointing nginx/caddy at `site/` (pages use `dir/index.html`
so clean URLs work on any static server). Refresh books/music data
with a cron job — run `crontab -e` and add, for example:

```cron
# refresh books/music data every hour
0 * * * * cd ~/projects/sp/blog && node build.mjs >> ~/.cache/blog-build.log 2>&1
```

Use `0 0 * * *` instead of `0 * * * *` for a daily refresh.

## Environment

`.env` (gitignored):

- `HARDCOVER_API_KEY` — hardcover.app personal access token
- `LASTFM_API_KEY`, `LASTFM_USERNAME` — Last.fm read API
- `LASTFM_SHARED_SECRET` — only needed for write/auth API calls
- `HARDCOVER_USER_ID` — optional override, otherwise resolved from the token
