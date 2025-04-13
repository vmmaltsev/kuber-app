# === Stage 1: Build React App ===
FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci

COPY . .

RUN npm run build

# === Stage 2: Serve with secure nginx ===
FROM nginx:stable-alpine AS prod

# Создаём каталоги и настраиваем права (для временных файлов nginx)
RUN mkdir -p /tmp/nginx/cache /tmp/nginx/run /tmp/nginx/logs \
    && chmod -R 777 /tmp/nginx

# Копируем конфигурации
COPY --link nginx.conf /etc/nginx/conf.d/default.conf
COPY --link main-nginx.conf /tmp/nginx.conf

# Копируем собранное приложение
COPY --link --from=build /usr/src/app/dist/ /usr/share/nginx/html

# 🔐 Создание непривилегированного пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html

# 🔐 Переключение на непривилегированного пользователя
USER appuser

# 🌡 HEALTHCHECK для React + nginx
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["wget", "--spider", "-q", "http://localhost:8080/"]

# Открываем порт
EXPOSE 8080

# Запуск nginx
CMD ["nginx", "-c", "/tmp/nginx.conf"]
