# Build stage for frontend
FROM node:16-alpine AS builder

# Set the working directory for frontend build
WORKDIR /usr/src/frontend

# Copy frontend package.json and package-lock.json
COPY frontend/package*.json ./

# Install frontend dependencies (including dev dependencies for build)
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# ------------------------------------

# Production stage
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Copy built frontend from builder stage
COPY --from=builder /usr/src/frontend/build ./frontend/build

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the application
CMD ["node", "index.js"]