# Build stage
FROM node:20-bookworm AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

RUN npm run build

# Production stage
FROM node:20-bookworm AS production

# Create app directory
WORKDIR /app

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs hjh

# Copy built application from builder stage
COPY --from=builder --chown=hjh:nodejs /app /app

RUN chown -R hjh:nodejs /app/src/server/db

# Switch to non-root user
USER hjh

# Expose port
EXPOSE 3001

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD [ "npm", "start" ]
