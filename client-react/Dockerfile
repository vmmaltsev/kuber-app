# === Stage 1: Build React App ===
FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci

COPY . .

RUN npm run build

# === Stage 2: Serve with secure nginx ===
FROM nginx:stable-alpine AS prod

# Create working directories for caches and logs
RUN mkdir -p /tmp/nginx/cache /tmp/nginx/run /tmp/nginx/logs \
    && chmod -R 777 /tmp/nginx

# Copy Nginx configurations
COPY --link nginx.conf /etc/nginx/conf.d/default.conf
COPY --link main-nginx.conf /tmp/nginx.conf

# Copy built React application
COPY --link --from=build /usr/src/app/dist/ /usr/share/nginx/html

# Expose port
EXPOSE 8080

# Run NGINX
CMD ["nginx", "-c", "/tmp/nginx.conf"]
