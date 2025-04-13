FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем приложение
COPY . .

# 🔐 Добавим непривилегированного пользователя
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser \
    && chown -R appuser:appgroup /app

# 🔐 Переключимся на непривилегированного пользователя
USER appuser

# 🌡 HEALTHCHECK: проверяет, работает ли главный процесс (по PID)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD pgrep -f main.py || exit 1

CMD ["python", "main.py"]
