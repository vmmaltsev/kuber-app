# === Этап сборки приложения (Builder Stage) ===
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./
RUN CGO_ENABLED=0 go build -o app .

# === Финальный образ (Final Stage) ===
FROM alpine:3.20

RUN apk --no-cache add ca-certificates curl

WORKDIR /app
COPY --from=builder /app/app /app/app
ENV PORT=8000

# Создание непривилегированного пользователя и группы, изменение прав доступа
RUN addgroup -S nonroot && \
    adduser -S non-root -G nonroot && \
    chown -R non-root:nonroot /app

# Переключение на непривилегированного пользователя
USER non-root

# Настройка проверки работоспособности контейнера (с командой CMD, выполняемой от non-root)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

EXPOSE 8000

ENTRYPOINT ["/app/app"]
