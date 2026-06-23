FROM oven/bun:1-alpine

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Ensure uploads directory exists and script is executable
RUN mkdir -p uploads && chmod +x docker-entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Start the application with entrypoint
ENTRYPOINT ["./docker-entrypoint.sh"]
