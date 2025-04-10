FROM node:slim AS base

# Set environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package manifests first for better caching
COPY package*.json ./

# Install only production dependencies with cache mount
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production

# Use non-root user
USER node

# Copy healthcheck scripts (optional file or folder)
COPY --chown=node:node ./healthcheck/ ./healthcheck/

# Copy source code from src/ to working directory
COPY --chown=node:node ./src/ ./

# Application listens on port 3000
EXPOSE 3000

# Run application
CMD ["node", "index.js"]
