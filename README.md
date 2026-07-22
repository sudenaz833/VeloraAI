# 🛍️ VELORA Cosmetics - Fullstack E-Commerce Application

![VELORA Banner](https://img.shields.io/badge/VELORA-Cosmetics-gold?style=for-the-badge)
![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon.tech-4169E1?style=for-the-badge&logo=postgresql)
![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3-orange?style=for-the-badge&logo=openai)
![Vercel](https://img.shields.io/badge/Vercel-Hosted-000000?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Render-Hosted-46E3B7?style=for-the-badge&logo=render)

Zamansız güzellik felsefesiyle tasarlanan, doğadan ilham alan lüks kozmetik markası **VELORA** için geliştirilmiş fullstack e-ticaret platformu. Artık **Yapay Zeka Destekli Kişisel Cilt Analizörü (AI Dermatologist)** entegrasyonu ile cildinize en uygun lüks bakım rutinini saniyeler içinde oluşturuyor.

---

## 🌐 Canlı Bağlantılar (Live Demo)

- 🎨 **Frontend App (Vercel):** [https://shopapi-frontend.vercel.app](https://shopapi-frontend.vercel.app)
- ⚡ **Backend REST API (Render / Swagger):** `https://<render-backend-url>.onrender.com/swagger`
- 🗄️ **Database (Neon PostgreSQL):** Serverless Postgres Cloud Database

---

## ✨ Öne Çıkan Özellikler

### 🤖 **Yapay Zeka (AI) Destekli Cilt Analizi (Velora AI Dermatologist)**
- **Kişiselleştirilmiş Cilt Analiz Testi (Skin Care Quiz):** Kullanıcının cilt tipi, yaş grubu, hassasiyet düzeyi ve cilt endişelerini (gözenek, sivilce, leke, kırışıklık, nemsizlik vb.) analiz eden interaktif anket.
- **Groq Cloud & Llama 3.3 Entegrasyonu:** Groq API aracılığıyla en son teknoloji `llama-3.3-70b-versatile` dil modeliyle entegrasyon.
- **Akıllı Ürün Eşleştirme:** Stoktaki aktif ürünlerin içerikleri ve kullanım zamanlarıyla kullanıcının endişelerini eşleştiren dinamik öneri algoritması.
- **Dermatolojik Tavsiyeler:** Yapay zeka tarafından hazırlanan Türkçe, profesyonel, akıcı ve kişiselleştirilmiş cilt bakım önerileri ile özel rutinler.

### 👤 **Kullanıcı & Güvenlik Yönetimi**
- **JWT Bearer Token** tabanlı güvenli kimlik doğrulama.
- **Kullanıcı Kaydı & Girişi** (BCrypt şifre hash'leme).
- **Rol Tabanlı Yetkilendirme (RBAC):** `Admin` ve `User` yetki kontrolleri.
- **Profil Sayfası:** Kullanıcı bilgilerini güncelleme ve geçmiş siparişleri takip etme.

### 💄 **Ürün Kataloğu & Alışveriş**
- **Kategoriye Göre Filtreleme:** Cilt Bakımı, Makyaj, Parfüm ve Setler.
- **Stok Takibi & İndirim Geri Sayımı:** İndirimli ürünler için dinamik kalan süre sayacı.
- **Ürün Detay Sayfası:** Yıldız derecelendirmesi, ortalama puan ve kullanıcı yorumları.
- **Yorum & Puanlama Sistemi:** Ürünlere 1-5 yıldız arası puan verme, yorum ekleme, silme ve düzenleme.

### 🛒 **Sepet & Sipariş Süreci**
- Dinamik sepet yönetimi (Ürün ekleme, miktar artırma/azaltma, silme).
- Otomatik **%8 KDV** ve genel toplam hesaplaması.
- Anlık stok kontrolü ile güvenli sipariş oluşturma (**Checkout**).

### 🛠️ **Yönetici (Admin) Paneli**
- Yeni ürün ekleme, güncelleme ve silme (CRUD).
- Stok ve fiyat yönetimi.
- Kullanıcı ve sipariş istatistiklerini görüntüleme.

---

## 🛠️ Kullanılan Teknolojiler

### **Frontend**
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS, Lucide React (İkon seti)
- **State & Router:** React Router DOM v6
- **HTTP Client:** Axios (Interceptors & Centralized Error Handling)
- **Bildirimler:** React Toastify

### **Backend**
- **Framework:** .NET 8 ASP.NET Core Web API
- **AI Entegrasyonu:** Groq API & OpenAI .NET SDK (`llama-3.3-70b-versatile`)
- **ORM & DB:** Entity Framework Core 8 (Code-First)
- **Database Driver:** Npgsql PostgreSQL
- **Security:** JWT (JSON Web Tokens), BCrypt.Net
- **Validasyon & Mapping:** FluentValidation, AutoMapper
- **Dokümantasyon:** Swagger UI / OpenAPI

### **DevOps & Canlı Dağıtım (Deployment)**
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** Neon.tech (Serverless PostgreSQL)
- **Konteynerleştirme:** Docker & Docker Compose (Multi-stage builds, Nginx)

---

## 📁 Proje Mimari Yapısı

```text
ShopAPIProject/
├── ShopAPI/                     # .NET 8 Web API (Backend)
│   ├── Controllers/             # API Endpoint'leri (Products, Basket, Order, Auth, SkinCare vb.)
│   ├── Data/                    # DbContext ve EF Core Konfigürasyonları
│   ├── DTOs/                    # Data Transfer Objects (SkincareRecommendationResponseDto vb.)
│   ├── Entities/                # Veritabanı Modelleri (Product, Customer, Order vb.)
│   ├── Mappings/                # AutoMapper Profilleri
│   ├── Services/                # İş Mantığı Katmanı & Yapay Zeka Servisleri (GroqService vb.)
│   ├── Validators/              # FluentValidation Kuralları
│   └── Dockerfile               # Production Docker Yapılandırması
│
├── ShopAPIFrontend/             # React + Vite (Frontend)
│   ├── src/
│   │   ├── api/                 # Axios Yapılandırması ve Interceptor'lar
│   │   ├── pages/               # Sayfa Bileşenleri (Home, SkinCareQuiz, Cart, Admin vb.)
│   │   └── App.jsx              # Routing & Toast Provider
│   ├── vercel.json              # Vercel SPA Routing Konfigürasyonu
│   └── Dockerfile               # Multi-stage Nginx Build
│
└── docker-compose.yml           # Yerel Docker Geliştirme Ortamı
```

---

## 🚀 Yerel Geliştirme Kurulumu (Local Setup)

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/sudenaz833/ShopAPIProject.git
cd ShopAPIProject
```

### 2. Docker Compose İle Çalıştırma (Tavsiye Edilen)
Projenin backend ve frontend servislerini tek komutla başlatabilirsiniz:
```bash
docker-compose up --build
```
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5131/swagger`

---

### 3. Manuel Kurulum

#### **Backend (.NET API)**
```bash
cd ShopAPI
# appsettings.json dosyasında veritabanı bağlantınızı ve Groq API anahtarınızı ayarlayın
dotnet restore
dotnet ef database update
dotnet run
```

#### **Frontend (React)**
```bash
cd ShopAPIFrontend
npm install
# .env dosyasında VITE_API_URL=http://localhost:5131/api/ olarak ayarlayın
npm run dev
```
- Frontend varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

---

## 🔐 Environment Variables (Ortam Değişkenleri)

### Frontend (`.env.production`)
```env
VITE_API_URL=https://<https://shopapi-backend-epzw.onrender.com>.onrender.com/api/
```

### Backend (`appsettings.json` / Render Environment)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=ep-little-star-asc1sa3z.c-4.eu-central-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_4ENYQcAb9ItS;SSL Mode=Require;Trust Server Certificate=true;"
  },
  "GroqSettings": {
    "ApiKey": "YOUR_GROQ_API_KEY",
    "BaseUrl": "https://api.groq.com/openai/v1",
    "Model": "llama-3.3-70b-versatile"
  }
}
```

---

## 📜 Lisans
Bu proje eğitim ve portfolyo amacıyla geliştirilmiştir. Tüm hakları saklıdır © 2026 **VELORA Cosmetics**.
