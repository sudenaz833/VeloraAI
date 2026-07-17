import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import {
    Trash2,
    ArrowLeft,
    ShoppingBag,
    Loader2,
    Phone,
    Mail,
    MapPin,
    User,
    Plus,
    Minus
} from 'lucide-react';

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingBasketId, setDeletingBasketId] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(null);

    // 1. Sepet verilerini backend'den çek (GET api/basket)
    const fetchBaskets = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await api.get('basket');
            setCartItems(response.data);
        } catch (err) {
            console.error("Sepet yükleme hatası", err);
            if (err.response && err.response.status === 404) {
                setCartItems([]);
            } else {
                setError("Sepet yüklenemedi. Lütfen tekrar deneyiniz.");
            }

            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Oturum kontrolü
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        fetchBaskets();
    }, [navigate]);

    const handleDeleteItem = async (basketId) => {
        setIsUpdating(true);
        setDeletingBasketId(basketId);
        try {
            setError('');
            await api.delete(`basket/${basketId}`);
            setCartItems((prevItems) => prevItems.filter((item) => item.basketId !== basketId));
        } catch (err) {
            console.error("Sepetten silme hatası", err);
            setError("Ürün sepetten silinemedi. Lütfen tekrar deneyiniz.");
        } finally {
            setIsUpdating(false);
            setDeletingBasketId(null);
        }
    };


    const handleQuantityChange = async (basketId, newQuantity) => {
        if (newQuantity < 1) return;
        setIsUpdating(true);
        try {
            setError('');
            await api.put(`basket/${basketId}`, { quantity: newQuantity });
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.basketId === basketId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            console.error("Miktar güncelleme hatası", err);
            setError("Ürün miktarı güncellenemedi. Lütfen tekrar deneyiniz.");
        } finally {
            setIsUpdating(false);
        }
    };

    // 4. Sepet Toplamlarını Hesaplama
    useEffect(() => {
        let calculatedTotal = 0;
        cartItems.forEach((item) => {
            calculatedTotal += item.quantity * item.price;
        });

        setTotalPrice(calculatedTotal);
        setTax((calculatedTotal * 0.08).toFixed(2)); // %8 KDV
        setGrandTotal((calculatedTotal * 1.08).toFixed(2)); // KDV Dahil Toplam
    }, [cartItems]);

    const handleCheckout = async () => {
        setIsUpdating(true);
        try {
            setError('');
            const response = await api.post('order');
            setCartItems([]);
            toast.success('Siparişiniz başarıyla oluşturuldu!');
            setOrderSuccess('Siparişiniz başarıyla oluşturuldu!');

        } catch (err) {
            console.error("Sipariş oluşturma hatası", err);
            let errMsg = "Sipariş oluşturulamadı. Lütfen tekrar deneyiniz.";
            if (err.response) {
                const serverData = err.response.data;
                if (typeof serverData === 'string' && !serverData.includes('<!DOCTYPE html>') && !serverData.includes('<html>')) {
                    errMsg = serverData;
                } else if (serverData && typeof serverData === 'object' && serverData.message) {
                    errMsg = serverData.message;
                }
            }
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleClearCart = async () => {
        const confirmClear = window.confirm("Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz?");
        if (!confirmClear) return;
        setIsUpdating(true);
        try {
            setError('');
            await api.delete('basket/clear');
            setCartItems([]);
            toast.success("Sepetiniz başarıyla boşaltıldı.");
        } catch (err) {
            console.error("Sepet boşaltma hatası", err);
            toast.error("Sepet temizlenirken bir hata oluştu.");
        } finally {
            setIsUpdating(false);
        }
    };
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
                    <Link to="/home" className="group">
                        <h2 className="font-serif text-3xl tracking-[0.25em] font-light uppercase text-charcoal-900 group-hover:text-gold-600 transition-colors duration-300">
                            VELORA
                        </h2>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-12">
                        <Link to="/home" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
                            Anasayfa
                        </Link>
                        <Link to="/about" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
                            Hakkımızda
                        </Link>
                        <Link to="/products" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
                            Ürünler
                        </Link>
                        <Link to="/home#values" className="text-xs tracking-widest uppercase font-medium text-charcoal-400 hover:text-gold-500 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300">
                            Değerlerimiz
                        </Link>
                    </nav>

                    {/* Action Icons */}
                    <div className="flex items-center gap-6">
                        <Link to="/profile" className="text-charcoal-500 hover:text-gold-500 transition-colors duration-300 p-1.5" title="Profilim">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link to="/cart" className="text-gold-600 hover:text-gold-500 transition-colors duration-300 p-1.5 relative" title="Sepetim">
                            <ShoppingBag className="w-5 h-5" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>
            </header>

            {/* 3. ANA GÖVDE (Sepet Detayı) */}
            <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">

                {/* Başlık */}
                <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
                    <span className="text-[10px] tracking-[0.25em] text-gold-600 uppercase font-semibold block">Oturumunuz</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-charcoal-900 tracking-wide font-light">Alışveriş Sepetim</h1>
                    <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-2" />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-xs tracking-wide mb-6">
                        <p className="font-medium">Hata:</p>
                        <p className="mt-0.5 opacity-90">{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                        <p className="text-xs tracking-[0.2em] text-charcoal-500 uppercase font-light">Sepetiniz Kontrol Ediliyor...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    /* Sepet Boş Durumu */
                    <div className="bg-white border border-charcoal-100 p-12 md:p-16 text-center space-y-6 shadow-sm">
                        <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-serif text-lg text-charcoal-900 font-medium tracking-wide">Sepetiniz Şu Anda Boş</h3>
                            <p className="text-charcoal-400 text-xs font-light max-w-sm mx-auto">
                                Sepetinizde ürün bulunmamaktadır. Velora'nın seçkin cilt bakım koleksiyonunu inceleyerek sepetinizi doldurabilirsiniz.
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-3.5 px-8 inline-flex items-center gap-2 transition-all duration-300 shadow-md"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Koleksiyona Git</span>
                        </Link>
                    </div>
                ) : (
                    /* Sepet Dolu Durumu */
                    <div className="flex flex-col lg:flex-row gap-10 items-start">

                        {/* Ürün Listesi Sol Taraf */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={handleClearCart}
                                    className="text-[10px] tracking-widest text-red-500 hover:text-red-750 font-semibold uppercase py-2.5 px-4 border border-red-200 hover:border-red-300 hover:bg-red-50/20 cursor-pointer transition-all duration-300 flex items-center gap-1.5 bg-white shadow-sm"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Sepeti Boşalt
                                </button>
                            </div>
                            <div className="bg-white border border-charcoal-100 divide-y divide-charcoal-100 shadow-sm">
                                {cartItems.map((item) => (
                                    <div key={item.basketId} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                                        {/* Ürün Resim ve Adı */}
                                        <div className="flex items-center gap-4.5 flex-1">
                                            <div className="w-20 h-20 bg-charcoal-50 border border-charcoal-100 shrink-0 overflow-hidden">
                                                <img
                                                    src={item.imageUrl || "/velora_hero_image.png"}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-serif text-sm md:text-base text-charcoal-900 font-light tracking-wide">
                                                    {item.productName}
                                                </h4>
                                                <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-light">Birim Fiyat</span>
                                                <p className="text-gold-600 text-sm font-semibold">{item.price} TL x {item.quantity} adet</p>
                                                
                                            </div>
                                        </div>

                                        {/* Miktar Seçici, Toplam Fiyat ve Sil Butonu */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-t-0 pt-4 sm:pt-0">

                                            {/* Miktar Ayarı */}
                                            <div className="flex items-center border border-charcoal-200 bg-white">
                                                <button
                                                    onClick={() => handleQuantityChange(item.basketId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || isUpdating}
                                                    className="px-3 py-1.5 hover:bg-charcoal-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <Minus className="w-3 h-3 text-charcoal-500" />
                                                </button>
                                                <span className="px-3 text-xs font-semibold select-none text-charcoal-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.basketId, item.quantity + 1)}
                                                    disabled={isUpdating}
                                                    className="px-3 py-1.5 hover:bg-charcoal-50 transition-colors disabled:opacity-40"
                                                >
                                                    <Plus className="w-3 h-3 text-charcoal-500" />
                                                </button>
                                            </div>

                                            {/* Toplam Fiyat */}
                                            <div className="text-right min-w-[5rem]">
                                                <span className="text-[9px] tracking-wider text-charcoal-400 uppercase font-light block">Toplam</span>
                                                <p className="text-charcoal-900 text-sm font-semibold">{(item.quantity * item.price)} TL</p>
                                            </div>

                                            {/* Silme Butonu */}
                                            <button
                                                onClick={() => handleDeleteItem(item.basketId)}
                                                disabled={isUpdating}
                                                className="text-charcoal-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer disabled:opacity-40"
                                                title="Ürünü Çıkar"
                                            >
                                                {deletingBasketId === item.basketId ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                                ) : (
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                )}
                                            </button>

                                        </div>

                                    </div>
                                ))}
                            </div>

                            {/* Devam Et / Alışveriş Linki */}
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-1.5 text-xs tracking-widest text-charcoal-500 hover:text-gold-600 uppercase font-medium transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Koleksiyona Geri Dön</span>
                            </Link>
                        </div>

                        {/* Sipariş Özeti Sağ Panel */}
                        <div className="w-full lg:w-80 bg-white border border-charcoal-100 p-6 md:p-8 shadow-sm space-y-6">

                            <div>
                                <h3 className="font-serif text-lg text-charcoal-900 tracking-wide font-medium">Sipariş Özeti</h3>
                                <div className="w-8 h-[1px] bg-gold-400 mt-2" />
                            </div>

                            <div className="space-y-4 text-xs tracking-wider uppercase">
                                <div className="flex justify-between text-charcoal-500">
                                    <span>Ürün Bedeli</span>
                                    <span className="text-charcoal-800 font-medium">{totalPrice} TL</span>
                                </div>
                                <div className="flex justify-between text-charcoal-500">
                                    <span>KDV (%8)</span>
                                    <span className="text-charcoal-800 font-medium">{tax} TL</span>
                                </div>
                                <div className="flex justify-between text-charcoal-500">
                                    <span>Kargo Ücreti</span>
                                    <span className="text-emerald-600 font-semibold uppercase tracking-widest">Ücretsiz</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold border-t border-charcoal-100 pt-4 text-charcoal-900">
                                    <span>Genel Toplam</span>
                                    <span className="text-gold-600 text-base">{grandTotal} TL</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isUpdating}
                                className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-medium py-4 tracking-[0.2em] uppercase text-xs transition-all duration-300 shadow-md disabled:bg-charcoal-300 disabled:cursor-not-allowed"
                            >
                                Alışverişi Tamamla
                            </button>

                            <p className="text-[10px] text-charcoal-400 text-center leading-relaxed font-light">
                                Ödemeleriniz SSL sertifikalı güvenli ödeme altyapısıyla 256-bit şifrelenir.
                            </p>

                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

export default Cart;