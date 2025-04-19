# syntax=docker/dockerfile:1
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod tidy && go build -o api-golang main.go

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/api-golang .
COPY healthcheck.sh .
RUN chmod +x healthcheck.sh

# Добавляем непривилегированного пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8000
ENV PORT=8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["./healthcheck.sh"]

CMD ["./api-golang"]
