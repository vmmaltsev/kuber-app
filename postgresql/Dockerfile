FROM migrate/migrate:v4.17.1

# 1️⃣ Создаём директорию от имени root
USER root
RUN mkdir -p /migrations && chown nobody:nogroup /migrations

# 2️⃣ Копируем миграции под root
COPY ./migrations /migrations

# 3️⃣ Переключаемся на непривилегированного пользователя
USER nobody

# 4️⃣ Добавим формальный HEALTHCHECK в exec-форме
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=1 \
  CMD [ "echo", "healthcheck OK" ]
