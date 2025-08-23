# Simple multi-stage Dockerfile for Next.js application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci && npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["npm","start"]
