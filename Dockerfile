# 1. Use Node.js 18 (stable + supported by most platforms)
FROM node:18-alpine

# 2. Set working directory inside container
WORKDIR /usr/src/app

# 3. Copy only package files first (helps with caching)
COPY package*.json ./

# 4. Install dependencies (use npm ci if package-lock.json exists)
# Using --omit=dev to keep image small but avoids missing deps
RUN npm install --omit=dev

# 5. Copy the rest of the application code
COPY . .

# 6. Ensure .env is handled via Back4App (not copied in container!)
# Add a .dockerignore file with:
#   node_modules
#   .env
#   Dockerfile
#   .git

# 7. Expose the port your app listens on
EXPOSE 3000

# 8. Start your server
# If using ES modules ("type": "module" in package.json), node works fine
CMD ["node", "server.js"]
