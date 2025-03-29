# 1. Use Node.js 18 Alpine as a lightweight base image
FROM node:18-alpine

# 2. Set the working directory
WORKDIR /app

# Force development mode so devDependencies are installed
ENV NODE_ENV=development

# 3. Copy package files first to install dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install --no-optional && npm install -g nodemon


# 5. Copy the rest of the backend code
COPY . .

# 6. Expose port 5000
EXPOSE 5000


# 7. Run the server in dev mode (adjust if you have a production script)
CMD ["npm", "run", "dev"]