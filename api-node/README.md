# api-node

Минимальный REST API на Express + PostgreSQL с healthcheck и CSRF-защитой.

## Архитектура
- **src/db.js** — работа с БД
- **src/service/requestService.js** — бизнес-логика (сервис)
- **src/routes/main.js** — обработчики (роуты)
- **src/index.js** — инициализация, middlewares, DI
- **test/** — тесты для сервисов и роутов (jest, supertest)

## Запуск
```sh
npm ci
npm start
```

## Переменные окружения
- `PORT` — порт сервера (по умолчанию 3000)
- `DATABASE_URL` — строка подключения к PostgreSQL
- `DATABASE_URL_FILE` — путь к файлу с DATABASE_URL (альтернатива)
- `CSRF_SECRET` — секрет для CSRF (обязательно для продакшена)

## Эндпоинты
- `GET /` — статистика и время
- `GET /ping` — healthcheck
- `GET /csrf-token` — получить CSRF-токен

## Тесты
```sh
npm test
```

## Best practices
- Non-root Docker
- HEALTHCHECK через /ping
- helmet, cors, централизованный error handler
- DI сервисов
- Покрытие тестами бизнес-логики и роутов 