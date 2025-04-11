'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiUsers, FiGlobe, FiAward, FiBook, FiTarget, FiHeart, FiGlobe as FiGlobeIcon } from 'react-icons/fi';

export default function AboutPage() {
  const { t, setLanguage, currentLanguage } = useLanguage();

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  const features = [
    {
      icon: <FiUsers className="w-8 h-8 text-blue-600" />,
      title: 'Uzman Ekip',
      description: 'Alanında uzman eğitmenler ve geliştiricilerden oluşan profesyonel ekibimiz.',
    },
    {
      icon: <FiGlobe className="w-8 h-8 text-blue-600" />,
      title: 'Küresel Erişim',
      description: 'Dünya çapında binlerce kullanıcıya ulaşan yenilikçi platformumuz.',
    },
    {
      icon: <FiAward className="w-8 h-8 text-blue-600" />,
      title: 'Kaliteli İçerik',
      description: 'En güncel ve etkili dil öğrenme metodolojileriyle hazırlanan içerikler.',
    },
  ];

  const stats = [
    {
      number: '50,000+',
      label: t('activeUsers', 'Aktif Kullanıcı'),
      icon: <FiUsers className="w-6 h-6 text-blue-600" />,
    },
    {
      number: '25+',
      label: t('languages', 'Dil Seçeneği'),
      icon: <FiGlobe className="w-6 h-6 text-blue-600" />,
    },
    {
      number: '500+',
      label: t('lessons', 'Ders İçeriği'),
      icon: <FiBook className="w-6 h-6 text-blue-600" />,
    },
  ];

  const teamMembers = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop',
    },
    {
      name: 'Ayşe Demir',
      role: 'Dil Eğitmeni',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop',
    },
    {
      name: 'Mehmet Kaya',
      role: 'Yazılım Geliştirici',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    },
    {
      name: 'Zeynep Şahin',
      role: 'İçerik Yöneticisi',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=500&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative group">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <FiGlobeIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              {languages.find(lang => lang.code === currentLanguage)?.name}
            </span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors duration-200 ${
                  currentLanguage === lang.code ? 'text-blue-600 font-medium' : 'text-slate-600'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[90vh] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Dil Öğrenme Yolculuğunuzda Yanınızdayız
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">
                SpeakNest, dil öğrenmeyi kolaylaştıran ve eğlenceli hale getiren bir platformdur. Modern teknolojiler ve uzman eğitmenlerle dil öğrenme deneyiminizi bir üst seviyeye taşıyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Bize Ulaşın
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-lg font-medium rounded-full text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  Kursları Keşfet
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Uzman Ekip</h3>
                    <p className="text-slate-300">Alanında uzman eğitmenler ve geliştiriciler</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <FiGlobe className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Küresel Erişim</h3>
                    <p className="text-slate-300">Dünya çapında binlerce kullanıcı</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <FiAward className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Kaliteli İçerik</h3>
                    <p className="text-slate-300">En güncel ve etkili öğrenme metodolojileri</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Stats Section */}
      <div className="relative -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6 mx-auto">
                  {stat.icon}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-slate-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Misyonumuz
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Herkesin dil öğrenme hakkına sahip olduğuna inanıyoruz. Teknolojiyi kullanarak, dil öğrenme sürecini daha erişilebilir, etkili ve eğlenceli hale getirmeyi hedefliyoruz. Amacımız, dünya çapında milyonlarca insanın yeni diller öğrenmesine ve kültürler arası iletişim kurmasına yardımcı olmak.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiTarget className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Vizyonumuz
                  </h3>
                  <p className="text-slate-600">
                    Dünya çapında dil öğrenmeyi dönüştüren lider platform olmak. 2025 yılına kadar 1 milyon aktif kullanıcıya ulaşarak, dil öğrenme sürecini tamamen yeniden tanımlamayı hedefliyoruz.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiHeart className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Değerlerimiz
                  </h3>
                  <p className="text-slate-600">
                    Kalite, erişilebilirlik ve sürekli gelişim. Her kullanıcımızın başarısı bizim başarımızdır. Yenilikçi çözümler üretmek ve kullanıcı deneyimini sürekli iyileştirmek için çalışıyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
              alt={t('missionImageAlt', 'Ekip Çalışması')}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              SpeakNest ile dil öğrenme deneyiminizi bir üst seviyeye taşıyın. Yapay zeka destekli öğrenme sistemimiz, kişiselleştirilmiş ders planları ve interaktif alıştırmalar ile dil öğrenme sürecinizi hızlandırıyor, eğlenceli ve etkili hale getiriyoruz.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Ekibimiz
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Deneyimli dil eğitmenleri, yazılım geliştiricileri ve tasarımcılardan oluşan ekibimiz. Her biri kendi alanında uzman olan ekip üyelerimiz, sizin dil öğrenme yolculuğunuzda en iyi deneyimi yaşamanız için çalışıyor.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-slate-600">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 