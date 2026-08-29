FROM node:24-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:24-bookworm-slim AS builder

WORKDIR /app

ARG NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED=false
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED=${NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV HOME=/home/nextjs
ENV XDG_CONFIG_HOME=/tmp/workcv-chromium-config
ENV XDG_CACHE_HOME=/tmp/workcv-chromium-cache

RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium fonts-liberation \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --create-home nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/scripts/pdf-runtime-smoke.mjs ./scripts/pdf-runtime-smoke.mjs
COPY --from=builder --chown=nextjs:nodejs /app/scripts/prepare-growth-schema.mjs ./scripts/prepare-growth-schema.mjs
COPY --from=builder --chown=nextjs:nodejs /app/scripts/growth-report-core.mjs ./scripts/growth-report-core.mjs
COPY --from=builder --chown=nextjs:nodejs /app/scripts/report-growth.mjs ./scripts/report-growth.mjs
COPY --from=builder --chown=nextjs:nodejs /app/scripts/cleanup-growth-events.mjs ./scripts/cleanup-growth-events.mjs

USER nextjs

RUN node scripts/pdf-runtime-smoke.mjs

EXPOSE 3000

CMD ["node", "server.js"]
