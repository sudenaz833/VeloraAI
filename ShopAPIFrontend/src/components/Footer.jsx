import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal-950 text-charcoal-300 pt-12 sm:pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">

        <div className="space-y-4">
          <h3 className="font-serif text-xl tracking-[0.25em] text-white uppercase font-light">VELORA</h3>
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
  );
}

export default Footer;
