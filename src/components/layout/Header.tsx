'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FiMenu, FiX, FiGlobe, FiUser, FiLogIn, FiSearch } from 'react-icons/fi';

export default function Header() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/blog', label: 'Blog' },
    { href: '/pricing', label: 'Fiyatlandırma' },
    { href: '/references', label: 'Referanslar' },
    { href: '/instructors', label: 'Eğitmenler' },
    { href: '/languages', label: 'Dil Seçenekleri' },
    { href: '/enterprise', label: 'Kurumsal' },
    { href: '/faq', label: 'SSS' },
    { href: '/help', label: 'Yardım' },
    { href: '/contact', label: 'İletişim' },
  ];

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">SpeakNest</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-600 hover:text-green-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
              >
                <FiGlobe className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  {languages.find(lang => lang.code === currentLanguage)?.name}
                </span>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors ${
                        currentLanguage === lang.code ? 'text-green-600 font-medium' : 'text-slate-600'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex space-x-3">
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Giriş Yap</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-2 px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 transition-colors"
              >
                <FiUser className="w-5 h-5" />
                <span>Kayıt Ol</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-slate-600" />
              ) : (
                <FiMenu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
              </div>

              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 mt-2 rounded-md text-base font-medium text-green-600 border border-green-600 hover:bg-green-50 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 