'use client';

import { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Temel',
      price: {
        monthly: '₺199',
        yearly: '₺1,990',
      },
      description: 'Bireysel kullanıcılar için ideal başlangıç paketi',
      features: [
        'Temel dil kursları',
        'Sınırlı pratik yapma',
        'Temel gramer dersleri',
        'E-posta desteği',
        'Haftalık ilerleme raporu',
      ],
      excluded: [
        'Özel dersler',
        'Gelişmiş analitikler',
        'Sertifika',
        'Öncelikli destek',
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: {
        monthly: '₺399',
        yearly: '₺3,990',
      },
      description: 'Hızlı ilerleme isteyen kullanıcılar için',
      features: [
        'Tüm dil kursları',
        'Sınırsız pratik yapma',
        'Gelişmiş gramer dersleri',
        'Özel dersler (2 saat/ay)',
        'Günlük ilerleme raporu',
        'Sertifika',
        'Öncelikli destek',
      ],
      excluded: [],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Kurumsal',
      price: {
        monthly: 'Özel',
        yearly: 'Özel',
      },
      description: 'Kurumlar için özel çözümler',
      features: [
        'Tüm premium özellikler',
        'Sınırsız özel dersler',
        'Kurumsal raporlama',
        'API erişimi',
        'Özel içerik yönetimi',
        '7/24 öncelikli destek',
        'Özel eğitmen ataması',
      ],
      excluded: [],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Fiyatlandırma Planları
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            İhtiyaçlarınıza uygun planı seçin ve dil öğrenme yolculuğunuza başlayın.
          </p>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Yıllık (2 Ay Ücretsiz)
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-1">
                  En Popüler
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] !== 'Özel' && (
                    <span className="text-slate-500">/{billingCycle === 'monthly' ? 'ay' : 'yıl'}</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                  {plan.excluded.map((feature) => (
                    <li key={feature} className="flex items-start text-slate-400">
                      <FiX className="w-5 h-5 mt-1 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.id === 'enterprise' ? 'İletişime Geçin' : 'Hemen Başlayın'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Sıkça Sorulan Sorular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Ödeme yöntemleri nelerdir?
              </h3>
              <p className="text-slate-600">
                Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                İptal politikası nedir?
              </h3>
              <p className="text-slate-600">
                Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal işlemi sonraki dönemden geçerli olur.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Ücretsiz deneme süresi var mı?
              </h3>
              <p className="text-slate-600">
                Evet, tüm planlarda 7 gün ücretsiz deneme süresi sunuyoruz.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Kurumsal plan için nasıl iletişime geçebilirim?
              </h3>
              <p className="text-slate-600">
                İletişim sayfamızdan veya doğrudan bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 