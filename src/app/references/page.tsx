'use client';

import { useState } from 'react';
import { FiStar, FiFilter, FiSearch } from 'react-icons/fi';
import Image from 'next/image';

export default function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tüm Referanslar' },
    { id: 'education', name: 'Eğitim Kurumları' },
    { id: 'corporate', name: 'Kurumsal Firmalar' },
    { id: 'government', name: 'Kamu Kurumları' },
  ];

  const references = [
    {
      id: 1,
      name: 'ABC Üniversitesi',
      category: 'education',
      logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop',
      description: 'Üniversitemizde öğrencilerimizin dil eğitiminde kullandığımız SpeakNest platformu, öğrenme süreçlerini önemli ölçüde geliştirdi.',
      rating: 5,
      testimonial: 'SpeakNest ile öğrencilerimizin dil öğrenme motivasyonu ve başarısı artış gösterdi.',
      author: 'Prof. Dr. Ahmet Yılmaz',
      position: 'Dil Eğitimi Bölüm Başkanı',
    },
    {
      id: 2,
      name: 'XYZ Teknoloji',
      category: 'corporate',
      logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=500&fit=crop',
      description: 'Çalışanlarımızın yabancı dil eğitiminde SpeakNest platformunu kullanıyoruz. Sonuçlar oldukça başarılı.',
      rating: 5,
      testimonial: 'SpeakNest sayesinde çalışanlarımızın dil becerileri hızla gelişti ve uluslararası projelerde daha etkin rol alabildiler.',
      author: 'Ayşe Demir',
      position: 'İK Direktörü',
    },
    {
      id: 3,
      name: '123 Belediyesi',
      category: 'government',
      logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&h=500&fit=crop',
      description: 'Belediyemiz personelinin yabancı dil eğitimi için SpeakNest platformunu tercih ettik.',
      rating: 4,
      testimonial: 'SpeakNest ile personelimizin dil eğitimi süreci daha verimli ve etkili hale geldi.',
      author: 'Mehmet Kaya',
      position: 'Belediye Başkanı',
    },
  ];

  const filteredReferences = references.filter((ref) => {
    const matchesSearch = ref.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ref.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Referanslarımız
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            SpeakNest platformunu tercih eden kurumların başarı hikayeleri ve deneyimleri.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Referans ara..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReferences.map((ref) => (
            <div
              key={ref.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={ref.logo}
                      alt={ref.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < ref.rating ? 'text-yellow-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {ref.name}
                </h3>
                <p className="text-slate-600 mb-4">{ref.description}</p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700 italic mb-2">"{ref.testimonial}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900">{ref.author}</p>
                      <p className="text-sm text-slate-500">{ref.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReferences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">
              Aradığınız kriterlere uygun referans bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 