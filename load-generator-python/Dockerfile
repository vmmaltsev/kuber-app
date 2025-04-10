FROM python:3.12-slim

WORKDIR /app

# Копируем зависимости и устанавливаем
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходники
COPY main.py .
COPY .env .

CMD ["python", "main.py"]
