# Use Node.js LTS version
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all project files
COPY . .

# Expose the port (use the same as your .env PORT)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
