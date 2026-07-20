import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from '../api/axiosConfig';
import {
    ArrowLeft,
    Star,
    ShoppingBag,
    Loader2,
    MessageSquare,
    User,
    Send,
    Trash2,
    Edit,
    Sparkles,
    Shield,
    Clock,
    Target
} from 'lucide-react';
import Navbar from '../components/Navbar';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [profile, setProfile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [addingToBasket, setAddingToBasket] = useState(false);

    // Yorum Güncelleme State'leri
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [editingRating, setEditingRating] = useState(5);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        const fetchProductDeatilAndComments = async () => {
            try {
                setLoading(true);
                setError(null);
                const productRes = await api.get(`products/${id}`);
                setProduct(productRes.data);
                const commentRes = await api.get(`comments/product/${id}`);
                setComments(commentRes.data);
                const profileRes = await api.get('customers/my-profile');
                setProfile(profileRes.data);
            } catch (err) {
                console.error("Detay sayfası yükleme hatası:", err);
                setError("Ürün detayları veya yorumlar yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductDeatilAndComments();
    }, [id, navigate]);

    const handleAddToBasket = async () => {
        try {
            setAddingToBasket(true);
            await api.post('basket', { productId: parseInt(id), quantity: 1 });
            toast.success("Ürün sepete eklendi!");
        } catch (err) {
            console.error("Sepete ekleme hatası:", err);
            toast.error("Ürün sepete eklenirken bir hata oluştu.");
        } finally {
            setAddingToBasket(false);
        }
    };

    const updateProductRatingLocally = (updatedComments) => {
        const count = updatedComments.length;
        const sum = updatedComments.reduce((acc, c) => acc + (parseFloat(c.rating) || 0), 0);
        const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
        setProduct(prev => prev ? { ...prev, commentCount: count, averageRating: avg } : null);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText) {
            toast.warning("Yorum alanı boş bırakılamaz.");
            return;
        }
        try {
            setSubmittingComment(true);
            const newCommentDto = {
                productId: parseInt(id),
                customerId: profile.customerId,
                text: commentText,
                rating: rating.toString(),
            };
            const response = await api.post('comments', newCommentDto);
            toast.success("Yorumunuz başarıyla eklendi.");
            
            const newComments = [...comments, response.data];
            setComments(newComments);
            updateProductRatingLocally(newComments);
            
            setCommentText("");
            setRating(5);
        } catch (err) {
            console.error("Yorum gönderme hatası", err);
            toast.error("Yorum eklenirken bir hata oluştu");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmDelete = window.confirm("Bu yorumu silmek istediğinizden emin misiniz?");
        if (!confirmDelete) return;
        try {
            setLoading(true);
            await api.delete(`comments/${commentId}`);
            
            const newComments = comments.filter(c => c.commentId !== commentId);
            setComments(newComments);
            updateProductRatingLocally(newComments);
            
            toast.success("Yorumunuz başarıyla silindi.");
        } catch (err) {
            console.error("Yorum silme hatası:", err);
            toast.error("Yorum silinirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.commentId);
        setEditingText(comment.text);
        const parsedRating = parseInt(comment.rating);
        setEditingRating(isNaN(parsedRating) ? 5 : parsedRating);
    };

    const handleUpdateComment = async (commentId) => {
        if (commentId === null) {
            toast.warning("Yorum kimliği bulunamadı.");
            return;
        }
        if (!editingText.trim()) {
            toast.warning("Yorum alanı boş bırakılamaz.");
            return;
        }
        try {
            setLoading(true);
            const response = await api.put(`comments/${commentId}`, {
                text: editingText,
                rating: editingRating.toString()
            });
            
            const newComments = comments.map(c => c.commentId === commentId ? response.data : c);
            setComments(newComments);
            updateProductRatingLocally(newComments);
            
            setEditingCommentId(null);
            toast.success("Yorum başarıyla güncellendi.");
        } catch (err) {
            console.error("Yorum güncelleme hatası:", err);
            toast.error("Yorum güncellenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (ratingStr) => {
        const ratingVal = parseInt(ratingStr) || 5;
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star}
                        className={`w-3.5 h-3.5 ${star <= ratingVal ? "fill-gold-500 text-gold-500" : "text-charcoal-200"}`} />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
                    <p className="text-xs tracking-[0.2em] text-charcoal-500 uppercase">Detaylar Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 p-8 text-center space-y-4 max-w-md w-full">
                    <p className="text-sm font-medium">{error || "Ürün bulunamadı."}</p>
                    <Link to="/products" className="bg-charcoal-900 text-white text-xs tracking-widest uppercase py-2.5 px-6 font-medium inline-block">
                        Ürünlere Geri Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-gold-500/20 selection:text-gold-900 flex flex-col">

            {/* Reusable Responsive Navbar */}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 space-y-10 sm:space-y-16 flex-1 w-full">

                {/* Geri Dön Linki */}
                <div>
                    <Link to="/products" className="inline-flex items-center gap-2 text-xs tracking-widest text-charcoal-500 hover:text-gold-600 uppercase transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Tüm Ürünlere Dön</span>
                    </Link>
                </div>

                {/* Ürün Detay Bölümü (Split Screen) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start bg-white border border-charcoal-100 p-5 sm:p-8 md:p-12 shadow-sm">

                    {/* Sol - Ürün Görseli */}
                    <div className="aspect-square w-full overflow-hidden bg-charcoal-50 border border-charcoal-100">
                        <img
                            src={product.imageUrl || "/velora_hero_image.png"}
                            alt={product.productName}
                            className="w-full h-full object-cover transition-transform duration-[6000ms] hover:scale-105"
                        />
                    </div>

                    {/* Sağ - Ürün Bilgileri */}
                    <div className="space-y-5 sm:space-y-6">
                        <div className="space-y-2">
                            <span className="text-[10px] tracking-[0.25em] text-gold-600 uppercase font-semibold block">
                                {product.category || "Velora Seçkisi"}
                            </span>
                            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 tracking-wide font-light">
                                {product.productName}
                            </h1>
                            
                            {/* Ortalama Yıldız ve Yorum Sayısı */}
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3.5 h-3.5 ${
                                                star <= Math.round(product.averageRating)
                                                    ? "fill-gold-500 text-gold-500"
                                                    : "text-charcoal-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-charcoal-500 font-light">
                                    {product.averageRating} / 5 ({product.commentCount} Değerlendirme)
                                </span>
                            </div>
                            
                            <div className="w-12 h-[1px] bg-gold-400 mt-3" />
                        </div>

                        {/* Fiyat ve Stok */}
                        <div className="flex justify-between items-baseline py-4 border-y border-charcoal-50">
                            <div>
                                <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-light block">Fiyat</span>
                                <span className="text-gold-600 text-xl sm:text-2xl font-semibold">{product.price} TL</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-light block">Stok Durumu</span>
                                <span className={`text-xs sm:text-sm font-medium ${product.stock > 5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {product.stock > 0 ? `${product.stock} Adet Mevcut` : 'Tükendi'}
                                </span>
                            </div>
                        </div>

                        {/* Ürün Açıklaması */}
                        <div className="space-y-2">
                            <span className="text-[10px] tracking-wider text-charcoal-400 uppercase font-semibold block">Ürün Açıklaması</span>
                            <p className="text-charcoal-600 text-xs sm:text-sm leading-relaxed font-light">
                                {product.description || "Velora serisinin bu eşsiz ürünü, cildinizin doğal ışıltısını ortaya çıkarmak ve derinlemesine bakım sağlamak için özel bileşenlerle formüle edilmiştir."}
                            </p>
                        </div>

                        {/* Cilt Bakımı & Dermokozmetik Formül Özellikleri (AI Alanları) */}
                        <div className="bg-[#FAF8F5] border border-gold-200/80 p-4 sm:p-5 space-y-3.5 rounded-sm">
                            <div className="flex items-center gap-2 border-b border-gold-200/60 pb-2.5">
                                <Sparkles className="w-4 h-4 text-gold-600" />
                                <h3 className="font-serif text-xs sm:text-sm tracking-widest text-charcoal-900 uppercase font-medium">
                                    Cilt Bakım Formülü & Dermokozmetik Detaylar
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                                
                                {/* Aktif İçerikler */}
                                {product.activeIngredients && product.activeIngredients.length > 0 && (
                                    <div className="space-y-1 sm:col-span-2">
                                        <span className="text-[10px] tracking-wider text-gold-700 uppercase font-semibold flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-gold-500" /> Aktif İçerikler
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                            {product.activeIngredients.map((ing, idx) => (
                                                <span key={idx} className="bg-white border border-gold-200 text-charcoal-800 text-[11px] px-2.5 py-0.5 font-medium rounded-xs shadow-2xs">
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Uygun Cilt Tipleri */}
                                {product.skinTypes && product.skinTypes.length > 0 && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] tracking-wider text-gold-700 uppercase font-semibold flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-gold-500" /> Uygun Cilt Tipleri
                                        </span>
                                        <div className="flex flex-wrap gap-1 pt-0.5">
                                            {product.skinTypes.map((st, idx) => (
                                                <span key={idx} className="bg-emerald-50/90 border border-emerald-200 text-emerald-950 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                                    {st}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Kullanım Zamanı */}
                                {product.usageTime && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] tracking-wider text-gold-700 uppercase font-semibold flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-gold-500" /> Kullanım Zamanı
                                        </span>
                                        <div className="pt-0.5">
                                            <span className="inline-block bg-charcoal-900 text-gold-400 font-mono text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-xs">
                                                {product.usageTime}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Cilt Sorunları / Hedefler */}
                                {product.concerns && product.concerns.length > 0 && (
                                    <div className="space-y-1 sm:col-span-2">
                                        <span className="text-[10px] tracking-wider text-gold-700 uppercase font-semibold flex items-center gap-1">
                                            <Target className="w-3 h-3 text-gold-500" /> Hedeflenen Cilt Sorunları
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                            {product.concerns.map((concern, idx) => (
                                                <span key={idx} className="bg-amber-50/90 border border-amber-200 text-amber-950 text-[10px] px-2.5 py-0.5 rounded-xs font-medium">
                                                    ✓ {concern}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Sepete Ekle Butonu */}
                        <button
                            disabled={product.stock <= 0 || addingToBasket}
                            onClick={handleAddToBasket}
                            className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-4 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-charcoal-200 disabled:text-charcoal-400 disabled:cursor-not-allowed shadow-md"
                        >
                            {addingToBasket ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Ekleniyor...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-4 h-4" />
                                    SEPETE EKLE
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Yorumlar ve Değerlendirmeler Bölümü */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">

                    {/* Sol - Yorumları Listeleme (2 Kolon) */}
                    <div className="lg:col-span-2 space-y-6 bg-white border border-charcoal-100 p-5 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-2 pb-4 border-b border-charcoal-50">
                            <MessageSquare className="w-5 h-5 text-gold-500" />
                            <h3 className="font-serif text-lg sm:text-xl text-charcoal-900 tracking-wide font-light">
                                Yorumlar & Değerlendirmeler ({comments.length})
                            </h3>
                        </div>
                        {comments.length === 0 ? (
                            <div className="text-center py-12 bg-charcoal-50/50 border border-dashed border-charcoal-200 text-xs text-charcoal-400 font-light uppercase tracking-wider">
                                Bu ürüne henüz yorum yapılmamış. İlk yorumu siz yapın!
                            </div>
                        ) : (
                            <div className="space-y-6 divide-y divide-charcoal-50">
                                {comments.map((comment, index) => (
                                    <div key={index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-3`}>
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 text-xs font-semibold">
                                                    <User className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-charcoal-800 block">
                                                        {comment.customerFirstName} {comment.customerLastName}
                                                    </span>
                                                    <span className="text-[10px] text-charcoal-400 block font-light">
                                                        {comment.customerEmail}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {renderStars(comment.rating)}
                                                
                                                {/* Düzenleme ve Silme Butonları */}
                                                {(profile?.customerId === comment.customerId || profile?.role === 'Admin') && (
                                                    <div className="flex items-center gap-1">
                                                        {profile?.customerId === comment.customerId && (
                                                            <button 
                                                                onClick={() => startEditing(comment)}
                                                                className="text-gold-600 hover:text-gold-700 transition-colors p-1 cursor-pointer"
                                                                title="Yorumu Düzenle"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.commentId)}
                                                            className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                                                            title="Yorumu Sil"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Inline Düzenleme Formu veya Normal Metin */}
                                        {editingCommentId === comment.commentId ? (
                                            <div className="space-y-3 pt-2 bg-charcoal-50 p-4 border border-charcoal-100 mt-2">
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setEditingRating(star)}
                                                            className="focus:outline-none cursor-pointer"
                                                        >
                                                            <Star className={`w-4 h-4 pointer-events-none ${star <= editingRating ? "fill-gold-500 text-gold-500" : "text-charcoal-200 hover:text-gold-300"}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                                <textarea
                                                    rows="2"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    className="w-full bg-white border border-charcoal-100 p-2.5 outline-none text-sm transition-all duration-300 font-light resize-none focus:border-gold-500"
                                                    required
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingCommentId(null)}
                                                        className="text-[10px] tracking-widest text-charcoal-500 hover:text-charcoal-700 font-medium uppercase py-1.5 px-3 border border-charcoal-200 cursor-pointer transition-all"
                                                    >
                                                        İptal
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateComment(comment.commentId)}
                                                        className="text-[10px] tracking-widest bg-charcoal-900 text-white hover:bg-charcoal-800 font-medium uppercase py-1.5 px-3 cursor-pointer transition-all"
                                                    >
                                                        Kaydet
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-charcoal-600 text-xs sm:text-sm font-light leading-relaxed">
                                                {comment.text}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sağ - Yorum Formu (1 Kolon) */}
                    <div className="bg-white border border-charcoal-100 p-5 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-sm">
                        <div>
                            <h3 className="font-serif text-lg text-charcoal-900 tracking-wide font-light">Deneyiminizi Paylaşın</h3>
                            <p className="text-charcoal-400 text-xs mt-1">Ürün hakkındaki değerlendirmeniz bizim için değerlidir.</p>
                            <div className="w-8 h-[1px] bg-gold-400 mt-3" />
                        </div>
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            {/* Yıldız Derecelendirme Seçimi */}
                            <div className="space-y-2">
                                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Derecelendirme</label>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-colors duration-200 cursor-pointer"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= rating ? "fill-gold-500 text-gold-500" : "text-charcoal-200 hover:text-gold-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Yorum Metni */}
                            <div className="space-y-2">
                                <label className="text-[10px] tracking-widest text-gold-600 uppercase font-semibold block">Yorumunuz</label>
                                <textarea
                                    rows="4"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Ürün hakkındaki görüşlerinizi yazın..."
                                    className="w-full bg-charcoal-50/50 border border-charcoal-100 focus:border-gold-500 focus:bg-white text-charcoal-900 p-3 outline-none text-sm transition-all duration-300 font-light resize-none placeholder-charcoal-300"
                                    required
                                />
                            </div>

                            {/* Gönderen Kişi Bilgisi */}
                            {profile && (
                                <div className="text-[10px] text-charcoal-400 tracking-wide font-light italic">
                                    <strong>{profile.firstName} {profile.lastName}</strong> olarak yorum yapıyorsunuz.
                                </div>
                            )}

                            {/* Gönder Butonu */}
                            <button
                                type="submit"
                                disabled={submittingComment}
                                className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-3.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-charcoal-200 disabled:text-charcoal-400 disabled:cursor-not-allowed shadow-md"
                            >
                                {submittingComment ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        YORUMU GÖNDER
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default ProductDetail;
