import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  HeartPulse,
  Package,
  ExternalLink,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const SKIN_TYPES = [
  { id: 'Yağlı', label: 'Yağlı', desc: 'Tüm yüzünüzde parlama, genişlemiş gözenekler ve yağlanma şikayeti var.' },
  { id: 'Kuru', label: 'Kuru', desc: 'Cildinizde gerginlik, pul pul dökülme ve nemsizlik hissi ön planda.' },
  { id: 'Karma', label: 'Karma', desc: 'T bölgeniz (alın, burun, çene) yağlı, yanaklarınız kuru veya normal.' },
  { id: 'Hassas', label: 'Hassas', desc: 'Cildiniz çabuk kızarır, kaşınır, yanma veya tepki vermeye eğilimli.' },
  { id: 'Normal', label: 'Normal', desc: 'Cildinizde belirgin bir yağlanma veya kuruluk dengesizliği yok.' }
];

const CONCERNS_LIST = [
  { id: 'Gözenek', label: 'Gözenek Sıkılaştırma', icon: '✨' },
  { id: 'Siyah Nokta', label: 'Siyah Nokta Temizliği', icon: '🌑' },
  { id: 'Akne / Sivilce', label: 'Akne & Sivilce Eğilimi', icon: '⚡' },
  { id: 'Kızarıklık', label: 'Kızarıklık & Hassasiyet', icon: '🌸' },
  { id: 'Leke / Renk Düzensizliği', label: 'Leke & Renk Düzensizliği', icon: '☀️' },
  { id: 'İnce Çizgiler / Kırışıklık', label: 'Anti-Aging & Çizgi Bakımı', icon: '⌛' },
  { id: 'Nemsizlik', label: 'Derin Nemsizlik & Kuruluk', icon: '💧' },
  { id: 'Bariyer Hasarı', label: 'Cilt Bariyeri Onarımı', icon: '🛡️' }
];

const AGE_RANGES = [
  { id: '18 Altı', label: '18 Yaş Altı' },
  { id: '18-24', label: '18 - 24 Yaş' },
  { id: '25-34', label: '25 - 34 Yaş' },
  { id: '35-44', label: '35 - 44 Yaş' },
  { id: '45+', label: '45 Yaş Üstü' }
];

const SENSITIVITY_OPTIONS = [
  { id: 'Yok', label: 'Hassasiyet Yok', desc: 'Cildim yeni ürünlere kolayca uyum sağlar.' },
  { id: 'Hafif', label: 'Hafif Hassasiyet', desc: 'Bazen mevsim geçişlerinde veya güçlü asitlerde kızarabilir.' },
  { id: 'Yüksek', label: 'Yüksek Hassasiyet', desc: 'Cildim çok çabuk reaksiyon gösterir ve kızarır.' }
];

