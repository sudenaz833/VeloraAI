import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import {
  Loader2,
  Sparkles,
  Star,
  ShoppingBag,
  Search,
  X,
  ChevronDown
} from 'lucide-react';
import Navbar from '../components/Navbar';

const CountdownTimer = React.memo(({ expiryDate }) => {
  const { language, t } = useLanguage();
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
    if (interval === 'days') label = language === 'tr' ? 'g ' : 'd ';
    if (interval === 'hours') label = language === 'tr' ? 'sa ' : 'h ';
    if (interval === 'minutes') label = language === 'tr' ? 'dk ' : 'm ';
    if (interval === 'seconds') label = language === 'tr' ? 'sn' : 's';

    timerComponents.push(
      <span key={interval} className="font-mono bg-gold-50 border border-gold-200/50 text-[10px] text-gold-700 font-bold px-1 rounded-sm">
        {timeLeft[interval]}{label}
      </span>
    );
  });

  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[9px] tracking-wider text-charcoal-400 uppercase font-light mr-1">{t('products.countdown.remaining')}</span>
      {timerComponents.length ? (
        <div className="flex gap-0.5">{timerComponents}</div>
      ) : (
        <span className="text-[9px] text-red-500 font-semibold uppercase tracking-wider">{t('products.countdown.expired')}</span>
      )}
    </div>
  );
});

