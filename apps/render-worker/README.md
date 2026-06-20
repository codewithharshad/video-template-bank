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

> **Only deploy `@video-lib/render-worker` on Railway.** Your Next.js app (`@video-lib/web`) should stay on **Vercel** — delete the `@video-lib/web` service from Railway if it was auto-created.

1. Create a new project at [railway.app](https://railway.app) → **Deploy from GitHub repo**
2. Add **one service** for the render worker (uses `apps/render-worker/railway.toml` + Dockerfile)
3. Add environment variables on the **render-worker** service:
   - `RENDER_WORKER_SECRET` — generate with `openssl rand -hex 32`
   - `PORT` — Railway sets this automatically
4. Deploy and copy the public URL (e.g. `https://your-app.up.railway.app`)
5. If build fails, open **Deployments → View logs** — usually a missing env var or monorepo workspace issue (fixed in latest Dockerfile)

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

**ProRes 4444 transparent MOV needs a lot of RAM.** If you see `FFmpeg quit with code null (SIGKILL)`, Railway ran out of memory.

1. Railway → **render-worker** → **Settings** → **Resources**
2. Set **Memory to 8 GB** (minimum **4 GB** for short overlays)
3. Redeploy

Optional env vars on the worker:

| Variable | Default on Railway | Purpose |
|----------|-------------------|---------|
| `REMOTION_CONCURRENCY` | `1` | Parallel frame renders (keep at 1 on small instances) |
| `RENDER_CONCURRENCY` | same as above | Alias for `REMOTION_CONCURRENCY` |
