FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/scripts ./scripts
EXPOSE 3002
CMD ["node", "--max-old-space-size=512", "dist/index.js"]
