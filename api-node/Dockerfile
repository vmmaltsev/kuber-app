FROM node:slim AS base

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production

USER node

COPY --chown=node:node ./healthcheck/ ./healthcheck/
COPY --chown=node:node ./src/ ./

EXPOSE 3000

# Добавляем HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["curl", "-f", "http://localhost:3000/ping"]

CMD ["node", "index.js"]
