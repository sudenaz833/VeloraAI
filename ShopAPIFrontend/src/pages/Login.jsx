import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

function Login() {
  const navigate = useNavigate(); // yönlendirme fonksiyonu
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (activeTab === 'login') {
      if (!email || !password) {
        setError('Lütfen e-posta ve şifre alanlarını doldurun.');
        return;
      }

      setLoading(true);
      try {
        const response = await api.post('auth/login', {
          email,
          password
        });

        const token = response.data?.token || response.data?.Token || response.data;

        if (token && typeof token === 'string') {
          localStorage.setItem('token', token);//tarayıcının yerel hafızasına eklenir.refresh sonrası otourum acık kalır
          setSuccess(true);
          setEmail('');
          setPassword('');
          navigate('/home');
        } else {
          throw new Error('Geçersiz sunucu yanıtı. Token bulunamadı.');
        }
      } catch (err) {
        console.error('Giriş hatası:', err);
        if (err.response) {
          const serverError = err.response.data;
          setError(typeof serverError === 'string' ? serverError : serverError.message || 'E-posta veya şifre hatalı.');
        } else if (err.request) {
          setError('Sunucuya erişilemiyor. Lütfen API servisinin çalıştığından emin olun.');
        } else {
          setError(err.message || 'Giriş yapılırken beklenmedik bir hata oluştu.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!firstName || !lastName || !email || !password || !phone || !address) {
        setError('Lütfen tüm alanları doldurun.');
        return;
      }

      setLoading(true);
      try {
        await api.post('customers/register', {
          firstName,
          lastName,
          email,
          password,
          phone,
          address
        });

        setSuccess(true);
        toast.success('Kayıt Başarılı! Şimdi giriş yapabilirsiniz.');

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setAddress('');
        setActiveTab('login');
      } catch (err) {
        console.error('Kayıt hatası:', err);
        if (err.response) {
          const serverError = err.response.data;
          setError(typeof serverError === 'string' ? serverError : serverError.message || 'Kayıt oluşturulamadı. Bilgilerinizi kontrol edin.');
        } else if (err.request) {
          setError('Sunucuya erişilemiyor. Lütfen API servisinin çalıştığından emin olun.');
        } else {
          setError(err.message || 'Kayıt olurken beklenmedik bir hata oluştu.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] text-charcoal-900 selection:bg-gold-500/20 selection:text-gold-900 font-sans">

      {/* Sol Görsel Alanı (Split-Screen) */}
      <div className="relative hidden lg:block lg:w-1/2 h-screen overflow-hidden">
        <img
          src="/velora_login_visual.png"
          alt="Velora Luxury Cosmetics"
          className="w-full h-full object-cover select-none transition-transform duration-[10000ms] hover:scale-105"
        />
        {/* Soft elegant overlay */}
        <div className="absolute inset-0 bg-charcoal-900/5" />
      </div>

      {/* Sağ Giriş/Kayıt Formu Alanı */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-sm space-y-10">

          {/* Logo */}
          <div className="text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal-900 tracking-[0.25em] font-light uppercase">
              VELORA
            </h2>
          </div>

          {/* Giriş Yap / Üye Ol Sekmeleri (Tabs) */}
          <div className="flex justify-center border-b border-charcoal-100">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setSuccess(false);
              }}
              className={`pb-3 text-xs tracking-widest uppercase transition-all duration-300 relative px-6 font-medium cursor-pointer ${activeTab === 'login'
                ? 'text-charcoal-900 font-semibold border-b-2 border-gold-500'
                : 'text-charcoal-400 font-light hover:text-charcoal-600'
                }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError(null);
                setSuccess(false);
              }}
              className={`pb-3 text-xs tracking-widest uppercase transition-all duration-300 relative px-6 font-medium cursor-pointer ${activeTab === 'register'
                ? 'text-charcoal-900 font-semibold border-b-2 border-gold-500'
                : 'text-charcoal-400 font-light hover:text-charcoal-600'
                }`}
            >
              Üye Ol
            </button>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Bildirim Durumları */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 text-xs tracking-wide rounded-none animate-fade-in">
                <p className="font-medium">Hata:</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 text-xs tracking-wide rounded-none animate-fade-in">
                <p className="font-medium">İşlem Başarılı!</p>
                <p className="mt-0.5 opacity-90">
                  {activeTab === 'login'
                    ? 'Başarıyla giriş yapıldı.'
                    : 'Hesabınız başarıyla oluşturuldu.'}
                </p>
              </div>
            )}

            <div className="space-y-5">
              {/* Üye Olma Durumunda Kişisel Bilgiler (Ad, Soyad, Telefon, Adres) */}
              {activeTab === 'register' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-widest text-gold-600 uppercase font-medium block">
                        Ad
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Sude"
                        disabled={loading}
                        className="w-full bg-transparent border-b border-charcoal-200 focus:border-gold-500 text-charcoal-900 py-1.5 outline-none text-sm transition-colors duration-300 placeholder-charcoal-300 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-widest text-gold-600 uppercase font-medium block">
                        Soyad
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Kocabıçak"
                        disabled={loading}
                        className="w-full bg-transparent border-b border-charcoal-200 focus:border-gold-500 text-charcoal-900 py-1.5 outline-none text-sm transition-colors duration-300 placeholder-charcoal-300 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-widest text-gold-600 uppercase font-medium block">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 555 555 55 55"
                        disabled={loading}
                        className="w-full bg-transparent border-b border-charcoal-200 focus:border-gold-500 text-charcoal-900 py-1.5 outline-none text-sm transition-colors duration-300 placeholder-charcoal-300 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-widest text-gold-600 uppercase font-medium block">
                        Adres
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Antalya, Türkiye"
                        disabled={loading}
                        className="w-full bg-transparent border-b border-charcoal-200 focus:border-gold-500 text-charcoal-900 py-1.5 outline-none text-sm transition-colors duration-300 placeholder-charcoal-300 font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}


              <div className="space-y-1 relative">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-medium block">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@velora.com"
                  disabled={loading}
                  className="w-full bg-transparent border-b border-charcoal-200 focus:border-gold-500 text-charcoal-900 py-1.5 outline-none text-sm transition-colors duration-300 placeholder-charcoal-300 font-sans"
                />
              </div>


              <div className="space-y-1 relative">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-medium block">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-transparent border-b border-charcoal-200 focus:border-gold-500 text-charcoal-900 py-1.5 pr-8 outline-none text-sm transition-colors duration-300 placeholder-charcoal-300 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-2 text-charcoal-400 hover:text-gold-500 transition-colors duration-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Şifremi Unuttum  */}
              {activeTab === 'login' && (
                <div className="text-right">
                  <a href="#forgot" className="text-[10px] tracking-wider text-charcoal-400 hover:text-gold-600 transition-colors duration-300 uppercase font-light">
                    Şifremi Unuttum
                  </a>
                </div>
              )}
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-medium py-3.5 tracking-[0.2em] uppercase text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-charcoal-300 shadow-sm mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  İşlem Yapılıyor...
                </>
              ) : (
                activeTab === 'login' ? 'GİRİŞ YAP' : 'ÜYE OL'
              )}
            </button>

            {/* Alternatif Yönlendirme Linki */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab(activeTab === 'login' ? 'register' : 'login');
                  setError(null);
                  setSuccess(false);
                }}
                className="text-[11px] tracking-widest text-charcoal-400 hover:text-gold-600 font-light transition-colors duration-300 uppercase underline decoration-charcoal-200 underline-offset-4 cursor-pointer"
              >
                {activeTab === 'login' ? 'Üye Ol' : 'Giriş Yap'}
              </button>
            </div>

          </form>

          {/* Footer Bilgisi */}
          <div className="text-center pt-6 border-t border-charcoal-100">
            <span className="text-[9px] tracking-widest text-charcoal-400 uppercase">
              © 2026 VELORA Cosmetics. Tüm Hakları Saklıdır.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
