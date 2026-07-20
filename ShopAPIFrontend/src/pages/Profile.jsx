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
  Loader2,
  Sparkles,
  ShoppingBag,
  Clock,
  Edit,
  X,
  Save,
  Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [basketCount, setBasketCount] = useState(0);
  const navigate = useNavigate();

  // Profil Güncelleme Modal State'leri
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

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
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          password: ''
        });

        // Sipariş Geçmişi
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

        // Sepetteki ürün adetlerini al (Sadece User rolü için)
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

  // Modal Açma Mantığı
  const handleOpenEditModal = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        password: ''
      });
    }
    setIsEditModalOpen(true);
  };

  // Profil Güncelleme Form Gönderimi
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      if (formData.password && formData.password.trim() !== '') {
        updatePayload.password = formData.password;
      }

      const response = await api.put('customers', updatePayload);
      setProfile(response.data);
      toast.success('Profil bilgileriniz başarıyla güncellendi.');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      toast.error('Profil bilgileri güncellenirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-gold-500/20 selection:text-gold-900 flex flex-col">

      {/* Reusable Mobile Responsive Navbar */}
      <Navbar cartItemsCount={basketCount} />

      {/* Profil Paneli Gövdesi */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex-1 w-full">

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">

            {/* Sol Kart - Özet Profil Bilgisi & Düzenle Butonu */}
            <div className="bg-white p-6 sm:p-8 border border-charcoal-100 flex flex-col items-center text-center space-y-5 shadow-sm">
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

              {/* Bilgileri Düzenle Butonu */}
              <button
                onClick={handleOpenEditModal}
                className="w-full bg-charcoal-900 text-white text-xs tracking-widest uppercase font-medium py-3 px-4 hover:bg-charcoal-800 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Edit className="w-3.5 h-3.5 text-gold-400" />
                <span>Bilgileri Düzenle</span>
              </button>

              {/* Çıkış Yap Butonu */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 border border-red-200 text-xs tracking-widest uppercase font-medium py-2.5 px-4 hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Çıkış Yap</span>
              </button>

              <div className="w-full pt-5 border-t border-charcoal-50 flex justify-around text-center">
                <div>
                  <p className="text-[10px] tracking-wider text-charcoal-400 uppercase">Siparişler</p>
                  <p className="text-sm font-semibold text-charcoal-800 mt-1 flex items-center gap-1 justify-center">
                    <Clock className="w-3.5 h-3.5 text-gold-500" /> {orders.length}
                  </p>
                </div>
                <div className="w-[1px] bg-charcoal-100" />
                <div>
                  <Link to="/cart">
                    <p className="text-[10px] tracking-wider text-charcoal-400 uppercase">Sepetim</p>
                    <p className="text-sm font-semibold text-charcoal-800 mt-1 flex items-center gap-1 justify-center">
                      <ShoppingBag className="w-3.5 h-3.5 text-gold-500" /> {basketCount}
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sağ Kart - Detaylı Bilgiler */}
            <div className="md:col-span-2 bg-white p-6 sm:p-8 md:p-10 border border-charcoal-100 space-y-6 sm:space-y-8 shadow-sm">

              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif text-lg sm:text-xl text-charcoal-900 tracking-wide font-light">Hesap Detayları</h4>
                  <p className="text-charcoal-400 text-xs mt-1">Velora premium cilt bakım üyelik kartınızdaki kişisel detaylar.</p>
                  <div className="w-12 h-[1px] bg-gold-400 mt-3" />
                </div>
                <button
                  onClick={handleOpenEditModal}
                  className="text-xs text-gold-600 hover:text-gold-700 font-semibold tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Düzenle
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* İsim */}
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Adı</span>
                  <div className="bg-charcoal-50 p-3 text-xs sm:text-sm text-charcoal-800 font-light border border-charcoal-100">
                    {profile?.firstName || 'Belirtilmemiş'}
                  </div>
                </div>

                {/* Soyisim */}
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Soyadı</span>
                  <div className="bg-charcoal-50 p-3 text-xs sm:text-sm text-charcoal-800 font-light border border-charcoal-100">
                    {profile?.lastName || 'Belirtilmemiş'}
                  </div>
                </div>

                {/* E-posta */}
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> E-posta Adresi
                  </span>
                  <div className="bg-charcoal-50 p-3 text-xs sm:text-sm text-charcoal-800 font-light border border-charcoal-100 break-all">
                    {profile?.email || 'Belirtilmemiş'}
                  </div>
                </div>

                {/* Telefon */}
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Telefon Numarası
                  </span>
                  <div className="bg-charcoal-50 p-3 text-xs sm:text-sm text-charcoal-800 font-light border border-charcoal-100">
                    {profile?.phone || 'Belirtilmemiş'}
                  </div>
                </div>

                {/* Adres */}
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Teslimat Adresi
                  </span>
                  <div className="bg-charcoal-50 p-3 text-xs sm:text-sm text-charcoal-800 font-light border border-charcoal-100 whitespace-pre-wrap">
                    {profile?.address || 'Belirtilmemiş (Henüz adres eklenmedi)'}
                  </div>
                </div>

                {/* Rol / Yetki */}
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Üyelik Tipi
                  </span>
                  <div className="bg-charcoal-50 p-3 text-xs sm:text-sm text-charcoal-800 font-light border border-charcoal-100 uppercase tracking-widest">
                    {profile?.role || 'Üye'}
                  </div>
                </div>

              </div>

              {/* Sipariş Geçmişi Bölümü */}
              <div className="pt-6 sm:pt-8 border-t border-charcoal-100 space-y-4">
                <div>
                  <h4 className="font-serif text-base sm:text-lg text-charcoal-900 tracking-wide font-light">Sipariş Geçmişim</h4>
                  <p className="text-charcoal-400 text-[11px] mt-1">Daha önce vermiş olduğunuz siparişlerin güncel durumları.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-charcoal-50 p-6 border border-charcoal-100 text-center text-xs text-charcoal-400 font-light">
                    Henüz bir siparişiniz bulunmamaktadır.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.orderId} className="bg-charcoal-50 border border-charcoal-100 p-3.5 sm:p-4 flex flex-wrap justify-between items-center gap-2 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-charcoal-900 block">Sipariş #VEL-{order.orderId}</span>
                          <span className="text-charcoal-400 block">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                          <span className="text-charcoal-500 font-light block">{order.productName || 'Velora Bakım Ürünleri'}</span>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="font-semibold text-charcoal-900 block">{order.totalPrice} TL</span>
                          <span className="inline-block text-[10px] bg-gold-100/60 text-gold-800 font-semibold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                            {order.orderStatus || 'Hazırlanıyor'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lüks Kozmetik Marka Sloganı */}
              <div className="bg-gold-50/50 border border-gold-200/50 p-4 text-xs text-gold-900 leading-relaxed font-light">
                <p className="font-serif italic text-gold-800 text-sm mb-1">Cildinize Özel Seçkin Deneyim</p>
                Velora üyesi olarak, cilt tipinize özel hazırlanan ürün lansmanlarına, kişisel indirim kuponlarına ve özel bakım davetiyelerine öncelikli erişim hakkınız bulunmaktadır.
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Profil Güncelleme Modalı */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-charcoal-100 max-w-lg w-full p-6 md:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Başlığı & Kapatma Butonu */}
            <div className="flex justify-between items-center border-b border-charcoal-100 pb-4">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-charcoal-900 font-light tracking-wide">Profil Bilgilerini Güncelle</h3>
                <p className="text-xs text-charcoal-400 mt-0.5">Kişisel bilgilerinizi ve teslimat adresinizi düzenleyebilirsiniz.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-900 transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Güncelleme Formu */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ad */}
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Ad</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-charcoal-50/50 border border-charcoal-100 focus:border-gold-500 focus:bg-white text-charcoal-900 p-2.5 outline-none text-sm transition-all duration-300 font-light"
                    required
                  />
                </div>

                {/* Soyad */}
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Soyad</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-charcoal-50/50 border border-charcoal-100 focus:border-gold-500 focus:bg-white text-charcoal-900 p-2.5 outline-none text-sm transition-all duration-300 font-light"
                    required
                  />
                </div>
              </div>

              {/* E-posta */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">E-posta Adresi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-charcoal-50/50 border border-charcoal-100 focus:border-gold-500 focus:bg-white text-charcoal-900 p-2.5 outline-none text-sm transition-all duration-300 font-light"
                  required
                />
              </div>

              {/* Telefon */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Telefon Numarası</label>
                <input
                  type="text"
                  placeholder="05XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-charcoal-50/50 border border-charcoal-100 focus:border-gold-500 focus:bg-white text-charcoal-900 p-2.5 outline-none text-sm transition-all duration-300 font-light"
                />
              </div>

              {/* Adres */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Teslimat Adresi</label>
                <textarea
                  rows="3"
                  placeholder="Mahalle, sokak, bina no, ilçe/il..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-charcoal-50/50 border border-charcoal-100 focus:border-gold-500 focus:bg-white text-charcoal-900 p-2.5 outline-none text-sm transition-all duration-300 font-light resize-none"
                />
              </div>

              {/* Şifre Güncelleme (İsteğe Bağlı) */}
              <div className="space-y-1 pt-2 border-t border-charcoal-100">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Yeni Şifre (İsteğe Bağlı)
                </label>
                <input
                  type="password"
                  placeholder="Değiştirmek istemiyorsanız boş bırakın"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-charcoal-50/50 border border-charcoal-100 focus:border-gold-500 focus:bg-white text-charcoal-900 p-2.5 outline-none text-sm transition-all duration-300 font-light"
                />
              </div>

              {/* Butonlar */}
              <div className="flex gap-3 pt-4 border-t border-charcoal-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-xs tracking-widest text-charcoal-500 hover:text-charcoal-800 uppercase font-medium py-3 px-5 border border-charcoal-200 cursor-pointer transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-widest uppercase font-medium py-3 px-6 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:bg-charcoal-300"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-gold-400" />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;
