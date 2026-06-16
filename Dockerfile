FROM oven/bun:alpine

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/app.ts"]
