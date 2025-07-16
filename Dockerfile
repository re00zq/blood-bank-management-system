# Use official Node.js 18 as base image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Expose the application port
EXPOSE 3000

# Default command (overridden in docker-compose)
CMD ["npm", "run", "start:prod"]