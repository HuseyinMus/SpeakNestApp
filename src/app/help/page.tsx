'use client';

import { useState } from 'react';
import { FiSearch, FiBook, FiMessageSquare, FiVideo, FiHeadphones, FiMail } from 'react-icons/fi';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function HelpPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tüm Kategoriler' },
    { id: 'getting-started', name: 'Başlangıç' },
    { id: 'account', name: 'Hesap' },
    { id: 'billing', name: 'Faturalandırma' },
    { id: 'technical', name: 'Teknik Destek' },
  ];

  const helpItems = [
    {
      id: 1,
      category: 'getting-started',
      title: 'SpeakNest\'e Nasıl Başlarım?',
      description: 'SpeakNest\'e başlamak için adım adım rehberimizi takip edin.',
      icon: <FiBook className="w-6 h-6" />,
    },
    {
      id: 2,
      category: 'account',
      title: 'Hesabımı Nasıl Yönetirim?',
      description: 'Hesap ayarlarınızı ve profil bilgilerinizi nasıl düzenleyeceğinizi öğrenin.',
      icon: <FiMessageSquare className="w-6 h-6" />,
    },
    {
      id: 3,
      category: 'billing',
      title: 'Faturalandırma ve Ödemeler',
      description: 'Faturalandırma süreçleri ve ödeme seçenekleri hakkında bilgi alın.',
      icon: <FiVideo className="w-6 h-6" />,
    },
    {
      id: 4,
      category: 'technical',
      title: 'Teknik Sorunları Çözme',
      description: 'Sık karşılaşılan teknik sorunlar ve çözümleri.',
      icon: <FiHeadphones className="w-6 h-6" />,
    },
  ];

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Yardım Merkezi
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            SpeakNest kullanımı hakkında tüm sorularınızın cevapları burada.
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
                placeholder="Yardım konularında arama yapın..."
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

      {/* Help Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Hala Yardıma İhtiyacınız Var mı?
            </h2>
            <p className="text-white/80 mb-6">
              Ekibimiz size yardımcı olmaktan mutluluk duyacaktır. Bize ulaşın, en kısa sürede size dönüş yapalım.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@speaknest.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <FiMail className="w-5 h-5" />
                E-posta Gönder
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-all duration-300"
              >
                İletişim Formu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 