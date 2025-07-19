# Use an official Node.js runtime as a base image
FROM node:22

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the full project
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:prod"]
