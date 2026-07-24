import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';

function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-gold-500/20 selection:text-gold-900 flex flex-col">

      {/* Reusable Mobile Responsive Navbar */}
      <Navbar />

      {/* STORY SECTION (Hikayemiz) */}
      <section className="py-12 sm:py-16 md:py-24 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">

            {/* Sol Görsel - Altın Serumu Görseli */}
            <div className="flex-1 w-full relative aspect-[4/3] rounded-none overflow-hidden shadow-2xl border border-gold-200/20 group">
              <img
                src="/images/velora_about2.png"
                alt="Velora Luxury Skincare Gold Serums"
                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal-900/5" />
            </div>

            {/* Sağ İçerik - Hikayemiz Metni */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-charcoal-900 tracking-wide font-light">
                {t('about.storyTitle')}
              </h1>
              <div className="w-12 h-[1px] bg-gold-400" />

              <p className="text-charcoal-600 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                {t('about.storyPara1')}
              </p>

              <p className="text-charcoal-600 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                {t('about.storyPara2')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* VALUES SECTION (Değerlerimiz & Bilim Görseli) */}
      <section id="values-detail" className="py-12 sm:py-16 md:py-24 bg-white border-t border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-20">

            {/* Sağ Görsel - Laboratuvar Kimya Görseli */}
            <div className="flex-1 w-full relative aspect-[4/3] rounded-none overflow-hidden shadow-2xl border border-gold-200/20 group">
              <img
                src="/images/velora_about_science_image.png"
                alt="Velora Skincare Lab and Science"
                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal-900/5" />
            </div>

            {/* Sol İçerik - Değerlerimiz Metni */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal-900 tracking-wide font-light">
                {t('about.valuesTitle')}
              </h2>
              <div className="w-12 h-[1px] bg-gold-400" />

              <div className="space-y-4">
                <p className="text-charcoal-600 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                  {t('about.valuesPara')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-charcoal-100">
                <div className="flex gap-3">
                  <Leaf className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-semibold text-charcoal-800">{t('about.naturalIngredientsTitle')}</h4>
                    <p className="text-charcoal-500 text-xs font-light mt-1">{t('about.naturalIngredientsDesc')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-semibold text-charcoal-800">{t('about.dermApprovalTitle')}</h4>
                    <p className="text-charcoal-500 text-xs font-light mt-1">{t('about.dermApprovalDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default About;
