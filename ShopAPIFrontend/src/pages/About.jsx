import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';

function About() {
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
                Hikayemiz
              </h1>
              <div className="w-12 h-[1px] bg-gold-400" />

              <p className="text-charcoal-600 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                Velora kozmetik'in doğuşu, doğa ve doğallığın üstün gücü ile bilimsel inovasyonun kesiştiği yerde başlar.
                Her bir damlamızda, doğanın bize sunduğu en saf ve zengin bileşenleri, en modern laboratuvar teknikleriyle bir araya getiriyoruz.
              </p>

              <p className="text-charcoal-600 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                Güzellik algısının hızla değiştiği bu dünyada,
                biz zamansız ve yalın olanın peşindeyiz.
                Velora’da her bir ürün, doğanın sunduğu mucizevi dokunuşları modern bilimin güvenilirliğiyle birleştiriyor.
                Cildinin ihtiyaç duyduğu o saf dokuyu, sürdürülebilir ve etik değerlere bağlı kalarak hazırlıyoruz.
                Çünkü inanıyoruz ki; gerçek güzellik, doğayla uyum içinde olduğunda ortaya çıkar.
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
                Değerlerimiz
              </h2>
              <div className="w-12 h-[1px] bg-gold-400" />

              <div className="space-y-4">
                <p className="text-charcoal-600 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                  Velora kozmetik olarak biyoteknolojik gelişmeleri yakından takip ederek, cildinize en iyi sonuçları veren yenilikçi formüller geliştiriyoruz.
                  Doğanın zengin özlerini en gelişmiş cilt molekülleriyle birleştiriyor ve dermatolojik olarak onaylanmış üstün formüller üretiyoruz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-charcoal-100">
                <div className="flex gap-3">
                  <Leaf className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-semibold text-charcoal-800">Doğal İçerikler</h4>
                    <p className="text-charcoal-500 text-xs font-light mt-1">%100 temiz ve sürdürülebilir bitki özleri.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-semibold text-charcoal-800">Dermatolojik Onay</h4>
                    <p className="text-charcoal-500 text-xs font-light mt-1">Hassas ciltler dahil tüm tipler için güvenli testler.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal-950 text-charcoal-300 pt-12 sm:pt-16 pb-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">

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
              <li><Link to="/about" className="hover:text-gold-400 transition-colors text-gold-400">Hakkımızda</Link></li>
              <li><Link to="/products" className="hover:text-gold-400 transition-colors">Ürünler</Link></li>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
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

export default About;
