FROM migrate/migrate:v4.17.1

# Создаём директорию, если нужно
RUN mkdir -p /migrations

# Копируем все миграции в каталог внутри контейнера
COPY ./migrations /migrations
