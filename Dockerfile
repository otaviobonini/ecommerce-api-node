FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY dist/ ./dist/
COPY prisma/ ./prisma/
RUN npx prisma generate
CMD ["node", "dist/app/server.js"]