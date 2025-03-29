FROM node:18-bullseye-slim

WORKDIR /app

# Make sure we install devDependencies
ENV NODE_ENV=development

# Copy package.json and package-lock.json first
COPY package*.json ./

# Remove any existing node_modules or lock file to force a clean install
RUN rm -rf node_modules package-lock.json

# Install all dependencies (including devDependencies) and skip optional ones
RUN npm install --no-optional

# Copy the rest of your code
COPY . .

# # Install any needed OS packages for Alpine
# RUN apk add --no-cache libc6-compat

EXPOSE 5173

CMD ["npm", "run", "dev"]
