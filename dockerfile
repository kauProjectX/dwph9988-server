# Use Alpine-based Node.js 20.x LTS image
FROM node:20-alpine

# Install necessary build tools
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy app source
COPY . .

# Start the application with the PORT environment variable
CMD ["node", "index.js"]