function SkinCareQuiz() {
  const navigate = useNavigate();

  // Step state: 1 -> Quiz, 2 -> Loading, 3 -> Result
  const [step, setStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1); // 1: SkinType, 2: Concerns, 3: AgeRange, 4: Sensitivity

  const [formData, setFormData] = useState({
    skinType: 'Karma',
    concerns: ['Gözenek', 'Siyah Nokta'],
    ageRange: '20-25',
    sensitivity: 'Yok'
  });

  // Result State
  const [recommendation, setRecommendation] = useState(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    "Velora dermatoloğu cilt profilinizi inceliyor...",
    "Cilt endişelerinize yönelik aktif içerikler analiz ediliyor...",
    "Stoktaki en etkili formüller eşleştiriliyor...",
    "Kişiselleştirilmiş lüks cilt bakım rutininiz oluşturuluyor..."
  ];

  // Sayfa yüklendiğinde hafızadaki son cilt analiz sonucunu geri yükle
  React.useEffect(() => {
    const saved = sessionStorage.getItem('velora_skincare_recommendation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.recommendation) {
          setFormData(parsed.formData || formData);
          setRecommendation(parsed.recommendation);
          setStep(3);
        }
      } catch (e) {
        console.error("Kaydedilmiş analiz yüklenemedi:", e);
      }
    }
  }, []);


  const handleSkinTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, skinType: type }));
  };

  const handleConcernToggle = (concern) => {
    setFormData((prev) => {
      const exists = prev.concerns.includes(concern);
      if (exists) {
        return { ...prev, concerns: prev.concerns.filter((c) => c !== concern) };
      } else {
        return { ...prev, concerns: [...prev.concerns, concern] };
      }
    });
  };

  const handleAgeSelect = (age) => {
    setFormData((prev) => ({ ...prev, ageRange: age }));
  };

  const handleSensitivitySelect = (sens) => {
    setFormData((prev) => ({ ...prev, sensitivity: sens }));
  };

  // Submit Handler
  const handleSubmitQuiz = async () => {
    if (!formData.skinType) {
      toast.warning('Lütfen cilt tipinizi seçin.');
      return;
    }
    if (formData.concerns.length === 0) {
      toast.warning('Lütfen en az bir cilt endişesi seçin.');
      return;
    }

    setStep(2); // Show Loading Screen
    setLoadingTextIndex(0);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);

    try {
      const response = await api.post('SkinCare/recommend', {
        skinType: formData.skinType,
        concerns: formData.concerns,
        ageRange: formData.ageRange,
        sensitivity: formData.sensitivity
      });

      clearInterval(messageInterval);
      setRecommendation(response.data);

      // Sonucu hafızaya kaydet ki geri tuşuyla dönünce analiz kaybolmasın
      sessionStorage.setItem('velora_skincare_recommendation', JSON.stringify({
        formData,
        recommendation: response.data
      }));

      setStep(3); // Show Result Screen
    } catch (error) {
      clearInterval(messageInterval);
      console.error('AI Analiz Hatası:', error);
      toast.error('Cilt analizi hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.');
      setStep(1);
    }
  };

  const handleRestart = () => {
    sessionStorage.removeItem('velora_skincare_recommendation');
    setStep(1);
    setCurrentQuestion(1);
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased flex flex-col selection:bg-gold-500/20 selection:text-gold-900">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto w-full">

          {/* ========================================================================= */}
          {/* STEP 1: INTERACTIVE QUIZ FORM */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="bg-white border border-charcoal-100 shadow-xl p-6 sm:p-10 md:p-12 relative overflow-hidden transition-all">
              
              {/* Header */}
              <div className="text-center max-w-xl mx-auto space-y-3 mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-2 bg-gold-50 px-3.5 py-1.5 rounded-full border border-gold-200/60 text-gold-800 text-[11px] tracking-[0.2em] uppercase font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>Velora AI Dermatolog Analizi</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl text-charcoal-900 font-light tracking-wide">
                  Cildinizin İhtiyacını Keşfedin
                </h1>
                <p className="text-charcoal-500 text-xs sm:text-sm font-light leading-relaxed">
                  Yapay zeka dermatoloğumuz, cilt tipiniz ve endişelerinize en uygun lüks bakım rutininizi birkaç adımda hazırlar.
                </p>
                <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-4" />
              </div>

              {/* Step Progress Indicator */}
              <div className="mb-10">
                <div className="flex justify-between text-[11px] tracking-widest uppercase font-semibold text-charcoal-400 mb-2">
                  <span>Adım {currentQuestion} / 4</span>
                  <span>
                    {currentQuestion === 1 && 'Cilt Tipi'}
                    {currentQuestion === 2 && 'Cilt Sorunları'}
                    {currentQuestion === 3 && 'Yaş Aralığı'}
                    {currentQuestion === 4 && 'Hassasiyet'}
                  </span>
                </div>
                <div className="w-full bg-charcoal-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-gold-600 to-gold-400 h-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentQuestion / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* QUESTION 1: SKIN TYPE */}
              {currentQuestion === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
                      1. Cilt tipinizi nasıl tanımlarsınız?
                    </h2>
                    <p className="text-xs text-charcoal-500 font-light">Lütfen size en yakın seçeneği işaretleyin.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SKIN_TYPES.map((type) => {
                      const isSelected = formData.skinType === type.id;
                      return (
                        <div
                          key={type.id}
                          onClick={() => handleSkinTypeSelect(type.id)}
                          className={`p-5 cursor-pointer border transition-all duration-300 relative group flex flex-col justify-between ${
                            isSelected
                              ? 'border-gold-500 bg-gold-50/40 shadow-sm ring-1 ring-gold-500'
                              : 'border-charcoal-100 hover:border-gold-300 hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`font-serif text-base sm:text-lg font-medium ${isSelected ? 'text-gold-900' : 'text-charcoal-900'}`}>
                              {type.label}
                            </span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-gold-500 border-gold-500 text-white' : 'border-charcoal-300 group-hover:border-gold-400'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-xs text-charcoal-500 font-light leading-relaxed">
                            {type.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION 2: CONCERNS */}
              {currentQuestion === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
                      2. Odaklanmak istediğiniz cilt sorunları nelerdir?
                    </h2>
                    <p className="text-xs text-charcoal-500 font-light">Birden fazla seçenek işaretleyebilirsiniz.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {CONCERNS_LIST.map((concern) => {
                      const isSelected = formData.concerns.includes(concern.id);
                      return (
                        <div
                          key={concern.id}
                          onClick={() => handleConcernToggle(concern.id)}
                          className={`p-4 cursor-pointer border transition-all duration-300 flex items-center justify-between ${
                            isSelected
                              ? 'border-gold-500 bg-gold-50/40 ring-1 ring-gold-500'
                              : 'border-charcoal-100 hover:border-gold-300 hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{concern.icon}</span>
                            <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-gold-900' : 'text-charcoal-800'}`}>
                              {concern.label}
                            </span>
                          </div>
                          <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-gold-500 border-gold-500 text-white' : 'border-charcoal-300'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION 3: AGE RANGE */}
              {currentQuestion === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
                      3. Yaş aralığınız nedir?
                    </h2>
                    <p className="text-xs text-charcoal-500 font-light">Yaşa özel hücresel yenilenme hızına göre içerik önerilir.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {AGE_RANGES.map((age) => {
                      const isSelected = formData.ageRange === age.id;
                      return (
                        <div
                          key={age.id}
                          onClick={() => handleAgeSelect(age.id)}
                          className={`p-5 text-center cursor-pointer border transition-all duration-300 ${
                            isSelected
                              ? 'border-gold-500 bg-gold-50/40 ring-1 ring-gold-500'
                              : 'border-charcoal-100 hover:border-gold-300 hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <span className={`font-serif text-lg font-medium block mb-1 ${isSelected ? 'text-gold-900' : 'text-charcoal-900'}`}>
                            {age.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION 4: SENSITIVITY */}
              {currentQuestion === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
                      4. Cildinizde hassasiyet veya reaksiyon var mı?
                    </h2>
                    <p className="text-xs text-charcoal-500 font-light">Asit ve aktif içerik oranlarını belirlememize yardımcı olur.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SENSITIVITY_OPTIONS.map((sens) => {
                      const isSelected = formData.sensitivity === sens.id;
                      return (
                        <div
                          key={sens.id}
                          onClick={() => handleSensitivitySelect(sens.id)}
                          className={`p-5 cursor-pointer border transition-all duration-300 flex flex-col justify-between ${
                            isSelected
                              ? 'border-gold-500 bg-gold-50/40 ring-1 ring-gold-500'
                              : 'border-charcoal-100 hover:border-gold-300 hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div>
                            <span className={`font-serif text-base font-medium block mb-2 ${isSelected ? 'text-gold-900' : 'text-charcoal-900'}`}>
                              {sens.label}
                            </span>
                            <p className="text-xs text-charcoal-500 font-light leading-relaxed">
                              {sens.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-10 border-t border-charcoal-100 mt-8">
                {currentQuestion > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestion((prev) => prev - 1)}
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-charcoal-600 hover:text-gold-600 transition-colors py-2 px-4 border border-charcoal-200 hover:border-gold-400"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Geri</span>
                  </button>
                ) : <div />}

                {currentQuestion < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-3.5 px-8 transition-all shadow-md hover:shadow-lg"
                  >
                    <span>İleri</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white text-xs tracking-[0.2em] font-semibold uppercase py-4 px-9 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analizi Tamamla</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: MODERN VELORA LOADER */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="bg-white border border-charcoal-100 shadow-2xl p-12 sm:p-20 text-center space-y-8 animate-in fade-in duration-500 min-h-[450px] flex flex-col items-center justify-center">
              
              {/* Pulsing Gold Ring & Sparkle Icon Loader */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-gold-200 animate-ping opacity-30" />
                <div className="absolute inset-0 rounded-full border-2 border-t-gold-500 border-r-gold-300 border-b-transparent border-l-transparent animate-spin duration-1000" />
                <div className="w-20 h-20 bg-gradient-to-br from-gold-50 to-gold-100 rounded-full flex items-center justify-center border border-gold-300/50 shadow-inner">
                  <Sparkles className="w-10 h-10 text-gold-600 animate-bounce" />
                </div>
              </div>

              {/* Loader Text & Subtext */}
              <div className="space-y-3 max-w-md mx-auto">
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light tracking-wide">
                  Velora Dermatoloğu
                </h3>
                <p className="text-gold-600 text-sm font-medium tracking-wider uppercase animate-pulse">
                  Rutininizi Hazırlıyor...
                </p>
                <div className="pt-2">
                  <p className="text-xs text-charcoal-400 font-light italic transition-all duration-300">
                    "{loadingMessages[loadingTextIndex]}"
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: RECOMMENDATION RESULT VIEW */}
          {/* ========================================================================= */}
          {step === 3 && recommendation && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

              {/* Title & Banner Header */}
              <div className="bg-white border border-gold-200/60 p-8 sm:p-12 shadow-xl text-center space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-100/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="inline-flex items-center gap-2 bg-gold-50 px-4 py-1.5 rounded-full border border-gold-200 text-gold-800 text-[11px] tracking-[0.2em] uppercase font-semibold">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Kişiselleştirilmiş Cilt Analiz Sonucu</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl text-charcoal-900 font-light tracking-wide leading-tight">
                  {recommendation.recommendationTitle}
                </h1>

                <div className="w-16 h-[1px] bg-gold-400 mx-auto my-3" />

                {/* User Profile Summary Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="text-[11px] bg-charcoal-50 text-charcoal-700 px-3 py-1 border border-charcoal-200 font-medium">
                    Cilt Tipi: <strong className="text-gold-700">{formData.skinType}</strong>
                  </span>
                  {formData.concerns.map((c) => (
                    <span key={c} className="text-[11px] bg-gold-50/70 text-gold-900 px-3 py-1 border border-gold-200/60 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* General Advice Card */}
              {recommendation.generalAdvice && (
                <div className="bg-gradient-to-r from-gold-50/60 via-white to-gold-50/30 border-l-4 border-gold-500 p-6 sm:p-8 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-gold-800 text-xs tracking-widest uppercase font-semibold">
                    <Info className="w-4 h-4 text-gold-600" />
                    <span>Dermatolog Uzman Tavsiyesi</span>
                  </div>
                  <p className="text-charcoal-700 text-sm sm:text-base font-light leading-relaxed italic">
                    "{recommendation.generalAdvice}"
                  </p>
                </div>
              )}

              {/* Recommended Products Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-charcoal-200 pb-3">
                  <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-light tracking-wide flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold-500" />
                    <span>Önerilen Rutin Ürünleri</span>
                  </h2>
                  <span className="text-xs text-charcoal-500 font-light">
                    {recommendation.recommendedProducts?.length || 0} Özel Seçim
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {recommendation.recommendedProducts?.map((product, idx) => (
                    <div
                      key={product.productId || idx}
                      className="bg-white border border-charcoal-100 hover:border-gold-400 p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
                    >
                      {/* Product Number Badge */}
                      <div className="absolute top-4 right-4 bg-gold-100 text-gold-800 text-[10px] font-bold tracking-widest w-7 h-7 rounded-full flex items-center justify-center border border-gold-300">
                        #{idx + 1}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] tracking-[0.2em] text-gold-600 uppercase font-semibold block">
                            Velora Dermatoloji Seçimi
                          </span>
                          <h3 className="font-serif text-lg text-charcoal-900 font-medium group-hover:text-gold-600 transition-colors line-clamp-2">
                            {product.productName}
                          </h3>
                        </div>

                        <div className="bg-[#FAF8F5] p-3.5 border border-charcoal-100 text-xs text-charcoal-600 font-light leading-relaxed space-y-1">
                          <span className="text-[10px] tracking-wider uppercase font-semibold text-charcoal-400 block">
                            Neden Önerildi?
                          </span>
                          <p>{product.reasonForRecommendation}</p>
                        </div>
                      </div>

                      {/* Product Detail Action Link */}
                      <div className="pt-6 mt-4 border-t border-charcoal-100">
                        <Link
                          to={`/product/${product.productId}`}
                          state={{ fromQuiz: true }}
                          className="w-full bg-charcoal-900 hover:bg-gold-600 text-white text-xs tracking-[0.15em] font-medium uppercase py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-md"
                        >
                          <span>Ürünü İncele</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Retake Quiz */}
              <div className="pt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gold-50 text-charcoal-900 text-xs tracking-[0.2em] font-medium uppercase py-4 px-8 border border-charcoal-300 hover:border-gold-500 transition-all shadow-sm"
                >
                  <RotateCcw className="w-4 h-4 text-gold-600" />
                  <span>Yeniden Analiz Yap</span>
                </button>
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs tracking-[0.2em] font-medium uppercase py-4 px-8 transition-all shadow-md"
                >
                  <span>Tüm Ürünleri İncele</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-charcoal-950 text-charcoal-300 py-8 border-t border-charcoal-800 text-center text-xs text-charcoal-500 font-light">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 VELORA Luxury Cosmetics. AI Dermatolog Tavsiyeleri Bilgilendirme Amaçlıdır.</p>
        </div>
      </footer>
    </div>
  );
}

export default SkinCareQuiz;
