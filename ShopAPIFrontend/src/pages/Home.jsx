import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone,
    Mail,
    MapPin,
    User,
    ShoppingBag,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Leaf,
    ChevronRight
} from 'lucide-react';

function Home() {
    const [role, setRole] = useState('User');

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
    }, []);
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
                    <a href="/home" className="group">
                        <h2 className="font-serif text-3xl tracking-[0.25em] font-light uppercase text-charcoal-900 group-hover:text-gold-600 transition-colors duration-300">
                            VELORA
                        </h2>
                    </a>

                    {/* Navigation */}
                    <nav className="flex items-center gap-12">
                        <a href="/home" className="text-xs tracking-widest uppercase font-medium text-charcoal-900 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gold-500 after:transform after:scale-x-100 transition-all">
                            Anasayfa
                        </a>
                        <Link to="/about" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
                            Hakkımızda
                        </Link>
                        <a href="/products" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
                            Ürünler
                        </a>
                        <a href="#values" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
                            Değerlerimiz
                        </a>
                    </nav>


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

            {/*Karşılama Ekranı*/}
            <section className="relative overflow-hidden bg-gradient-to-r from-gold-50/50 to-transparent">
                <div className="max-w-7xl mx-auto px-6 min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)] flex flex-col lg:flex-row items-center gap-12 py-12 md:py-20">

                    {/* Hero Left Content */}
                    <div className="flex-1 space-y-8 text-center lg:text-left z-10">
                        <div className="inline-flex items-center gap-2 bg-gold-100/60 px-4 py-1.5 rounded-full border border-gold-200/50 text-gold-800 text-[10px] tracking-[0.15em] uppercase font-medium">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Premium Cilt Bakımı</span>
                        </div>

                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 leading-[1.15] font-light tracking-wide">
                            Zarafetin <br className="hidden sm:inline" />
                            <span className="italic font-normal text-gold-600">Yeni Tanımı</span>
                        </h1>

                        <p className="text-charcoal-500 text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                            Cilt bakımında lüksün ve doğallığın mükemmel uyumunu keşfedin.
                            Velora'nın ödüllü formülleri ve seçkin bileşenleri ile zamansız güzelliği deneyimleyin.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <a
                                href="/products"
                                className="w-full sm:w-auto bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-4 px-8 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span>Hemen Keşfet</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                            </a>

                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md lg:max-w-none relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-none overflow-hidden shadow-2xl border border-gold-200/20 group">
                        <img
                            src="/velora_hero_image.png"
                            alt="Velora Luxury Skincare Collection"
                            className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* Değerlerimiz */}
            <section id="values" className="py-20 md:py-28 bg-white border-t border-b border-charcoal-100">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center max-w-xl mx-auto space-y-4 mb-16 md:mb-20">
                        <span className="text-[10px] tracking-[0.25em] text-gold-600 uppercase font-semibold block">Velora Felsefesi</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 tracking-wide font-light">Değerlerimiz</h2>
                        <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

                        {/*  İnovasyon */}
                        <div className="bg-[#FAF8F5] p-8 md:p-10 border border-charcoal-100 hover:border-gold-300 transition-all duration-300 group hover:shadow-md">
                            <div className="w-12 h-12 bg-gold-100/60 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                                <Sparkles className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="font-serif text-lg text-charcoal-900 font-medium tracking-wide mb-3">İnovasyon</h3>
                            <p className="text-charcoal-500 text-xs md:text-sm leading-relaxed font-light">
                                Velora kozmetik olarak biyoteknolojik gelişmeleri yakından takip ederek, cildinize en iyi sonuçları veren yenilikçi formüller geliştiriyoruz.
                            </p>
                        </div>

                        {/* Lüks ve Seçkinlik */}
                        <div className="bg-[#FAF8F5] p-8 md:p-10 border border-charcoal-100 hover:border-gold-300 transition-all duration-300 group hover:shadow-md">
                            <div className="w-12 h-12 bg-gold-100/60 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                                <ShieldCheck className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="font-serif text-lg text-charcoal-900 font-medium tracking-wide mb-3">Lüks ve Seçkinlik</h3>
                            <p className="text-charcoal-500 text-xs md:text-sm leading-relaxed font-light">
                                Kişiye özel hissettiren lüks dokular, zengin koku esansları ve birinci sınıf ambalaj tasarımları ile bakım ritüelinizi unutulmaz bir deneyime dönüştürüyoruz.
                            </p>
                        </div>

                        {/*  Doğallık */}
                        <div className="bg-[#FAF8F5] p-8 md:p-10 border border-charcoal-100 hover:border-gold-300 transition-all duration-300 group hover:shadow-md">
                            <div className="w-12 h-12 bg-gold-100/60 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                                <Leaf className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="font-serif text-lg text-charcoal-900 font-medium tracking-wide mb-3">Doğallık ve Sürdürülebilirlik</h3>
                            <p className="text-charcoal-500 text-xs md:text-sm leading-relaxed font-light">
                                Doğadan aldığımız ilhamı temiz içerikli ve çevre dostu üretim metodlarıyla birleştiriyoruz. Cildinize ve dünyamıza saygılı ürünler sunuyoruz.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* 5. FOOTER  */}
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
                            <li><a href="/home" className="hover:text-gold-400 transition-colors">Anasayfa</a></li>
                            <li><Link to="/about" className="hover:text-gold-400 transition-colors">Hakkımızda</Link></li>
                            <li><a href="/products" className="hover:text-gold-400 transition-colors">Ürünler</a></li>
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

export default Home;