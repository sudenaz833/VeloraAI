import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-gold-500/20 selection:text-gold-900 flex flex-col">

      {/* Reusable Mobile Responsive Navbar */}
      <Navbar />

      {/* Karşılama Ekranı (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gold-50/50 to-transparent flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)] flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-8 sm:py-12 md:py-20">

          {/* Hero Left Content */}
          <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-gold-100/60 px-3.5 py-1.5 rounded-full border border-gold-200/50 text-gold-800 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('home.badge')}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-charcoal-900 leading-[1.15] font-light tracking-wide">
              {t('home.heroTitleLine1')} <br className="hidden sm:inline" />
              <span className="italic font-normal text-gold-600">{t('home.heroTitleLine2')}</span>
            </h1>

            <p className="text-charcoal-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
              {t('home.heroDesc')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-3.5 sm:py-4 px-8 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>{t('home.exploreBtn')}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>

          {/* Hero Right Image */}
          <div className="flex-1 w-full max-w-md lg:max-w-none relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-none overflow-hidden shadow-2xl border border-gold-200/20 group">
            <img
              src="/images/velora_hero_image.png"
              alt="Velora Luxury Skincare Collection"
              className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section id="values" className="py-16 sm:py-20 md:py-28 bg-white border-t border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center max-w-xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16 md:mb-20">
            <span className="text-[10px] tracking-[0.25em] text-gold-600 uppercase font-semibold block">{t('home.valuesBadge')}</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal-900 tracking-wide font-light">{t('home.valuesTitle')}</h2>
            <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">

            {/* İnovasyon */}
            <div className="bg-[#FAF8F5] p-6 sm:p-8 md:p-10 border border-charcoal-100 hover:border-gold-300 transition-all duration-300 group hover:shadow-md">
              <div className="w-12 h-12 bg-gold-100/60 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                <Sparkles className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-base sm:text-lg text-charcoal-900 font-medium tracking-wide mb-3">{t('home.innovationTitle')}</h3>
              <p className="text-charcoal-500 text-xs md:text-sm leading-relaxed font-light">
                {t('home.innovationDesc')}
              </p>
            </div>

            {/* Lüks ve Seçkinlik */}
            <div className="bg-[#FAF8F5] p-6 sm:p-8 md:p-10 border border-charcoal-100 hover:border-gold-300 transition-all duration-300 group hover:shadow-md">
              <div className="w-12 h-12 bg-gold-100/60 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                <ShieldCheck className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-base sm:text-lg text-charcoal-900 font-medium tracking-wide mb-3">{t('home.luxuryTitle')}</h3>
              <p className="text-charcoal-500 text-xs md:text-sm leading-relaxed font-light">
                {t('home.luxuryDesc')}
              </p>
            </div>

            {/* Doğallık */}
            <div className="bg-[#FAF8F5] p-6 sm:p-8 md:p-10 border border-charcoal-100 hover:border-gold-300 transition-all duration-300 group hover:shadow-md sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-gold-100/60 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                <Leaf className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-base sm:text-lg text-charcoal-900 font-medium tracking-wide mb-3">{t('home.naturalTitle')}</h3>
              <p className="text-charcoal-500 text-xs md:text-sm leading-relaxed font-light">
                {t('home.naturalDesc')}
              </p>
            </div>

          </div>

        </div>
      </section>

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

export default Home;