function Product() {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Cilt Bakımı');
  const [role, setRole] = useState('User');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    // Token'dan rolü oku
    const token = sessionStorage.getItem('token');
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
        setError(t('products.errorLoading'));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [t]);

  const handleAddToBasket = async (productId) => {
    try {
      await api.post('basket', { productId, quantity: 1 });
      toast.success(language === 'tr' ? "Ürün başarıyla sepete eklendi!" : "Product successfully added to cart!");
    }
    catch (err) {
      console.error("sepete ekleme hatası:", err);
      toast.error(language === 'tr' ? "Ürün sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin." : "An error occurred while adding product to cart. Please try again.");
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = product.category === activeCategory;
      const matchesSearch = product.productName.toLocaleLowerCase('tr-TR')
        .includes(deferredSearchTerm.toLocaleLowerCase('tr-TR'));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'priceAsc') {
      result.sort((a, b) => {
        const priceA = a.discountPrice && a.discountExpiresAt && new Date(a.discountExpiresAt) > new Date() ? a.discountPrice : a.price;
        const priceB = b.discountPrice && b.discountExpiresAt && new Date(b.discountExpiresAt) > new Date() ? b.discountPrice : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => {
        const priceA = a.discountPrice && a.discountExpiresAt && new Date(a.discountExpiresAt) > new Date() ? a.discountPrice : a.price;
        const priceB = b.discountPrice && b.discountExpiresAt && new Date(b.discountExpiresAt) > new Date() ? b.discountPrice : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === 'ratingDesc') {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    return result;
  }, [products, activeCategory, deferredSearchTerm, sortBy]);

  // Diğer kategorilerdeki eşleşmeleri bulma
  const categoriesWithMatches = useMemo(() => {
    return products.reduce((acc, product) => {
      if (product.category !== activeCategory) {
        const matchesSearch = product.productName.toLocaleLowerCase('tr-TR')
          .includes(deferredSearchTerm.toLocaleLowerCase('tr-TR'));
        if (matchesSearch) {
          acc[product.category] = (acc[product.category] || 0) + 1;
        }
      }
      return acc;
    }, {});
  }, [products, activeCategory, deferredSearchTerm]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-gold-500/20 selection:text-gold-900 flex flex-col">

      {/* Reusable Mobile Responsive Navbar */}
      <Navbar />

      {/* Ana Gövde Yapısı */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex-1 w-full">

        {/* Sayfa Başlığı */}
        <div className="text-center max-w-xl mx-auto space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <span className="text-[10px] tracking-[0.25em] text-gold-600 uppercase font-semibold block">{t('products.collectionBadge')}</span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal-900 tracking-wide font-light">{t('products.pageTitle')}</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-2" />
        </div>

        {loading ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start w-full">
            {/* Sol Filtre / Kategori Menüsü Skeleton */}
            <aside className="w-full lg:w-64 shrink-0 bg-white border border-charcoal-100 p-4 sm:p-6 space-y-4 lg:space-y-6">
              <div className="space-y-2">
                <div className="h-4 bg-charcoal-100 rounded animate-pulse w-24"></div>
                <div className="w-8 h-[1px] bg-gold-200" />
              </div>
              <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 overflow-x-auto pb-2 lg:pb-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-charcoal-50 rounded animate-pulse w-24 lg:w-full shrink-0"></div>
                ))}
              </div>
            </aside>

            {/* Sağ Ürün Izgarası (Grid) Skeleton */}
            <div className="flex-1 w-full space-y-6">
              {/* Arama Kutusu & Sıralama Filtresi Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                <div className="h-12 bg-white border border-charcoal-100 rounded-none animate-pulse flex-1 w-full"></div>
                <div className="h-12 bg-white border border-charcoal-100 rounded-none animate-pulse w-full sm:w-64 shrink-0"></div>
              </div>

              {/* Grid Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-charcoal-100 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                    {/* Ürün Görseli Skeleton */}
                    <div className="aspect-square w-full bg-charcoal-50 animate-pulse relative"></div>
                    {/* Ürün Adı Skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 bg-charcoal-100 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-charcoal-100 rounded animate-pulse w-1/2"></div>
                    </div>
                    {/* Yıldız Derecelendirme Skeleton */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-3 h-3 bg-charcoal-100 rounded-full animate-pulse"></div>
                      ))}
                    </div>
                    {/* Fiyat ve Stok Skeleton */}
                    <div className="pt-2 border-t border-charcoal-50 flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="h-2 bg-charcoal-100 rounded animate-pulse w-8"></div>
                        <div className="h-4 bg-charcoal-100 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="h-2 bg-charcoal-100 rounded animate-pulse w-8"></div>
                        <div className="h-3 bg-charcoal-100 rounded animate-pulse w-10"></div>
                      </div>
                    </div>
                    {/* Sepete Ekle Butonu Skeleton */}
                    <div className="h-10 bg-charcoal-100 rounded animate-pulse w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 text-center max-w-md mx-auto my-12">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">

            {/* Sol Filtre / Kategori Menüsü (Mobilde Yatay Kaydırılabilir) */}
            <aside className="w-full lg:w-64 shrink-0 bg-white border border-charcoal-100 p-4 sm:p-6 space-y-4 lg:space-y-6">
              <div>
                <h3 className="font-serif text-base text-charcoal-900 tracking-wide font-medium">{t('products.categories')}</h3>
                <div className="w-8 h-[1px] bg-gold-400 mt-1.5" />
              </div>
              <ul className="flex flex-row lg:flex-col overflow-x-auto gap-2 lg:gap-3 text-xs tracking-wider uppercase pb-2 lg:pb-0 no-scrollbar">
                {['Cilt Bakımı', 'Makyaj', 'Parfüm', 'Setler'].map((category) => (
                  <li key={category} className="shrink-0 lg:w-full">
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`whitespace-nowrap lg:whitespace-normal w-full text-left py-2 sm:py-2.5 px-3.5 sm:px-4 font-medium transition-all duration-300 flex items-center justify-between gap-3 border ${
                        activeCategory === category
                          ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                          : 'bg-transparent text-charcoal-500 border-charcoal-100 hover:border-gold-300 hover:text-gold-600'
                      }`}
                    >
                      <span>{t('products.categoriesList.' + category)}</span>
                      {activeCategory === category && <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Sağ Ürün Izgarası (Grid) */}
            <div className="flex-1 w-full space-y-6">

              {/* Arama Kutusu & Sıralama Filtresi */}
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('products.searchPlaceholder')}
                    className="w-full h-12 bg-white border border-charcoal-100 hover:border-gold-300 focus:border-gold-500 text-charcoal-900 placeholder-charcoal-400 text-sm pl-11 pr-10 outline-none transition-all duration-300 shadow-sm rounded-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-gold-600 transition-colors p-1"
                      title={t('products.clearSearch')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative w-full sm:w-64 shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-12 bg-white border border-charcoal-100 hover:border-gold-300 focus:border-gold-500 text-charcoal-900 text-sm pl-4 pr-10 appearance-none outline-none transition-all duration-300 shadow-sm cursor-pointer rounded-none"
                  >
                    <option value="default">{t('products.sortOptions.default')}</option>
                    <option value="priceAsc">{t('products.sortOptions.priceAsc')}</option>
                    <option value="priceDesc">{t('products.sortOptions.priceDesc')}</option>
                    <option value="ratingDesc">{t('products.sortOptions.ratingDesc')}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 sm:py-20 bg-white border border-charcoal-100 p-6 space-y-4">
                  <p className="text-sm text-charcoal-500 font-light">
                    {searchTerm ? (
                      <>
                        <span className="font-semibold text-charcoal-950">"{searchTerm}"</span> {t('products.noProductsFound')}
                      </>
                    ) : (
                      t('products.emptyCategory')
                    )}
                  </p>
                  
                  {searchTerm && Object.keys(categoriesWithMatches).length > 0 && (
                    <div className="pt-4 border-t border-charcoal-50 max-w-md mx-auto">
                      <p className="text-xs text-charcoal-400 uppercase tracking-widest mb-3">{t('products.otherMatches')}</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {Object.entries(categoriesWithMatches).map(([category, count]) => (
                          <button
                            key={category}
                            onClick={() => {
                              setActiveCategory(category);
                            }}
                            className="text-xs bg-charcoal-50 border border-charcoal-200 hover:border-gold-300 hover:text-gold-600 px-3 py-1.5 transition-all duration-300 font-medium text-charcoal-700 cursor-pointer"
                          >
                            {t('products.categoriesList.' + category)} ({count})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="bg-white border border-charcoal-100 p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:border-gold-300/50 transition-all duration-300 group"
                    >
                      {/* Ürün Görseli */}
                      <div className="aspect-square w-full overflow-hidden bg-charcoal-50 relative mb-4 sm:mb-5">
                        <Link to={`/product/${product.productId}`} className="hover:text-gold-500 transition-colors block w-full h-full">
                          <img
                            src={product.imageUrl || "/images/velora_hero_image.png"}
                            alt={product.productName}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                          />
                        </Link>

                        {/* Sepet Sayısı Rozeti */}
                        {product.isBasketCount > 0 && (
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-sm border border-gold-200/50 shadow-sm px-2 sm:px-2.5 py-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-gold-700 uppercase flex items-center gap-1.5 z-10">
                            <ShoppingBag className="w-3 h-3 text-gold-600 animate-pulse" />
                            <span>{product.isBasketCount} {t('products.basketBadgeText')}</span>
                          </div>
                        )}
                        {/* Stok Durum Rozeti */}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-charcoal-900 text-white text-[9px] tracking-widest uppercase font-semibold py-1.5 px-4">
                              {t('products.soldOut')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Ürün Bilgisi */}
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-sm sm:text-base text-charcoal-900 font-light tracking-wide min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2">
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
                            <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-light block">{t('products.priceLabel')}</span>
                            {product.discountPrice && product.discountExpiresAt && new Date(product.discountExpiresAt) > new Date() ? (
                              <div className="space-y-1">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-gold-600 text-sm sm:text-base font-semibold">{product.discountPrice} TL</span>
                                  <span className="text-red-500 text-xs line-through font-medium">{product.price} TL</span>
                                </div>
                                <CountdownTimer expiryDate={product.discountExpiresAt} />
                              </div>
                            ) : (
                              <p className="text-gold-600 text-sm sm:text-base font-semibold">{product.price} TL</p>
                            )}
                          </div>
                          <div className="text-right self-start">
                            <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-light block">{t('products.stockLabel')}</span>
                            <span className={`text-[11px] font-medium ${product.stock > 5 ? 'text-charcoal-600' : 'text-amber-600'}`}>
                              {product.stock > 0 ? `${product.stock} ${t('products.stockCount')}` : t('products.outOfStock')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sepete Ekle Butonu veya Admin Bilgisi */}
                      {role === 'Admin' ? (
                        <div className="w-full text-center bg-charcoal-50 border border-charcoal-100 py-3 mt-4 text-[10px] tracking-widest text-charcoal-400 uppercase font-medium">
                          {t('products.adminRestriction')}
                        </div>
                      ) : (
                        <button
                          disabled={product.stock <= 0}
                          onClick={() => handleAddToBasket(product.productId)}
                          className="w-full bg-charcoal-900 text-white text-xs tracking-[0.2em] font-medium uppercase py-3 sm:py-3.5 mt-4 hover:bg-charcoal-800 disabled:bg-charcoal-200 disabled:text-charcoal-400 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                        >
                          {t('products.addToBasket')}
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

      {/* FOOTER */}
      <footer className="bg-charcoal-950 text-charcoal-300 pt-12 sm:pt-16 pb-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">

          <div className="space-y-4">
            <h3 className="font-serif text-xl tracking-[0.25em] text-white uppercase font-light">{t('footer.aboutTitle')}</h3>
            <p className="text-charcoal-400 text-xs leading-relaxed font-light">
              {t('footer.aboutDesc')}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">{t('footer.quickMenuTitle')}</h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/home" className="hover:text-gold-400 transition-colors">{t('navbar.home')}</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">{t('navbar.about')}</Link></li>
              <li><Link to="/products" className="hover:text-gold-400 transition-colors">{t('navbar.products')}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">{t('footer.legalTitle')}</h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><a href="#terms" className="hover:text-gold-400 transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#privacy" className="hover:text-gold-400 transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#cookies" className="hover:text-gold-400 transition-colors">{t('footer.cookies')}</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">{t('footer.newsletterTitle')}</h4>
            <p className="text-charcoal-400 text-xs font-light">{t('footer.newsletterDesc')}</p>
            <div className="flex border-b border-charcoal-700 py-1">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-charcoal-500 w-full font-light"
              />
              <button className="text-gold-400 hover:text-gold-300 font-medium text-xs tracking-wider uppercase ml-2">
                {t('footer.subscribeBtn')}
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <span className="text-[10px] tracking-widest text-charcoal-500 uppercase">
            {t('footer.copyright')}
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
