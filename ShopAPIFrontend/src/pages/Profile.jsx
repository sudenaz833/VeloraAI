import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  LogOut,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShoppingBag,
  Clock
} from 'lucide-react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [basketCount, setBasketCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Oturum Kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // 2. Profil Bilgilerini, Siparişlerini ve Sepet Adedini Çek
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('customers/my-profile');
        setProfile(response.data);

        
        try {
          const ordersResponse = await api.get(`order/customer/${response.data.customerId}`);
          setOrders(ordersResponse.data);
        } catch (orderErr) {
   
          if (orderErr.response && orderErr.response.status === 404) {
            setOrders([]);
          } else {
            console.error('Sipariş geçmişi yüklenirken hata oluştu:', orderErr);
          }
        }

        // Sepetteki ürün adetlerini al (Sadece User rolü için sepet çekilir)
        if (response.data.role !== 'Admin') {
          try {
            const basketResponse = await api.get('basket');
            const totalQty = basketResponse.data.reduce((acc, item) => acc + item.quantity, 0);
            setBasketCount(totalQty);
          } catch (basketErr) {
            if (basketErr.response && basketErr.response.status === 404) {
              setBasketCount(0);
            }
          }
        } else {
          setBasketCount(0);
        }

      } catch (err) {
        console.error('Profil yükleme hatası:', err);
        setError('Profil bilgileri alınamadı. Lütfen tekrar giriş yapın.');

        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Çıkış Yapma Mantığı
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
          <p className="text-xs tracking-[0.2em] text-charcoal-500 uppercase">Velora Hesabınız Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-gold-500/20 selection:text-gold-900">

      {/* Üst Menü / Navbar */}
      <header className="bg-white border-b border-charcoal-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-xs tracking-widest text-charcoal-500 hover:text-gold-600 uppercase transition-colors duration-300">
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <h2 className="font-serif text-xl tracking-[0.25em] font-light uppercase text-charcoal-900">
            VELORA
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs tracking-widest text-red-600 hover:text-red-700 uppercase transition-colors duration-300 font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış Yap</span>
          </button>
        </div>
      </header>

      {/* Profil Paneli Gövdesi */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 text-center space-y-4 max-w-md mx-auto">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-charcoal-900 text-white text-xs tracking-widest uppercase py-2.5 px-6 font-medium inline-block"
            >
              GİRİŞ EKRANINA GİT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

            {/* Sol Kart - Özet Profil Bilgisi */}
            <div className="bg-white p-8 border border-charcoal-100 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gold-50 border border-gold-200 rounded-full flex items-center justify-center text-gold-600 relative">
                <User className="w-10 h-10" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-gold-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg text-charcoal-900 font-medium tracking-wide">
                  {profile?.firstName} {profile?.lastName}
                </h3>
                <span className="inline-block bg-gold-50 text-gold-700 text-[10px] tracking-widest uppercase font-medium px-3 py-1 mt-2 border border-gold-100 rounded-full">
                  Velora Üyesi
                </span>
              </div>

              <div className="w-full pt-6 border-t border-charcoal-50 flex justify-around text-center">
                <div>
                  <p className="text-[10px] tracking-wider text-charcoal-400 uppercase">Siparişler</p>
                  <p className="text-sm font-semibold text-charcoal-800 mt-1 flex items-center gap-1 justify-center">
                    <Clock className="w-3.5 h-3.5 text-gold-500" /> {orders.length}
                  </p>
                </div>
                <div className="w-[1px] bg-charcoal-100" />
                <div>
                 <Link to="/cart"> <p className="text-[10px] tracking-wider text-charcoal-400 uppercase">Sepetim</p>
                  <p className="text-sm font-semibold text-charcoal-800 mt-1 flex items-center gap-1 justify-center">
                    <ShoppingBag className="w-3.5 h-3.5 text-gold-500" /> {basketCount}
                  </p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sağ Kart - Detaylı Bilgiler */}
            <div className="md:col-span-2 bg-white p-8 md:p-10 border border-charcoal-100 space-y-8">

              <div>
                <h4 className="font-serif text-xl text-charcoal-900 tracking-wide font-light">Hesap Detayları</h4>
                <p className="text-charcoal-400 text-xs mt-1">Velora premium cilt bakım üyelik kartınızdaki kişisel detaylar.</p>
                <div className="w-12 h-[1px] bg-gold-400 mt-3" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* İsim */}
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Adı</span>
                  <div className="bg-charcoal-50 p-3 text-sm text-charcoal-800 font-light border border-charcoal-100">
                    {profile?.firstName}
                  </div>
                </div>

                {/* Soyisim */}
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Soyadı</span>
                  <div className="bg-charcoal-50 p-3 text-sm text-charcoal-800 font-light border border-charcoal-100">
                    {profile?.lastName}
                  </div>
                </div>

                {/* E-posta */}
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> E-posta Adresi
                  </span>
                  <div className="bg-charcoal-50 p-3 text-sm text-charcoal-800 font-light border border-charcoal-100">
                    {profile?.email}
                  </div>
                </div>

                {/* Telefon */}
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Telefon Numarası
                  </span>
                  <div className="bg-charcoal-50 p-3 text-sm text-charcoal-800 font-light border border-charcoal-100">
                    {profile?.phone || 'Belirtilmemiş'}
                  </div>
                </div>

                {/* Rol / Yetki */}
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Üyelik Tipi
                  </span>
                  <div className="bg-charcoal-50 p-3 text-sm text-charcoal-800 font-light border border-charcoal-100 uppercase tracking-widest">
                    {profile?.role || 'Üye'}
                  </div>
                </div>

              </div>

              {/* Sipariş Geçmişi Bölümü */}
              <div className="pt-8 border-t border-charcoal-100 space-y-4">
                <div>
                  <h4 className="font-serif text-lg text-charcoal-900 tracking-wide font-light">Sipariş Geçmişim</h4>
                  <p className="text-charcoal-400 text-[11px] mt-1">Daha önce vermiş olduğunuz siparişlerin güncel durumları.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-charcoal-50 p-6 border border-charcoal-100 text-center text-xs text-charcoal-400 font-light">
                    Henüz bir siparişiniz bulunmamaktadır.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.orderId} className="bg-charcoal-50 border border-charcoal-100 p-4 flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-charcoal-900 block">Sipariş #VEL-{order.orderId}</span>
                          <span className="text-charcoal-400 block">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                          <span className="text-charcoal-500 font-light block">{order.productName || 'Velora Bakım Ürünleri'}</span>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="font-semibold text-charcoal-900 block">{order.totalPrice} TL</span>
                          <span className="inline-block text-[10px] bg-gold-100/60 text-gold-800 font-semibold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                            {order.orderStatus || 'Hazırlanıyor.'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

              {/* Ekstra Lüks Kozmetik Marka Sloganı / Bilgilendirme Kutusu */}
              <div className="bg-gold-50/50 border border-gold-200/50 p-4.5 text-xs text-gold-900 leading-relaxed font-light">
                <p className="font-serif italic text-gold-800 text-sm mb-1">Cildinize Özel Seçkin Deneyim</p>
                Velora üyesi olarak, cilt tipinize özel hazırlanan ürün lansmanlarına, kişisel indirim kuponlarına ve özel bakım davetiyelerine öncelikli erişim hakkınız bulunmaktadır.
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default Profile;
