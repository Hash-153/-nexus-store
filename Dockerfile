# Multi-stage production container
FROM node:22-alpine AS runner

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json tsconfig.json ./

# Copy source code and tests
COPY src/ ./src/
COPY tests/ ./tests/

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose HTTP port
EXPOSE 3000

# Run health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the enterprise server
CMD ["node", "--experimental-transform-types", "src/index.ts"]
