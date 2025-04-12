FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./
RUN CGO_ENABLED=0 go build -o app .

FROM alpine:3.20
RUN apk --no-cache add ca-certificates curl

WORKDIR /app
COPY --from=builder /app/app /app/app

ENV PORT=8000

# Создание непривилегированного пользователя
RUN addgroup -S nonroot && adduser -S non-root -G nonroot
RUN chown -R non-root:nonroot /app

# Настройка healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

EXPOSE 8000

# Переключение на непривилегированного пользователя
USER non-root

ENTRYPOINT ["/app/app"]
