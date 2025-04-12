# === Этап сборки приложения (Builder Stage) ===
FROM golang:1.24-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей и загрузка модулей
COPY go.mod go.sum ./
RUN go mod download

# Копирование исходного кода и сборка приложения
COPY . ./
RUN CGO_ENABLED=0 go build -o app .

# === Финальный образ (Final Stage) ===
FROM alpine:3.20

# Установка необходимых пакетов
RUN apk --no-cache add ca-certificates curl

# Установка рабочей директории
WORKDIR /app

# Копирование собранного приложения из предыдущей стадии
COPY --from=builder /app/app /app/app

# Задание переменной окружения для порта
ENV PORT=8000

# Создание непривилегированного пользователя и группы, изменение прав доступа
RUN addgroup -S nonroot && \
    adduser -S non-root -G nonroot && \
    chown -R non-root:nonroot /app

# Настройка проверки работоспособности контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Объявление порта для публикации
EXPOSE 8000

# Переключение на непривилегированного пользователя
USER non-root

# Запуск приложения
ENTRYPOINT ["/app/app"]
