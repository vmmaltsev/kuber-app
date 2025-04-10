# Demo Application

Многосервисное приложение с микросервисной архитектурой, включающее:
- API на Golang
- API на Node.js
- Фронтенд на React
- Генератор нагрузки на Python
- База данных PostgreSQL

## CI/CD Pipeline

Проект настроен для непрерывной интеграции и доставки с использованием GitHub Actions.

### Настройка GitHub Actions

Для правильной работы пайплайна вам необходимо добавить следующие секреты (secrets) в настройках вашего GitHub репозитория:

1. `DOCKER_HUB_USERNAME` - ваше имя пользователя на Docker Hub
2. `DOCKER_HUB_TOKEN` - ваш токен доступа Docker Hub (не пароль)

#### Шаги для создания токена Docker Hub:

1. Войдите в свою учетную запись на [Docker Hub](https://hub.docker.com)
2. Перейдите в Account Settings -> Security -> New Access Token
3. Дайте токену имя, например "GitHub Actions"
4. Выберите права доступа (обычно хватает "Read & Write")
5. Скопируйте созданный токен (он будет показан только один раз)

#### Добавление секретов в GitHub:

1. Перейдите в репозиторий на GitHub
2. Нажмите на "Settings" -> "Secrets and variables" -> "Actions"
3. Нажмите "New repository secret"
4. Добавьте оба секрета:
   - Name: DOCKER_HUB_USERNAME, Value: ваше_имя_пользователя
   - Name: DOCKER_HUB_TOKEN, Value: ваш_токен

### Что делает пайплайн

1. Активируется при пуше в ветку `main`
2. Логинится в Docker Hub с использованием ваших учетных данных
3. Собирает Docker-образы для каждого сервиса:
   - api-golang
   - api-node
   - client-react
   - load-generator-python
   - postgresql
4. Публикует образы в Docker Hub с тегами:
   - `latest`
   - Динамический тег в формате `YYYYMMDD-{short-sha}` (например, `20250410-a1b2c3d`)
5. Создает файл VERSION.md с информацией о версиях всех опубликованных образов

### Использование опубликованных образов

После успешного запуска пайплайна, образы будут доступны в Docker Hub:

```bash
docker pull username/demo-app-golang:latest
docker pull username/demo-app-node:latest
docker pull username/demo-app-client:latest
docker pull username/demo-app-load-generator:latest
docker pull username/demo-app-postgresql:latest
```

Для использования последней версии с конкретным тегом:

```bash
docker pull username/demo-app-golang:20250410-a1b2c3d
```

## Локальная разработка

Для локального запуска используйте docker-compose:

```bash
docker-compose up -d
```

Для сборки всех образов перед запуском:

```bash
docker-compose build
docker-compose up -d
```

## Сервисы

- **API Golang**: REST API сервис на Golang с использованием Gin и PostgreSQL
- **API Node**: REST API сервис на Node.js с Express и PostgreSQL
- **Client React**: Клиентское приложение на React с Vite
- **Load Generator**: Генератор нагрузки на Python
- **PostgreSQL**: База данных с автоматическими миграциями