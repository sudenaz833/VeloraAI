# 1. Aşama: Derleme (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Bağımlılık yönetim dosyalarını kopyalayıp kütüphaneleri kuruyoruz
COPY package*.json ./
RUN npm install

# Tüm frontend kodunu içeri aktarıp projeyi derliyoruz
COPY . .
RUN npm run build

# 2. Aşama: Canlı Ortam Sunucusu (Nginx)
FROM nginx:alpine

# EĞER PROJE VITE + REACT İSE alttaki satırı kullan (dist klasörünü kopyalar):
COPY --from=build /app/dist /usr/share/nginx/html

# EĞER PROJE CREATE-REACT-APP İSE (dist hata verirse) üstteki satırı silip alttakini açabilirsin:
# COPY --from=build /app/build /usr/share/nginx/html

# React Router (Sayfa yönlendirmeleri) canlıda düzgün çalışsın diye Nginx konfigürasyonu
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]