'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Menu, X, Save, FileText, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useToast } from '@/lib/context/ToastContext';
import RichTextEditor from '@/components/editor/RichTextEditor';
import MediaUploader from '@/components/editor/MediaUploader';
import CategorySelector from '@/components/editor/CategorySelector';
import DocumentWorkflow from '@/components/editor/DocumentWorkflow';

interface UserProfile {
  displayName?: string;
  email?: string;
  role?: string;
  uid?: string;
}

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  categories: string[];
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  status: 'draft' | 'review' | 'published' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
}

export default function EditorPanel() {
  const { t } = useLanguage();
  const router = useRouter();
  const { success, error } = useToast();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  
  // Blog yazısı durumları
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    categories: [],
    tags: [],
    author: {
      name: '',
    },
    status: 'draft',
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          await fetchUserProfile(currentUser.uid);
          setPost(prev => ({
            ...prev,
            author: {
              name: currentUser.displayName || currentUser.email || '',
              avatar: currentUser.photoURL,
            },
          }));
        } else {
          router.push('/login');
        }
        setLoading(false);
      });
      
      return () => unsubscribe();
    };
    
    checkAuth();
  }, [router]);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        error(t('userProfileNotFound', 'Kullanıcı profili bulunamadı.'));
        router.push('/login');
      }
    } catch (err) {
      console.error('Kullanıcı bilgileri alınamadı:', err);
      error(t('profileDataError', 'Profil bilgileri alınırken bir hata oluştu.'));
    }
  };
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Çıkış yapılırken hata:', err);
      error(t('logoutError', 'Çıkış yapılırken bir hata oluştu.'));
    }
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const postData = {
        ...post,
        categories: selectedCategories,
        updatedAt: serverTimestamp(),
      };

      if (post.id) {
        const docRef = doc(db, 'blog-posts', post.id);
        await updateDoc(docRef, postData);
      } else {
        const docRef = await addDoc(collection(db, 'blog-posts'), {
          ...postData,
          createdAt: serverTimestamp(),
        });
        setPost(prev => ({ ...prev, id: docRef.id }));
      }
      
      success(t('saveSuccess', 'Blog yazısı başarıyla kaydedildi.'));
    } catch (err) {
      console.error('Blog yazısı kaydedilirken hata:', err);
      error(t('saveError', 'Blog yazısı kaydedilirken bir hata oluştu.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategorySelect = (category: any) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };
  
  const menuItems = [
    { id: 'editor', label: 'Editör', icon: <FileText className="w-5 h-5" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> },
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobil menü butonu */}
      <div className="bg-white p-4 flex justify-between items-center md:hidden border-b shadow-sm sticky top-0 z-50">
        <h1 className="text-lg font-semibold text-slate-800">{t('appName', 'SpeakNest')}</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Sol yan çubuğu */}
      <div className={`
        fixed inset-0 z-40 md:relative md:inset-auto
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm
      `}>
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-800">Blog Editörü</h1>
        </div>
        
        <div className="overflow-y-auto flex-1">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Menü</h2>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-700">{userProfile?.displayName || userProfile?.email}</div>
                <div className="text-xs text-slate-500">{userProfile?.role}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <LanguageSwitcher variant="select" className="w-full text-sm" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
      
      {/* Ana içerik */}
      <div className="flex-1 p-4 md:p-6 md:pt-6 overflow-auto">
        <div className="hidden md:flex md:justify-between md:items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-800">
              {activeTab === 'editor' ? 'Blog Yazısı' : 'Ayarlar'}
            </h1>
          </div>
          
          {activeTab === 'editor' && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          )}
        </div>
        
        {activeTab === 'editor' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Blog yazısı başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Özet
                  </label>
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Blog yazısı özeti"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kapak Resmi
                  </label>
                  <MediaUploader
                    onUploadComplete={(url) => setPost({ ...post, coverImage: url })}
                    folder="blog-covers"
                    acceptedTypes={['image/*']}
                  />
                  {post.coverImage && (
                    <div className="mt-2">
                      <img
                        src={post.coverImage}
                        alt="Kapak resmi"
                        className="max-h-48 rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoriler
                  </label>
                  <CategorySelector
                    onSelect={handleCategorySelect}
                    selectedCategories={selectedCategories}
                    canCreate={true}
                    allowMultiple={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İçerik
                  </label>
                  <RichTextEditor
                    value={post.content}
                    onChange={(content) => setPost({ ...post, content })}
                    placeholder="Blog yazısı içeriği"
                  />
                </div>

                {post.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durum
                    </label>
                    <DocumentWorkflow
                      documentId={post.id}
                      currentStatus={post.status}
                      onStatusChange={(newStatus) =>
                        setPost({ ...post, status: newStatus })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Editör Ayarları</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Otomatik Kaydetme
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    Her 5 dakikada bir otomatik kaydet
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
