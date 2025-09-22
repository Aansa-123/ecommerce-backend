# Use Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install --production

# Copy rest of the code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start app
CMD ["npm", "start"]
