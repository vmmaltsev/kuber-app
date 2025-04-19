FROM node:22-bookworm-slim

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости с использованием кэша, без попытки удалить его вручную
RUN --mount=type=cache,target=/usr/src/app/.npm-cache \
    npm set cache /usr/src/app/.npm-cache && \
    npm ci --only=production

# Копируем исходный код и healthcheck-скрипт с установкой прав
COPY --chown=node:node ./src ./src
COPY --chown=node:node healthcheck.sh .

RUN chmod +x healthcheck.sh

# Переключаемся на non-root пользователя node
USER node

EXPOSE 3000

# HEALTHCHECK в exec-форме (надёжнее)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["./healthcheck.sh"]

CMD ["node", "src/index.js"]
