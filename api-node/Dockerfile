FROM node:22-bookworm-slim

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Копируем зависимости и устанавливаем их
COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production && \
    rm -rf /usr/src/app/.npm

# Копируем исходный код приложения и healthcheck
COPY --chown=node:node ./src ./src
COPY --chown=node:node healthcheck.sh .

# Настраиваем права доступа и запуск от non-root
RUN chmod +x healthcheck.sh

USER node

EXPOSE 3000

# HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["./healthcheck.sh"]

CMD ["node", "src/index.js"]
