FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# For a local dev container, we run the dev server
CMD ["npm", "run", "dev"]
