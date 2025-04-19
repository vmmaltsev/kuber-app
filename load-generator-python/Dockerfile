FROM python:3.12-slim-bookworm

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем приложение и скрипт проверки
COPY . .
COPY docker-healthcheck.sh /usr/local/bin/docker-healthcheck.sh

# Создание безопасного пользователя и настройка прав
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser && \
    chown -R appuser:appgroup /app && \
    chmod +x /usr/local/bin/docker-healthcheck.sh

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["/usr/local/bin/docker-healthcheck.sh"]

CMD ["python", "main.py"]
