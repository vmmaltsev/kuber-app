FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./
RUN CGO_ENABLED=0 go build -o app .

FROM alpine:3.20
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /app/app /app/app

ENV PORT=8000

EXPOSE 8000

ENTRYPOINT ["/app/app"]
