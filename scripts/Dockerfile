FROM node:22-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl unzip ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

CMD ["node", "--max-old-space-size=512", "dist/run-all.js"]
