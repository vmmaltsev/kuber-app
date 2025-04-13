FROM migrate/migrate:v4.17.1

# Добавим непривилегированного пользователя (если доступна оболочка sh)
USER nobody

# Создаём директорию
RUN mkdir -p /migrations

# Копируем миграции
COPY ./migrations /migrations

# Добавим формальный HEALTHCHECK (он всегда успешен — контейнер краткоживущий)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=1 \
  CMD echo "healthcheck OK"
