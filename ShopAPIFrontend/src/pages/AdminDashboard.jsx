import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import {
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit3,
  Trash2,
  LogOut,
  ArrowLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'; 

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [product, setProduct] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const [order, setOrder] = useState([]);
  var order2 = []

  // 1. Ürün Form Alanları State'leri (JS Entegrasyonunda kullanılacak)
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Cilt Bakımı');
  const [imageUrl, setImageUrl] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountExpiresAt, setDiscountExpiresAt] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'Admin') {
          navigate('/home')
          return;
        }
      } catch (e) {
        console.error("Token çözümlenirken bir hata oluştu.", e);
        navigate('/');
      }
    }
    else {
      navigate('/');
    }
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Ürünleri Çek
        const prodResponse = await api.get('products');
        setProduct(prodResponse.data);

        // 2. Siparişleri Çek
        try {
          const orderResponse = await api.get('order/all');
          setOrder(orderResponse.data);
        } catch (orderErr) {
          console.error("Sipariş verileri alınırken hata oluştu:", orderErr);
          toast.error("Siparişler yüklenirken bir hata oluştu!");
        }

        // 3. Müşterileri Çek
        try {
          const custResponse = await api.get('customers');
          setCustomer(custResponse.data);
        } catch (custErr) {
          console.error("Müşteri verileri alınırken hata oluştu:", custErr);
        }

      } catch (e) {
        console.error("Dashboard verileri yüklenirken bir hata oluştu.", e);
        setError("Veriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);


  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();//SAYFA YENİLENMESİN!!!!!!!!
    try {
      if (modalMode === 'add') { // yeni ürün ekleme
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock));
        formData.append('category', category);
        if (imageUrl) {
          formData.append('imageUrl', imageUrl);
        }
        if (imageFile) {
          formData.append('ImageFile', imageFile);
        }
        if (discountPrice) {
          formData.append('discountPrice', parseFloat(discountPrice));
        }
        if (discountExpiresAt) {
          formData.append('discountExpiresAt', discountExpiresAt);
        }

        const response = await api.post('products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setProduct([...product, response.data]);
        toast.success("Ürün başarıyla eklendi");
      }
      else if(modalMode ==='edit'){ // api/products/{id} güncelleme
        const productData = {
          productName,
          price: parseFloat(price),
          stock: parseInt(stock),
          category,
          imageUrl,
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          discountExpiresAt: discountExpiresAt ? discountExpiresAt : null
        };
        const updateResponse = await api.put(`products/${productId}`, productData);
        // eskisi ve yenisi yer değiştiriyor.
        setProduct(product.map(p => p.productId === parseInt(productId) ? updateResponse.data : p));
        toast.success("Ürün başarıyla güncellendi.");
      }
      setIsModalOpen(false);
    }
    catch (err) {
      console.error("Ürün kaydedilirken hata oluştu", err);
      toast.error("Ürün kaydedilirken hata oluştu! Lütfen girdileri kontrol edin.");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Bu ürünü silmek istediğinizden emin misiniz?");
    if (!confirmDelete)
      return;
    try {
      setLoading(true);
      await api.delete(`products/${id}`);
      setProduct(product.filter(p => p.productId !== id));
      toast.success("Ürün başarıyla silindi.");
    }
    catch (err) {
      console.error("silme Hatası:", err);
      toast.error("Ürün silinirken bir hata oluştu. Tekrar deneyiniz");
    }
    finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (newStatus === "") {
      toast.warning("Lütfen geçerli bir durum seçiniz.");
      return;
    }
    try {
      setLoading(true);
      await api.put(`order/${orderId}/status`, JSON.stringify(newStatus), {
        headers: { 'Content-Type': 'application/json' }
      });
      // State'i güncelle ki sayfayı yenilemeden ekrana yansısın
      setOrder(order.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success("Sipariş durumu başarıyla güncellendi.");
    }
    catch (err) {
      console.error("Sipariş durumu güncellenirken hata oluştu:", err);
      toast.error("Sipariş durumu güncellenemedi.");
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Siparişi silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await api.delete(`order/${orderId}`);
      setOrder(order.filter(o => o.orderId !== orderId));
      toast.success("Sipariş başarıyla silindi.");      
    }
    catch (err) {
      console.error("Sipariş silme hatası:", err);
      toast.error("Sipariş silinirken hata oluştu.");
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    const confirmDelete = window.confirm("Bu kullanıcıyı silmek istiyor musunuz?");
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await api.delete(`customers/${customerId}`);
      setCustomer(customer.filter(c => c.customerId !== customerId));
      toast.success("Kullanıcı silindi");
    }
    catch (err) { 
      console.error("Kullanıcı silme hatası:", err);
      toast.error("Kullanıcı silinirken hata oluştu.");
    }
    finally {
      setLoading(false);
    }
  };
  const handleEditClick = (product) => {
    setModalMode('edit');
    setProductId(product.productId);
    setProductName(product.productName);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category);
    setImageUrl(product.imageUrl);
    setDiscountPrice(product.discountPrice || '');
    setDiscountExpiresAt(product.discountExpiresAt ? product.discountExpiresAt.substring(0, 16) : '');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setModalMode('add');
    setProductId('');
    setProductName('');
    setPrice('');
    setStock('');
    setCategory('Cilt Bakımı');
    setImageUrl('');
    setDiscountPrice('');
    setDiscountExpiresAt('');
    setImageFile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased flex flex-col lg:flex-row">

      {/* SOL MENÜ / SIDEBAR */}
      <aside className="w-full lg:w-72 bg-charcoal-950 text-white shrink-0 flex flex-col justify-between p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-charcoal-900">
        <div className="space-y-6 lg:space-y-8">

          {/* Logo ve Admin Etiketi */}
          <div className="space-y-2.5">
            <Link to="/home" className="inline-block">
              <h2 className="font-serif text-2xl tracking-[0.25em] font-light uppercase text-white hover:text-gold-400 transition-colors">
                VELORA
              </h2>
            </Link>
            <div className="flex items-center gap-2 text-gold-400 text-[10px] tracking-widest uppercase font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Yönetici Paneli</span>
            </div>
          </div>

          <div className="h-[1px] bg-charcoal-800 hidden lg:block" />

          {/* Menü Sekmeleri */}
          <nav className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between p-3.5 text-xs tracking-wider uppercase font-medium transition-all duration-300 ${activeTab === 'products'
                ? 'bg-gold-500 text-charcoal-950 font-bold'
                : 'text-charcoal-400 hover:bg-charcoal-900 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Ürün Yönetimi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-3.5 text-xs tracking-wider uppercase font-medium transition-all duration-300 ${activeTab === 'orders'
                ? 'bg-gold-500 text-charcoal-950 font-bold'
                : 'text-charcoal-400 hover:bg-charcoal-900 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Sipariş Yönetimi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between p-3.5 text-xs tracking-wider uppercase font-medium transition-all duration-300 ${activeTab === 'customers'
                ? 'bg-gold-500 text-charcoal-950 font-bold'
                : 'text-charcoal-400 hover:bg-charcoal-900 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Müşteri Yönetimi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>

        {/* Çıkış ve Geri Dön Butonları */}
        <div className="space-y-3 pt-8 border-t border-charcoal-800">
          <Link
            to="/home"
            className="flex items-center gap-2 text-xs tracking-widest text-charcoal-400 hover:text-white transition-colors py-2 uppercase font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mağazaya Dön</span>
          </Link>
          <button
            onClick={() => navigate('/')} // Çıkış işleminde Token temizleme eklenecek
            className="w-full flex items-center gap-2 text-xs tracking-widest text-red-400 hover:text-red-300 transition-colors py-2 uppercase font-medium text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* SAĞ İÇERİK ALANI */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">

        {/* TAB 1: ÜRÜN YÖNETİMİ */}
        {activeTab === 'products' && (
          <div className="space-y-6">

            {/* Üst Başlık ve Ekleme Butonu */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal-200 pb-5">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-charcoal-900 tracking-wide font-light">Ürün Yönetimi</h1>
                <p className="text-charcoal-400 text-xs mt-1">Velora ürün listesini güncelleyin, ekleyin veya kaldırın.</p>
              </div>
              <button
                onClick={handleAddClick}
                className="bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-3 px-6 flex items-center gap-2 transition-all duration-300 shadow-md"
              >
                <Plus className="w-4 h-4 text-gold-400" />
                <span>Yeni Ürün Ekle</span>
              </button>
            </div>

            {/* Ürün Listeleme Tablosu */}
            <div className="bg-white border border-charcoal-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-charcoal-50 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-100">
                    <th className="p-4 font-semibold">Görsel</th>
                    <th className="p-4 font-semibold">Ürün Adı</th>
                    <th className="p-4 font-semibold">Kategori</th>
                    <th className="p-4 font-semibold">Fiyat</th>
                    <th className="p-4 font-semibold">Stok</th>
                    <th className="p-4 font-semibold text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {product.map((item) => ( 
                    <tr key={item.productId} className="hover:bg-charcoal-50/50 transition-colors">
                      <td className="p-4">
                        <img src={item.imageUrl || "/images/velora_hero_image.png"} className="w-10 h-10 object-cover border border-charcoal-100" alt={item.productName} />
                      </td>
                      <td className="p-4 font-serif text-sm font-medium text-charcoal-900">{item.productName}</td>
                      <td className="p-4 text-charcoal-500">{item.category}</td>
                      <td className="p-4">
                        {item.discountPrice && item.discountExpiresAt && new Date(item.discountExpiresAt) > new Date() ? (
                          <div className="flex flex-col">
                            <span className="text-[11px] text-red-500 line-through font-medium">{item.price} TL</span>
                            <span className="text-gold-600 font-semibold">{item.discountPrice} TL</span>
                          </div>
                        ) : (
                          <span className="text-gold-600 font-semibold">{item.price} TL</span>
                        )}
                      </td>
                      <td className="p-4 text-charcoal-600">{item.stock} adet</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="text-charcoal-600 hover:text-gold-600 p-1.5 transition-colors"
                            title="Düzenle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.productId)}
                            className="text-charcoal-400 hover:text-red-600 p-1.5 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: SİPARİŞ YÖNETİMİ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">

            <div className="border-b border-charcoal-200 pb-5">
              <h1 className="font-serif text-2xl md:text-3xl text-charcoal-900 tracking-wide font-light">Sipariş Yönetimi</h1>
              <p className="text-charcoal-400 text-xs mt-1">Kullanıcıların vermiş olduğu tüm siparişlerin durumunu izleyin ve güncelleyin.</p>
            </div>

            {/* Sipariş Listeleme Tablosu */}
            <div className="bg-white border border-charcoal-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-charcoal-50 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-100">
                    <th className="p-4 font-semibold">Sipariş Kodu</th>
                    <th className="p-4 font-semibold">Müşteri Bilgisi</th>
                    <th className="p-4 font-semibold">Sipariş Edilen Ürünler & Miktarları</th>
                    <th className="p-4 font-semibold">Tarih</th>
                    <th className="p-4 font-semibold">Toplam Tutar</th>
                    <th className="p-4 font-semibold">Sipariş Durumu</th>
                    <th className="p-4 font-semibold text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {order.map((item) => {
                    const customerObj = customer.find(c => c.customerId === item.customerId);
                    const customerEmail = item.customerEmail || customerObj?.email || `Müşteri #${item.customerId}`;
                    const customerName = item.customerName || (customerObj ? `${customerObj.firstName} ${customerObj.lastName}` : '');
                    const productSummary = item.productsSummary || item.productName || 'Ürün detayı bulunamadı';

                    return (
                      <tr key={item.orderId} className="hover:bg-charcoal-50/50 transition-colors">
                        <td className="p-4 font-semibold text-charcoal-900 whitespace-nowrap">#VEL-{item.orderId}</td>
                        <td className="p-4 text-charcoal-700 whitespace-nowrap">
                          {customerName && <span className="font-semibold block text-charcoal-900">{customerName}</span>}
                          <span className="text-charcoal-500 text-[11px] block">{customerEmail}</span>
                        </td>
                        <td className="p-4 text-charcoal-800">
                          <ul className="space-y-1.5 min-w-[200px]">
                            {productSummary.split(', ').map((prod, idx) => {
                              const match = prod.match(/(.+)\s+\((\d+)\s*Adet\)/i) || prod.match(/(.+)\s+\((\d+)\)/);
                              const name = match ? match[1].trim() : prod;
                              const count = match ? match[2] : '1';

                              return (
                                <li key={idx} className="flex items-center gap-2 text-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                                  <span className="font-medium text-charcoal-900">{name}</span>
                                  <span className="text-gold-700 font-semibold text-[11px]">({count} Adet)</span>
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                        <td className="p-4 text-charcoal-400 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString('tr-TR')}</td>
                        <td className="p-4 text-gold-600 font-semibold whitespace-nowrap">{item.totalPrice} TL</td>
                        <td className="p-4 whitespace-nowrap">
                          {/* Sipariş Durumu Seçici Dropdown */}
                          <select
                            value={item.orderStatus || "Hazırlanıyor."}
                            onChange={(e) => handleUpdateOrderStatus(item.orderId, e.target.value)}
                            className="bg-[#FAF8F5] border border-charcoal-200 text-charcoal-800 text-[11px] p-1.5 focus:border-gold-500 focus:outline-none cursor-pointer"
                          >
                            <option value="Hazırlanıyor.">Hazırlanıyor.</option>
                            <option value="Kargoya Verildi.">Kargoya Verildi.</option>
                            <option value="Teslim Edildi.">Teslim Edildi.</option>
                            <option value="İptal Edildi.">İptal Edildi.</option>
                          </select>
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteOrder(item.orderId)}
                            className="text-charcoal-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                            title="Siparişi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: MÜŞTERİ YÖNETİMİ */}
        {activeTab === 'customers' && (
          <div className="space-y-6">

            <div className="border-b border-charcoal-200 pb-5">
              <h1 className="font-serif text-2xl md:text-3xl text-charcoal-900 tracking-wide font-light">Müşteri Yönetimi</h1>
              <p className="text-charcoal-400 text-xs mt-1">Sisteme kayıtlı olan tüm müşterileri listeleyin.</p>
            </div>

            {/* Müşteri Listeleme Tablosu */}
            <div className="bg-white border border-charcoal-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-charcoal-50 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-100">
                    <th className="p-4 font-semibold">Müşteri ID</th>
                    <th className="p-4 font-semibold">Ad Soyad</th>
                    <th className="p-4 font-semibold">E-posta</th>
                    <th className="p-4 font-semibold">Telefon</th>
                    <th className="p-4 font-semibold">Üyelik Tipi</th>
                    <th className="p-4 font-semibold text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {customer.map((item) => (
                    <tr key={item.customerId} className="hover:bg-charcoal-50/50 transition-colors">
                      <td className="p-4 text-charcoal-400">#{item.customerId}</td>
                      <td className="p-4 font-medium text-charcoal-900">{item.firstName} {item.lastName}</td>
                      <td className="p-4 text-charcoal-600">{item.email}</td>
                      <td className="p-4 text-charcoal-500">{item.phone || 'Belirtilmemiş'}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] rounded-sm font-semibold uppercase tracking-wider ${item.role === 'Admin'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-gold-50 text-gold-700 border border-gold-100'
                          }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {item.role !== 'Admin' && (
                          <button
                            onClick={() => handleDeleteCustomer(item.customerId)}
                            className="text-charcoal-400 hover:text-red-600 p-1.5 transition-colors"
                            title="Müşteriyi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          ÜRÜN EKLEME / DÜZENLEME MODAL FORMU
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-charcoal-100 shadow-2xl max-w-md w-full p-8 space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">

            {/* Modal Başlığı */}
            <div className="border-b border-charcoal-100 pb-3 flex justify-between items-center">
              <h3 className="font-serif text-lg text-charcoal-900 tracking-wide font-medium">
                {modalMode === 'add' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700 text-lg font-light leading-none"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">

              {/* Ürün Adı */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Ürün Adı</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Nemlendirici Serum..."
                  required
                  className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-3 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Fiyat */}
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Fiyat (TL)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="350"
                    required
                    className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-3 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                {/* Stok */}
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Stok Adeti</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="25"
                    required
                    className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-3 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* İndirimli Fiyat ve Bitiş Tarihi */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">İndirimli Fiyat (TL)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Opsiyonel"
                    className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-3 focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">İndirim Bitiş Tarih & Saat</label>
                  <input
                    type="datetime-local"
                    value={discountExpiresAt}
                    onChange={(e) => setDiscountExpiresAt(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-3 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Kategori Seçimi */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-3 focus:border-gold-500 focus:outline-none"
                >
                  <option value="Cilt Bakımı">Cilt Bakımı</option>
                  <option value="Makyaj">Makyaj</option>
                  <option value="Parfüm">Parfüm</option>
                  <option value="Setler">Setler</option>
                </select>
              </div>

              {/* Resim Yolu */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Görsel URL / Yolu</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/product1.png"
                  className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-3 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Veya Görsel Yükle */}
              {modalMode === 'add' && (
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Veya Görsel Yükle (Cloudinary)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full bg-[#FAF8F5] border border-charcoal-200 text-xs p-2.5 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Form Butonları */}
              <div className="flex gap-3 pt-4 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-transparent border border-charcoal-200 text-charcoal-600 text-xs uppercase py-3 font-medium tracking-wider hover:bg-charcoal-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-charcoal-900 text-white text-xs uppercase py-3 font-medium tracking-wider hover:bg-charcoal-800"
                >
                  Kaydet
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
