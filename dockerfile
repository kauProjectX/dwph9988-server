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

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]