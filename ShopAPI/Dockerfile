# 1. Aşama: Derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sadece proje dosyasını kopyalayıp bağımlılıkları indiriyoruz
COPY *.csproj ./
RUN dotnet restore

# Kalan tüm backend kodlarını kopyalayıp derliyoruz
COPY . ./
RUN dotnet publish -c Release -o /app

# 2. Aşama: Çalıştırma (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

EXPOSE 8080
ENTRYPOINT ["dotnet", "ShopAPI.csproj"] 
