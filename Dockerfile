# Stage 1: Build
FROM node:20-alpine AS builder

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and pre-generated prisma client
COPY . .

RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Install runtime dependencies for Prisma engine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

# Create uploads directory
RUN mkdir -p uploads

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
