'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { useState } from 'react';

export default function Footer() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const footerLinks = [
    {
      title: 'Şirket',
      links: [
        { href: '/about', label: 'Hakkımızda' },
        { href: '/blog', label: 'Blog' },
        { href: '/references', label: 'Referanslar' },
        { href: '/contact', label: 'İletişim' },
      ],
    },
    {
      title: 'Hizmetler',
      links: [
        { href: '/languages', label: 'Dil Seçenekleri' },
        { href: '/instructors', label: 'Eğitmenler' },
        { href: '/pricing', label: 'Fiyatlandırma' },
        { href: '/enterprise', label: 'Kurumsal' },
      ],
    },
    {
      title: 'Destek',
      links: [
        { href: '/help', label: 'Yardım Merkezi' },
        { href: '/faq', label: 'SSS' },
        { href: '/privacy', label: 'Gizlilik Politikası' },
        { href: '/terms', label: 'Kullanım Koşulları' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FiFacebook />, href: 'https://facebook.com/speaknest' },
    { icon: <FiTwitter />, href: 'https://twitter.com/speaknest' },
    { icon: <FiInstagram />, href: 'https://instagram.com/speaknest' },
    { icon: <FiLinkedin />, href: 'https://linkedin.com/company/speaknest' },
  ];

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* İletişim Bilgileri */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">SpeakNest</h3>
            <p className="text-gray-400 mb-4">
              Profesyonel eğitmenlerle birebir İngilizce konuşma pratiği yaparak dil becerilerinizi geliştirin.
            </p>
            {/* Language Selector */}
            <div className="relative inline-block">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <FiGlobe className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">
                  {languages.find(lang => lang.code === currentLanguage)?.name}
                </span>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                        currentLanguage === lang.code ? 'text-green-400 font-medium' : 'text-gray-300'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Menü Linkleri */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <FiGlobe className="w-6 h-6 text-blue-400" />
              <p className="text-slate-400">
                &copy; {new Date().getFullYear()} SpeakNest. Tüm hakları saklıdır.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 