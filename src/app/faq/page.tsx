'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FiSearch, FiChevronDown, FiChevronUp, FiMessageSquare, FiMail, FiGlobe } from 'react-icons/fi';
import Link from 'next/link';

export default function FAQPage() {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  const categories = [
    { id: 'all', name: 'Tüm Sorular' },
    { id: 'account', name: 'Hesap' },
    { id: 'payment', name: 'Ödeme' },
    { id: 'courses', name: 'Kurslar' },
    { id: 'technical', name: 'Teknik' },
  ];

  const faqs = [
    {
      id: 1,
      question: 'SpeakNest nedir?',
      answer: 'SpeakNest, dil öğrenmeyi kolaylaştıran ve eğlenceli hale getiren bir platformdur. Modern teknolojiler ve uzman eğitmenlerle dil öğrenme deneyiminizi bir üst seviyeye taşıyoruz.',
      category: 'account',
    },
    {
      id: 2,
      question: 'Nasıl üye olabilirim?',
      answer: 'Ana sayfadaki "Üye Ol" butonuna tıklayarak veya doğrudan kayıt sayfasına giderek üyelik işleminizi tamamlayabilirsiniz. E-posta adresiniz ve şifrenizle kolayca kayıt olabilirsiniz.',
      category: 'account',
    },
    {
      id: 3,
      question: 'Ödeme seçenekleri nelerdir?',
      answer: 'Kredi kartı, banka kartı ve havale/EFT seçenekleriyle ödeme yapabilirsiniz. Tüm ödemeleriniz güvenli ödeme altyapımız üzerinden işlenmektedir.',
      category: 'payment',
    },
    {
      id: 4,
      question: 'Kurslar nasıl işliyor?',
      answer: 'Kurslarımız video dersler, interaktif alıştırmalar ve canlı derslerden oluşmaktadır. Kendi hızınızda öğrenme imkanı sunuyoruz.',
      category: 'courses',
    },
    {
      id: 5,
      question: 'Teknik destek nasıl alabilirim?',
      answer: '7/24 teknik destek hattımızdan veya e-posta yoluyla bize ulaşabilirsiniz. Sorunlarınızı en kısa sürede çözüme kavuşturuyoruz.',
      category: 'technical',
    },
  ];

  const toggleItem = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    // Burada dil değişikliği için gerekli işlemleri yapabilirsiniz
    // Örneğin: localStorage.setItem('language', code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative group">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <FiGlobe className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              {languages.find(lang => lang.code === selectedLanguage)?.name}
            </span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors duration-200 ${
                  selectedLanguage === lang.code ? 'text-blue-600 font-medium' : 'text-slate-600'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-slate-900 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            SpeakNest hakkında merak ettiğiniz tüm soruların cevapları burada.
          </p>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Sorularınızı arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid gap-6">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {faq.question}
                </h3>
                {expandedItems.includes(faq.id) ? (
                  <FiChevronUp className="w-6 h-6 text-slate-400" />
                ) : (
                  <FiChevronDown className="w-6 h-6 text-slate-400" />
                )}
              </button>
              {expandedItems.includes(faq.id) && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Cevabını Bulamadın mı?
            </h2>
            <p className="text-lg mb-8">
              Sorularınız için bize ulaşın. En kısa sürede size yardımcı olacağız.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@speaknest.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <FiMail className="mr-2" />
                E-posta Gönder
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-slate-100 transition-all duration-300"
              >
                <FiMessageSquare className="mr-2" />
                İletişim Formu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 