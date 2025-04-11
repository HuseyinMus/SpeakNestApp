'use client';

import { useState } from 'react';
import { FiSearch, FiCalendar, FiUser, FiTag, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';

export default function BlogPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tüm Yazılar' },
    { id: 'tips', name: 'Dil Öğrenme İpuçları' },
    { id: 'culture', name: 'Kültürel İçerikler' },
    { id: 'success', name: 'Başarı Hikayeleri' },
    { id: 'resources', name: 'Kaynaklar' },
  ];

  const blogPosts = [
    {
      id: 1,
      category: 'tips',
      title: 'Dil Öğrenmenin 10 Altın Kuralı',
      excerpt: 'Dil öğrenme sürecinizi hızlandıracak ve daha etkili hale getirecek 10 önemli ipucu.',
      author: 'Ahmet Yılmaz',
      date: '15 Mart 2024',
      readTime: '5 dk',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=800&h=600&fit=crop',
    },
    {
      id: 2,
      category: 'culture',
      title: 'İngiliz Kültürünü Anlamak',
      excerpt: 'İngiliz kültürünün dil öğrenme sürecinize nasıl katkı sağlayacağını keşfedin.',
      author: 'Ayşe Demir',
      date: '12 Mart 2024',
      readTime: '7 dk',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=800&h=600&fit=crop',
    },
    {
      id: 3,
      category: 'success',
      title: '3 Ayda İngilizce Öğrenen Öğrencimiz',
      excerpt: 'SpeakNest ile 3 ayda İngilizce öğrenen öğrencimizin başarı hikayesi.',
      author: 'Mehmet Kaya',
      date: '10 Mart 2024',
      readTime: '6 dk',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=800&h=600&fit=crop',
    },
    {
      id: 4,
      category: 'resources',
      title: 'En İyi Dil Öğrenme Kaynakları',
      excerpt: 'Dil öğrenme sürecinize katkı sağlayacak en iyi online kaynaklar.',
      author: 'Zeynep Aydın',
      date: '8 Mart 2024',
      readTime: '8 dk',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=800&h=600&fit=crop',
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
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
            Blog
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Dil öğrenme yolculuğunuzda size rehberlik edecek içerikler.
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
                placeholder="Blog yazılarında arama yapın..."
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

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  Devamını Oku
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Blog Bültenimize Abone Olun
            </h2>
            <p className="text-white/80 mb-6">
              En yeni blog yazılarımızdan ve dil öğrenme ipuçlarından haberdar olun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-all duration-300">
                Abone Ol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 