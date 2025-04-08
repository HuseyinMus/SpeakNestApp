'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUser(user);
          await fetchUserProfile(user.uid);
        }
        setLoading(false);
      });
      
      return () => unsubscribe();
    };
    
    checkAuth();
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (err) {
      console.error('Kullanıcı bilgileri alınamadı:', err);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Çıkış yapılamadı:', err);
    }
  };
  
  const navigateToUserPanel = (userProfile) => {
    if (userProfile.role === 'admin') {
      router.push('/dashboard');
    } else if (userProfile.role === 'teacher') {
      router.push('/teacher-panel');
    } else if (userProfile.role === 'proUser') {
      router.push('/prouser-panel');
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
      } else {
        buttonText = "Öğrenci Paneli";
      }
      
      return (
        <button 
          onClick={() => navigateToUserPanel(userProfile)} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors"
        >
          {buttonText}
        </button>
      );
    } else {
      return (
        <>
          <button 
            onClick={() => router.push('/login')} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors"
          >
            Giriş Yap
          </button>
          <button 
            onClick={() => router.push('/register')} 
            className="bg-white hover:bg-gray-100 text-blue-700 border border-blue-700 rounded-md px-4 py-2 transition-colors ml-3"
          >
            Kayıt Ol
          </button>
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Eğitim Platformu</h1>
            <div className="space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    Merhaba, {userProfile?.displayName || userProfile?.firstName || user.displayName || 'Kullanıcı'}
                  </span>
                  {renderProfileButton()}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  {renderProfileButton()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Geleceği Şekillendiren Eğitim
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Kariyerinizi bir sonraki seviyeye taşıyacak eğitim içeriklerine şimdi ulaşın. Kendi hızınızda öğrenin, becerilerinizi geliştirin.
            </p>
            
            {user ? (
              <button
                onClick={() => navigateToUserPanel(userProfile)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-lg"
              >
                Derslerime Git
              </button>
            ) : (
              <Link
                href="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-lg"
              >
                Hemen Başla
              </Link>
            )}
          </div>
          
          <div className="md:w-1/2 md:pl-10">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Neden Bizi Seçmelisiniz?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full text-blue-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Kaliteli İçerik</h3>
                    <p className="text-gray-600">Uzman eğitmenler tarafından hazırlanan güncel ve kapsamlı eğitim içerikleri</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full text-blue-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Hızlı İlerleme</h3>
                    <p className="text-gray-600">Kendi hızınızda öğrenin, pratik yapın ve hızla ilerleme kaydedin</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full text-blue-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Topluluk Desteği</h3>
                    <p className="text-gray-600">Diğer öğrenciler ve eğitmenlerle etkileşime geçin, sorularınızı sorun</p>
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
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Eğitim Kategorileri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-blue-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Yazılım Geliştirme</h3>
                <p className="text-gray-600 mb-4">Web geliştirme, mobil uygulama geliştirme, veritabanı yönetimi ve daha fazlası</p>
                <Link href="/courses?category=software" className="text-blue-600 hover:underline font-medium">
                  Kurslara Göz At →
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
                <h3 className="text-xl font-bold mb-2 text-gray-800">Veri Bilimi</h3>
                <p className="text-gray-600 mb-4">Veri analizi, makine öğrenmesi, yapay zeka ve veri görselleştirme</p>
                <Link href="/courses?category=data-science" className="text-blue-600 hover:underline font-medium">
                  Kurslara Göz At →
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
                <h3 className="text-xl font-bold mb-2 text-gray-800">Tasarım</h3>
                <p className="text-gray-600 mb-4">Web tasarımı, UI/UX tasarımı, grafik tasarım ve 3D modelleme</p>
                <Link href="/courses?category=design" className="text-blue-600 hover:underline font-medium">
                  Kurslara Göz At →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Hemen Öğrenmeye Başlayın</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Kariyerinizde ilerlemeniz için ihtiyaç duyduğunuz tüm eğitimler bir tık uzağınızda. 
            Sınırsız erişim ve güncel içeriklerle hemen öğrenmeye başlayın.
          </p>
          
          {user ? (
            <button
              onClick={() => navigateToUserPanel(userProfile)}
              className="px-8 py-4 bg-white text-blue-700 rounded-lg shadow hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Derslerime Git
            </button>
          ) : (
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-700 rounded-lg shadow hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Şimdi Kaydol
            </Link>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-semibold">Eğitim Platformu</h2>
              <p className="mt-2 text-gray-400">© 2023 Tüm Hakları Saklıdır</p>
            </div>
            
            <div className="flex space-x-8">
              <div>
                <h3 className="font-semibold mb-3">Hakkımızda</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-400 hover:text-white">Biz Kimiz</Link></li>
                  <li><Link href="/teachers" className="text-gray-400 hover:text-white">Eğitmenlerimiz</Link></li>
                  <li><Link href="/career" className="text-gray-400 hover:text-white">Kariyer</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Destek</h3>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="text-gray-400 hover:text-white">İletişim</Link></li>
                  <li><Link href="/faq" className="text-gray-400 hover:text-white">SSS</Link></li>
                  <li><Link href="/help" className="text-gray-400 hover:text-white">Yardım Merkezi</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
