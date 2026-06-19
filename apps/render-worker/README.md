# Render worker

Dedicated ffmpeg + Remotion server for **transparent MOV (ProRes)** exports. The Vercel app proxies render requests here when `RENDER_WORKER_URL` is set.

## Local dev

```bash
# From repo root — requires ffmpeg (brew install ffmpeg)
export RENDER_WORKER_SECRET=dev-secret
export REMOTION_ENTRYPOINT=$PWD/apps/web/src/remotion/register-root.ts
npm run dev:worker
```

Health: `GET http://localhost:8080/health`

## Deploy on Railway

1. Create a new project at [railway.app](https://railway.app) → **Deploy from GitHub repo**
2. Set **Root Directory** to repo root (default)
3. Railway reads `apps/render-worker/railway.toml` and builds the Dockerfile
4. Add environment variables:
   - `RENDER_WORKER_SECRET` — generate with `openssl rand -hex 32`
   - `PORT` — Railway sets this automatically
   - `REMOTION_ENTRYPOINT` — `/app/apps/web/src/remotion/register-root.ts` (set in Dockerfile)
5. Deploy and copy the public URL (e.g. `https://your-app.up.railway.app`)

## Connect Vercel

In [Vercel project settings → Environment Variables](https://vercel.com) for **animably**:

| Variable | Value |
|----------|--------|
| `RENDER_WORKER_URL` | `https://your-app.up.railway.app` |
| `RENDER_WORKER_SECRET` | same secret as Railway |

Redeploy Vercel. `/api/export/health` will report `available: true` and visitors get **Export transparent MOV**.

## Security

- `POST /render` requires `Authorization: Bearer <RENDER_WORKER_SECRET>`
- `/health` is public (for Railway health checks)
- Auth, credits, and billing stay on Vercel — the worker only renders video

## Sizing

Start with Railway **2 vCPU / 4 GB RAM**. ProRes renders are CPU-heavy; scale up if exports time out.
