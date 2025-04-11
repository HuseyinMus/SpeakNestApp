'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { FiMenu, FiX, FiGlobe, FiUser, FiLogIn, FiSearch } from 'react-icons/fi';
import { useLanguage } from '@/lib/context/LanguageContext';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const menuItems = [
    { href: '/about', label: 'Hakkımızda' },
    { href: '/pricing', label: 'Fiyatlandırma' },
    { href: '/faq', label: 'SSS' },
    { href: '/contact', label: 'İletişim' },
  ];

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const navigateToUserPanel = (profile: any) => {
    if (profile?.role === 'admin') {
      router.push('/dashboard');
    } else if (profile?.role === 'teacher') {
      router.push('/teacher-panel');
    } else if (profile?.role === 'proUser') {
      router.push('/prouser-panel');
    } else if (profile?.role === 'editor') {
      router.push('/editor-panel');
    } else {
      router.push('/student-panel');
    }
  };

  const renderProfileButton = () => {
    if (userProfile) {
      let buttonText = "";
      
      if (userProfile.role === 'admin') {
        buttonText = "Admin Paneli";
      } else if (userProfile.role === 'teacher') {
        buttonText = "Öğretmen Paneli";
      } else if (userProfile.role === 'proUser') {
        buttonText = "Konuşma Sunucusu Paneli";
      } else if (userProfile.role === 'editor') {
        buttonText = "Editör Paneli";
      } else {
        buttonText = "Öğrenci Paneli";
      }
      
      return (
        <button 
          onClick={() => navigateToUserPanel(userProfile)} 
          className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition-colors"
        >
          {buttonText}
        </button>
      );
    } else {
      return (
        <>
          <Link
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-100 text-green-700 border border-green-700 rounded-md px-4 py-2 transition-colors ml-3"
          >
            Kayıt Ol
          </Link>
        </>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">SpeakNest</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-600 hover:text-green-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Auth Buttons */}
              <div className="hidden md:flex space-x-3">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      Merhaba, {userProfile?.displayName || userProfile?.firstName || user.displayName || 'Kullanıcı'}
                    </span>
                    {renderProfileButton()}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  renderProfileButton()
                )}
              </div>

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
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-sm text-slate-600">
                        Merhaba, {userProfile?.displayName || userProfile?.firstName || user.displayName || 'Kullanıcı'}
                      </div>
                      {renderProfileButton()}
                      <button
                        onClick={handleLogout}
                        className="block w-full px-3 py-2 mt-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </>
                  ) : (
                    renderProfileButton()
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                SpeakNest ile İngilizce Konuşmayı Öğrenin
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Profesyonel eğitmenlerle birebir konuşma pratiği yaparak İngilizce konuşma becerilerinizi hızla geliştirin. Her seviyeye uygun dersler ve esnek program.
              </p>
              
              {user ? (
                <button
                  onClick={() => navigateToUserPanel(userProfile)}
                  className="px-6 py-3 bg-white text-green-700 rounded-lg shadow hover:bg-green-50 transition-colors text-lg"
                >
                  Derslerime Git
                </button>
              ) : (
                <Link
                  href="/register"
                  className="px-6 py-3 bg-white text-green-700 rounded-lg shadow hover:bg-green-50 transition-colors text-lg"
                >
                  Ücretsiz Deneme Dersi Al
                </Link>
              )}
            </div>
            
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
                <h2 className="text-2xl font-semibold mb-4">SpeakNest Avantajları</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Anadili İngilizce Olan Eğitmenler</h3>
                      <p className="text-white/80">Gerçek hayatta kullanılan güncel İngilizce ile pratik yapma imkanı</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Esnek Program</h3>
                      <p className="text-white/80">Size uygun saatlerde, istediğiniz yerde online dersler</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Kişiselleştirilmiş Eğitim</h3>
                      <p className="text-white/80">Seviyenize ve hedeflerinize özel hazırlanan ders içerikleri</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Categories */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Eğitim Paketlerimiz</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow overflow-hidden transform transition-transform hover:scale-105">
              <div className="h-48 bg-yellow-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Başlangıç Paketi</h3>
                <p className="text-gray-600 mb-4">Temel İngilizce konuşma becerileri, günlük konuşmalar ve pratik dersler</p>
                <Link href="/courses?category=beginner" className="text-green-600 hover:underline font-medium">
                  Detaylı Bilgi →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-green-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Orta Seviye Paketi</h3>
                <p className="text-gray-600 mb-4">İş İngilizcesi, akademik İngilizce ve ileri seviye konuşma pratikleri</p>
                <Link href="/courses?category=intermediate" className="text-green-600 hover:underline font-medium">
                  Detaylı Bilgi →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-purple-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">İleri Seviye Paketi</h3>
                <p className="text-gray-600 mb-4">Akıcı konuşma, profesyonel sunumlar ve uzmanlık alanı İngilizcesi</p>
                <Link href="/courses?category=advanced" className="text-green-600 hover:underline font-medium">
                  Detaylı Bilgi →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Hemen Öğrenmeye Başlayın</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Kariyerinizde ilerlemeniz için ihtiyaç duyduğunuz tüm eğitimler bir tık uzağınızda. 
            Sınırsız erişim ve güncel içeriklerle hemen öğrenmeye başlayın.
          </p>
          
          {user ? (
            <button
              onClick={() => navigateToUserPanel(userProfile)}
              className="px-8 py-4 bg-white text-green-700 rounded-lg shadow hover:bg-green-50 transition-colors text-lg font-medium"
            >
              Derslerime Git
            </button>
          ) : (
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-green-700 rounded-lg shadow hover:bg-green-50 transition-colors text-lg font-medium"
            >
              Şimdi Kaydol
            </Link>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
