# Use Alpine-based Node.js 20.x LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install necessary build tools and curl
RUN apk add --no-cache python3 make g++ curl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Remove unnecessary build tools
RUN apk del python3 make g++

# Copy app source
COPY . .

# Create log directory during build
RUN mkdir -p /usr/src/app/logs

# Expose port 3000 for clarity (or specify a different port if needed)
EXPOSE 3000

# Start the application with the PORT environment variable
CMD ["node", "index.js"]
