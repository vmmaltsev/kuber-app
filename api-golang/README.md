# api-golang

Микросервис на Go с REST API, PostgreSQL и Gin.

## Архитектура

- **main.go** — инициализация зависимостей, запуск сервера
- **handlers/** — HTTP-обработчики, только работа с HTTP и вызовы сервисов
- **internal/service/** — бизнес-логика, RequestService, интерфейсы для моков
- **database/** — работа с БД, реализация интерфейса RequestRepository
- **test/** — тесты для сервисов и обработчиков, зависимости мокируются

## Запуск

```sh
git clone ...
cd api-golang
go mod tidy
go run main.go
```

## Переменные окружения

- `PORT` — порт сервера (по умолчанию 8000)
- `DATABASE_URL` — строка подключения к PostgreSQL
- `DATABASE_URL_FILE` — путь к файлу с DATABASE_URL (альтернатива)

## Эндпоинты

- `GET /` — статистика и время
- `GET /ping` — ping endpoint
- `GET /healthz` — healthcheck для k8s/docker

## Тесты

```sh
go test ./...
```

Тесты покрывают бизнес-логику и обработчики, зависимости мокируются через интерфейсы.

## Best practices
- Graceful shutdown
- Structured logging (zerolog)
- Конфиги через envconfig
- Handlers и роутинг вынесены отдельно
- internal/ для бизнес-логики
- Docker-ready 