# HookForge

Viral motion graphics platform for creators. Browse templates, customize with your brand kit, preview live with Remotion, and export MP4/WebM with alpha.

## Stack

- **Next.js 15** — web app
- **Remotion** — programmatic video compositions + live preview
- **@video-lib/template-sdk** — shared template catalog and types

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If port 3000 is busy, stop the old process first:

```bash
lsof -ti :3000 | xargs kill -9
npm run dev
```

## Troubleshooting

**Blank preview / can't play:** Hard-refresh the page (Cmd+Shift+R). The preview loads client-side — wait for "Loading preview..." to finish, then use the player controls or click the video to play.

**404 Template not found:** You're likely on a stale dev server. Kill port 3000 and restart from `video-lib/`.

**Export disabled or fails:** Use **Chrome** and export as **MP4** first. WebM+Alpha needs VP9 support (Safari often lacks this).


## Project structure

```
video-lib/
├── apps/web/                 # Next.js app
│   └── src/remotion/         # Video compositions
└── packages/template-sdk/    # Template catalog & types
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/hooks` | Template library with filters |
| `/hooks/[slug]` | Live editor + export |

## Export

**Overlay effects** (VideoEffects-style):

- **Transparent MOV** — server-rendered ProRes 4444 with alpha, cropped to content
- **Solid MOV** — Pro templates keep the card background color
- Falls back to browser WebM if server export is unavailable

**Hooks** export as full-frame MP4 in the browser.

### Server export setup (transparent MOV)

**Production (animably.com):** deploy the render worker — see [`apps/render-worker/README.md`](apps/render-worker/README.md). Set `RENDER_WORKER_URL` and `RENDER_WORKER_SECRET` on Vercel.

**Local dev** requires **ffmpeg**:

```bash
brew install ffmpeg
npm run dev
```

Check health: `GET http://localhost:3000/api/export/health`

Disable server export: `ENABLE_SERVER_EXPORT=false`

### Browser export (fallback)

Uses `@remotion/web-renderer` (WebCodecs) when server export is off:

- **WebM + Alpha** — VP8/VP9 with transparent background
- **MP4** — H.264 in Chrome 94+
- [ ] Add Stripe billing (free / creator / pro tiers)
- [ ] AI script → template recommendation
- [ ] Creator marketplace for uploaded templates
