FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Run Vite dev server (not build - we need the proxy)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
