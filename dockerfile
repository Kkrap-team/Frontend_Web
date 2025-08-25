# 1) Build stage: Vite 빌드
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY .env.production .
ENV NODE_ENV=production
RUN npm run build

# 2) Serve stage: Nginx로 정적 서빙
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html