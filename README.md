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

Videos render **in your browser** using Remotion's `@remotion/web-renderer` (WebCodecs):

- **MP4** — H.264, works in Chrome 94+
- **WebM + Alpha** — VP9 with transparent background for NLE compositing

No server upload required. For high-volume production, wire Remotion Lambda next.
- [ ] Add Stripe billing (free / creator / pro tiers)
- [ ] AI script → template recommendation
- [ ] Creator marketplace for uploaded templates
