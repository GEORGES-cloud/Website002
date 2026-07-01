# Zeñorio · imagen de producción
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.mjs ./
COPY public ./public
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.mjs"]
