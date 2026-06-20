FROM node:22-bookworm

RUN apt-get update && apt-get install -y \
  ffmpeg \
  curl \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnss3 \
  libpango-1.0-0 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxkbcommon0 \
  libxrandr2 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages packages
COPY apps/web/package.json apps/web/package.json
COPY apps/web/src apps/web/src
COPY apps/render-worker apps/render-worker

RUN npm ci --workspace=@video-lib/render-worker --include-workspace-root

WORKDIR /app/apps/render-worker

ENV NODE_ENV=production
ENV REMOTION_ENTRYPOINT=/app/apps/web/src/remotion/register-root.ts
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
