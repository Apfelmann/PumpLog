# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Dependencies zuerst (für besseres Caching)
COPY *.csproj ./
RUN dotnet restore

# Source Code kopieren und bauen
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

# Nicht als root laufen (Security Best Practice)
RUN adduser --disabled-password --gecos '' appuser
USER appuser

COPY --from=build /app/publish .

# Port konfigurieren
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "PumpLogApi.dll"]
