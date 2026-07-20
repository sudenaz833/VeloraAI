import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Shield,
  Home as HomeIcon,
  Info,
  Package
} from 'lucide-react';
import api from '../api/axiosConfig';

function Navbar({ cartItemsCount }) {
  const [role, setRole] = useState('User');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [basketCount, setBasketCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role || 'User');
      } catch (e) {
        console.error("Token çözümlenirken hata oluştu:", e);
      }
    }

    // Eğer dışarıdan cartItemsCount geçilmediyse sepet sayısını API'den çek
    if (cartItemsCount === undefined && role !== 'Admin' && token) {
      api.get('basket')
        .then(res => {
          const totalQty = res.data.reduce((acc, item) => acc + item.quantity, 0);
          setBasketCount(totalQty);
        })
        .catch(() => setBasketCount(0));
    }
  }, [location.pathname, cartItemsCount, role]);

  const displayCartCount = cartItemsCount !== undefined ? cartItemsCount : basketCount;

  const navLinks = [
    { name: 'Anasayfa', path: '/home', icon: HomeIcon },
    { name: 'Hakkımızda', path: '/about', icon: Info },
    { name: 'Ürünler', path: '/products', icon: Package },
  ];

  return (
    <>
      {/* 1. TOP BAR (Üst Bilgi Bandı) */}
      <div className="bg-charcoal-900 text-charcoal-300 py-2 px-4 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-gold-400 shrink-0" />
            <span>0212 345 67 89</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-gold-400 shrink-0" />
            <span>info@velora.com</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
            <span>Antalya, Türkiye</span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR (Menü Çubuğu) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-charcoal-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">

          {/* Logo */}
          <Link to="/home" className="group flex items-center">
            <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] sm:tracking-[0.25em] font-light uppercase text-charcoal-900 group-hover:text-gold-600 transition-colors duration-300">
              VELORA
            </h2>
          </Link>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs tracking-widest uppercase font-medium transition-colors duration-300 relative py-1 ${
                    isActive
                      ? 'text-charcoal-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gold-500'
                      : 'text-charcoal-500 hover:text-gold-600 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Sağ Aksiyon İkonları */}
          <div className="flex items-center gap-3 sm:gap-6">
            {role === 'Admin' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs tracking-widest text-gold-600 hover:text-gold-700 font-semibold uppercase bg-gold-50 px-3 py-1.5 border border-gold-200/60 rounded-sm transition-colors"
                title="Admin Paneli"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Yönetici Paneli</span>
              </Link>
            )}

            <Link
              to="/profile"
              className="text-charcoal-600 hover:text-gold-600 transition-colors duration-300 p-2"
              title="Profilim"
            >
              <User className="w-5 h-5 sm:w-5 sm:h-5" />
            </Link>

            {role !== 'Admin' && (
              <Link
                to="/cart"
                className="text-charcoal-600 hover:text-gold-600 transition-colors duration-300 p-2 relative"
                title="Sepetim"
              >
                <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5" />
                {displayCartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gold-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {displayCartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobil Hamburger Menü Butonu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-charcoal-800 hover:text-gold-600 transition-colors"
              aria-label="Menüyü Aç/Kapat"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobil Menü Çekmecesi (Slide-down Mobile Menu) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-charcoal-100 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-xl">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-4 text-xs tracking-widest uppercase font-medium border-l-2 transition-all ${
                      isActive
                        ? 'border-gold-500 bg-gold-50/50 text-gold-900 font-semibold'
                        : 'border-transparent text-charcoal-600 hover:bg-charcoal-50 hover:text-gold-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-gold-500" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {role === 'Admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-4 text-xs tracking-widest uppercase font-semibold text-gold-700 bg-gold-50 border border-gold-200 mt-2"
                >
                  <Shield className="w-4 h-4 text-gold-600" />
                  <span>Yönetici Paneli</span>
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-charcoal-100 flex items-center justify-between text-[11px] text-charcoal-400 font-light">
              <span>Velora Luxury Cosmetics</span>
              <span>© 2026</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
