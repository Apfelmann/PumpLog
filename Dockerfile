# ===========================================
# PumpLog - Combined Dockerfile
# Frontend (React/Vite) + Backend (ASP.NET 9)
# ===========================================

# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend
COPY PumpLogUI/package*.json ./
RUN npm ci
COPY PumpLogUI/ ./
RUN npm run build

# Stage 2: Build Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build

WORKDIR /app/backend
COPY PumpLogApi/*.csproj ./
RUN dotnet restore
COPY PumpLogApi/ ./
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 3: Runtime - ASP.NET serves API + static files
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

# Frontend Build-Artefakte ins wwwroot kopieren
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Backend kopieren
COPY --from=backend-build /app/publish ./

# Port konfigurieren
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "PumpLogApi.dll"]
