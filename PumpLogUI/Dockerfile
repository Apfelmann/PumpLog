# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Dependencies zuerst (für besseres Caching)
COPY package*.json ./
RUN npm ci

# Source Code kopieren und bauen
COPY . .
RUN npm run build

# Stage 2: Production mit nginx
FROM nginx:alpine

# Nginx Konfiguration für SPA (React Router)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build-Artefakte kopieren
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
