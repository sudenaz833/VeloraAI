import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import {
  Phone,
  Mail,
  MapPin,
  User,
  ShoppingBag,
  Loader2,
  Sparkles,
  Star
} from 'lucide-react';

const CountdownTimer = ({ expiryDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    let label = '';
    if (interval === 'days') label = 'g ';
    if (interval === 'hours') label = 'sa ';
    if (interval === 'minutes') label = 'dk ';
    if (interval === 'seconds') label = 'sn';

    timerComponents.push(
      <span key={interval} className="font-mono bg-gold-50 border border-gold-200/50 text-[10px] text-gold-700 font-bold px-1 rounded-sm">
        {timeLeft[interval]}{label}
      </span>
    );
  });

  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[9px] tracking-wider text-charcoal-400 uppercase font-light mr-1">Kalan:</span>
      {timerComponents.length ? (
        <div className="flex gap-0.5">{timerComponents}</div>
      ) : (
        <span className="text-[9px] text-red-500 font-semibold uppercase tracking-wider">Süre Doldu!</span>
      )}
    </div>
  );
};

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Cilt Bakımı');
  const [role, setRole] = useState('User');

  useEffect(() => {
    // Token'dan rolü oku
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role || 'User');
      } catch (e) {
        console.error("Token çözümlenirken hata oluştu:", e);
      }
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('products');
        setProducts(response.data);
      } catch (err) {
        console.error("Ürünler yükleme hatası:", err);
        setError("Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToBasket = async (productId) => {
    try {
      await api.post('basket', { productId, quantity: 1 });
      toast.success("Ürün başarıyla sepete eklendi!");
    }
    catch (err) {
      console.error("sepete ekleme hatası:", err);
      toast.error("Ürün sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const filteredProducts = products.filter((product) => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-gold-500/20 selection:text-gold-900">

      {/* 1. TOP BAR (Üst Bilgi Bandı) */}
      <div className="bg-charcoal-900 text-charcoal-300 py-2.5 px-4 text-xs tracking-[0.2em] uppercase font-light">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            <span>0212 345 67 89</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gold-400" />
            <span>info@velora.com</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Antalya, Türkiye</span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR (Menü Çubuğu) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-charcoal-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

          {/* Logo */}
          <Link to="/home" className="group">
            <h2 className="font-serif text-3xl tracking-[0.25em] font-light uppercase text-charcoal-900 group-hover:text-gold-600 transition-colors duration-300">
              VELORA
            </h2>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-12">
            <Link to="/home" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
              Anasayfa
            </Link>
            <Link to="/about" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
              Hakkımızda
            </Link>
            <Link to="/products" className="text-xs tracking-widest uppercase font-medium text-charcoal-900 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gold-500 after:transform after:scale-x-100 transition-all">
              Ürünler
            </Link>
            <Link to="/home#values" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
              Değerlerimiz
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-6">
            {role === 'Admin' && (
              <Link to="/admin" className="text-xs tracking-widest text-gold-600 hover:text-gold-500 font-semibold uppercase transition-colors" title="Admin Paneli">
                Yönetici Paneli
              </Link>
            )}
            <Link to="/profile" className="text-charcoal-500 hover:text-gold-500 transition-colors duration-300 p-1.5" title="Profilim">
              <User className="w-5 h-5" />
            </Link>
            {role !== 'Admin' && (
              <Link to="/cart" className="text-charcoal-500 hover:text-gold-500 transition-colors duration-300 p-1.5 relative" title="Sepetim">
                <ShoppingBag className="w-5 h-5" />
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Ana Gövde Yapısı */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">

        {/* Sayfa Başlığı */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] tracking-[0.25em] text-gold-600 uppercase font-semibold block">Velora Koleksiyonu</span>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal-900 tracking-wide font-light">Seçkin Ürünlerimiz</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-2" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
            <p className="text-xs tracking-[0.2em] text-charcoal-500 uppercase font-light">Koleksiyon Hazırlanıyor...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 text-center max-w-md mx-auto my-12">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* Sol Filtre / Kategori Menüsü */}
            <aside className="w-full lg:w-64 shrink-0 bg-white border border-charcoal-100 p-6 space-y-6">
              <div>
                <h3 className="font-serif text-base text-charcoal-900 tracking-wide font-medium">Kategoriler</h3>
                <div className="w-8 h-[1px] bg-gold-400 mt-2" />
              </div>
              <ul className="flex flex-row lg:flex-col flex-wrap gap-2 lg:gap-3 text-xs tracking-wider uppercase">
                {['Cilt Bakımı', 'Makyaj', 'Parfüm', 'Setler'].map((category) => (
                  <li key={category} className="w-full">
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left py-2.5 px-4 font-medium transition-all duration-300 flex items-center justify-between border ${activeCategory === category
                        ? 'bg-charcoal-900 text-white border-charcoal-900'
                        : 'bg-transparent text-charcoal-500 border-charcoal-100 hover:border-gold-300 hover:text-gold-600'
                        }`}
                    >
                      <span>{category}</span>
                      {activeCategory === category && <Sparkles className="w-3.5 h-3.5 text-gold-400" />}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            {/* Sağ Ürün Izgarası (Grid) */}
            <div className="flex-1 w-full">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-charcoal-100">
                  <p className="text-sm text-charcoal-400 font-light">Bu kategoriye henüz ürün eklenmemiş.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="bg-white border border-charcoal-100 p-5 flex flex-col justify-between hover:shadow-lg hover:border-gold-300/50 transition-all duration-300 group"
                    >
                      {/* Ürün Görseli */}
                      <div className="aspect-square w-full overflow-hidden bg-charcoal-50 relative mb-5">
                        <Link to={`/product/${product.productId}`} className="hover:text-gold-500 transition-colors">
                          <img
                            src={product.imageUrl || "/velora_hero_image.png"}
                            alt={product.productName}
                            className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                          />
                        </Link>

                        {/* Sepet Sayısı Rozeti */}
                        {product.isBasketCount > 0 && (
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-gold-200/50 shadow-sm px-2.5 py-1 text-[9px] font-bold tracking-widest text-gold-700 uppercase flex items-center gap-1.5 z-10">
                            <ShoppingBag className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
                            <span>{product.isBasketCount} Kişinin Sepetinde</span>
                          </div>
                        )}
                        {/* Stok Durum Rozeti */}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-charcoal-900 text-white text-[9px] tracking-widest uppercase font-semibold py-1.5 px-4">
                              Tükendi
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Ürün Bilgisi */}
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-base text-charcoal-900 font-light tracking-wide min-h-[3rem] line-clamp-2">
                            <Link to={`/product/${product.productId}`} className="hover:text-gold-500 transition-colors">
                              {product.productName}
                            </Link>
                          </h3>
                          {/* Ortalama Yıldız ve Yorum Sayısı */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= Math.round(product.averageRating)
                                      ? "fill-gold-500 text-gold-500"
                                      : "text-charcoal-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-charcoal-400 font-light">
                              {product.averageRating} ({product.commentCount})
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-baseline justify-between border-t border-charcoal-50">
                          <div>
                            <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-light block">Fiyat</span>
                            {product.discountPrice && product.discountExpiresAt && new Date(product.discountExpiresAt) > new Date() ? (
                              <div className="space-y-1">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-gold-600 text-base font-semibold">{product.discountPrice} TL</span>
                                  <span className="text-red-500 text-xs line-through font-medium">{product.price} TL</span>
                                </div>
                                <CountdownTimer expiryDate={product.discountExpiresAt} />
                              </div>
                            ) : (
                              <p className="text-gold-600 text-base font-semibold">{product.price} TL</p>
                            )}
                          </div>
                          <div className="text-right self-start">
                            <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-light block">Stok</span>
                            <span className={`text-[11px] font-medium ${product.stock > 5 ? 'text-charcoal-600' : 'text-amber-600'}`}>
                              {product.stock > 0 ? `${product.stock} adet` : 'Yok'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sepete Ekle Butonu veya Admin Bilgisi */}
                      {role === 'Admin' ? (
                        <div className="w-full text-center bg-charcoal-50 border border-charcoal-100 py-3.5 mt-5 text-[10px] tracking-widest text-charcoal-400 uppercase font-medium">
                          Sepet Kısıtlaması (Admin)
                        </div>
                      ) : (
                        <button
                          disabled={product.stock <= 0}
                          onClick={() => handleAddToBasket(product.productId)}
                          className="w-full bg-charcoal-900 text-white text-xs tracking-[0.2em] font-medium uppercase py-3.5 mt-5 hover:bg-charcoal-800 disabled:bg-charcoal-200 disabled:text-charcoal-400 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          Sepete Ekle
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* 5. FOOTER (Alt Bilgi) */}
      <footer className="bg-charcoal-950 text-charcoal-300 pt-16 pb-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          <div className="space-y-4">
            <h3 className="font-serif text-xl tracking-[0.25em] text-white uppercase font-light">VELORA</h3>
            <p className="text-charcoal-400 text-xs leading-relaxed font-light">
              Zamansız güzellik felsefesiyle tasarlanan, doğadan ilham alan lüks kozmetik markası.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Hızlı Menü</h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/home" className="hover:text-gold-400 transition-colors">Anasayfa</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">Hakkımızda</Link></li>
              <li><Link to="/products" className="hover:text-gold-400 transition-colors text-gold-400">Ürünler</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Yasal Bilgiler</h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><a href="#terms" className="hover:text-gold-400 transition-colors">Kullanım Koşulları</a></li>
              <li><a href="#privacy" className="hover:text-gold-400 transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#cookies" className="hover:text-gold-400 transition-colors">Çerez Politikası</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Bülten Aboneliği</h4>
            <p className="text-charcoal-400 text-xs font-light">Koleksiyonlar ve özel kampanyalardan ilk siz haberdar olun.</p>
            <div className="flex border-b border-charcoal-700 py-1">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-transparent border-none outline-none text-xs text-white placeholder-charcoal-500 w-full font-light"
              />
              <button className="text-gold-400 hover:text-gold-300 font-medium text-xs tracking-wider uppercase ml-2">
                KAYDOL
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <span className="text-[10px] tracking-widest text-charcoal-500 uppercase">
            © 2026 VELORA Cosmetics. Tüm Hakları Saklıdır.
          </span>
          <div className="flex gap-4 text-xs text-charcoal-500">
            <a href="#instagram" className="hover:text-gold-400 transition-colors">Instagram</a>
            <a href="#facebook" className="hover:text-gold-400 transition-colors">Facebook</a>
            <a href="#pinterest" className="hover:text-gold-400 transition-colors">Pinterest</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Product;
