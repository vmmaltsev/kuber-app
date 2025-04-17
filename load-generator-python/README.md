# load-generator-python

Генератор нагрузки для API (Golang/Node) с поддержкой Docker, .env и graceful shutdown.

## Архитектура
- **main.py** — точка входа, управление процессом, graceful shutdown
- **config.py** — парсинг переменных окружения
- **api.py** — отправка запросов к API
- **requirements.txt** — зависимости (версии зафиксированы)
- **docker-healthcheck.sh** — healthcheck для контейнера

## Переменные окружения
- `BASE_URL` — базовый URL для API (по умолчанию http://localhost:8080)
- `TARGETS` — целевые сервисы (golang,node)
- `DELAY_MS` — задержка между запросами (мс)
- `LOG_LEVEL` — уровень логирования (INFO, DEBUG и т.д.)

Пример: см. `.env.example`

## Запуск
```sh
pip install -r requirements.txt
python main.py
```

## Docker
```sh
docker build -t load-generator .
docker run --env-file .env load-generator
```

## Best practices
- Non-root Docker
- HEALTHCHECK через exec-скрипт
- .dockerignore для ускорения сборки
- Версионированные зависимости
- Graceful shutdown
- Логирование с уровнем через переменные окружения

## Тесты
(рекомендуется добавить pytest для тестирования config и api) 