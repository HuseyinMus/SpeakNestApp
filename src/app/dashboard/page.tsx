'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { userService, User } from '@/lib/services/UserService';
import { rbacService, UserRole } from '@/lib/auth/rbac';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { Search, Users, Calendar, Settings, BarChart2, LogOut, User as UserIcon, Home } from 'lucide-react';

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Kullanıcının admin olup olmadığını kontrol et
        try {
          const userDoc = await userService.getUserById(user.uid);
          setIsAdmin(userDoc?.role === 'admin');
        } catch (error) {
          console.error('Kullanıcı rolü kontrol edilemedi:', error);
        }
        
        try {
          // İlk başlangıçta kullanıcı listesi olmayabilir, bu durumu ele alalım
          const usersList = await userService.getAllUsers().catch(err => {
            console.log("Kullanıcı listesi alınamadı, boş liste kullanılıyor:", err);
            return [];
          });
          
          setUsers(usersList);
          setFilteredUsers(usersList);
        } catch (err: any) {
          console.error('Kullanıcı listesi yüklenemedi:', err);
          setError('Kullanıcı listesi yüklenemedi: ' + (err.message || 'Bilinmeyen hata'));
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });
    
    return () => unsubscribe();
  }, [router]);
  
  // Arama ve filtreleme işlevi
  useEffect(() => {
    let result = users;
    
    // Arama terimine göre filtrele
    if (searchTerm) {
      result = result.filter(user => 
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Role göre filtrele
    if (filterRole) {
      result = result.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, filterRole, users]);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Çıkış yapılamadı:', error);
    }
  };
  
  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    setMessage('');
    
    try {
      await userService.updateUserRole(userId, newRole);
      
      // Kullanıcı listesini güncelle
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, role: newRole } as User;
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setMessage(`Kullanıcı rolü "${rbacService.getRoleDisplayName(newRole)}" olarak güncellendi.`);
      
    } catch (error: any) {
      setError('Rol güncellenemedi: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setChangingRole(null);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setActiveTab('userDetails');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sol Kenar Çubuğu (Menü) */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">SpeakNest Admin</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ul className="p-4">
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-4 py-2 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <BarChart2 className="mr-3" size={18} />
                <span>Genel Bakış</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-4 py-2 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'users' || activeTab === 'userDetails' ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <Users className="mr-3" size={18} />
                <span>Kullanıcılar</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('meetings')}
                className={`flex items-center px-4 py-2 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'meetings' ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <Calendar className="mr-3" size={18} />
                <span>Toplantılar</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-4 py-2 w-full text-left rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <Settings className="mr-3" size={18} />
                <span>Ayarlar</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
              <UserIcon size={20} />
            </div>
            <div>
              <div className="font-medium">{currentUser?.email?.split('@')[0]}</div>
              <div className="text-xs text-gray-400">
                {isAdmin ? 'Yönetici' : 'Kullanıcı'}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Çıkış Yap
          </button>
        </div>
      </div>
      
      {/* Ana İçerik Alanı */}
      <div className="flex-1 overflow-hidden">
        {error && (
          <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {message && (
          <div className="m-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
        
        {/* Genel Bakış */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Genel Bakış</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Toplam Kullanıcı</h2>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                <div className="mt-2 text-sm text-gray-500">Sistemdeki toplam kayıtlı kullanıcı sayısı</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Öğretmen</h2>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter(user => user.role === 'teacher').length}
                </p>
                <div className="mt-2 text-sm text-gray-500">Toplam öğretmen sayısı</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Editör</h2>
                <p className="text-3xl font-bold text-yellow-600">
                  {users.filter(user => user.role === 'editor').length}
                </p>
                <div className="mt-2 text-sm text-gray-500">Toplam editör sayısı</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Öğrenci</h2>
                <p className="text-3xl font-bold text-purple-600">
                  {users.filter(user => user.role === 'student').length}
                </p>
                <div className="mt-2 text-sm text-gray-500">Toplam öğrenci sayısı</div>
              </div>
            </div>
            
            {/* Grafikler için yer tutucu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Kullanıcı Rolleri Dağılımı</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Grafik verisi burada görüntülenecek</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Haftalık Kullanıcı Artışı</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Grafik verisi burada görüntülenecek</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Kullanıcılar */}
        {activeTab === 'users' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Kullanıcı Yönetimi</h2>
            
            {/* Arama ve Filtreleme */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Kullanıcı adı veya e-posta ara..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">Tüm Roller</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Öğretmen</option>
                  <option value="editor">Editör</option>
                  <option value="proUser">Pro Kullanıcı</option>
                  <option value="student">Öğrenci</option>
                </select>
              </div>
            </div>
            
            {/* Kullanıcı Tablosu */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanıcı Adı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.id.slice(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.displayName || '(İsimsiz)'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : user.role === 'teacher'
                                ? 'bg-green-100 text-green-800'
                                : user.role === 'editor'
                                ? 'bg-yellow-100 text-yellow-800'
                                : user.role === 'proUser'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {rbacService.getRoleDisplayName(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt?.toLocaleString('tr-TR') || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleUserSelect(user)}
                              >
                                Detaylar
                              </button>
                              
                              {isAdmin && user.role !== 'admin' && (
                                <select 
                                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                  defaultValue=""
                                  disabled={changingRole === user.id}
                                >
                                  <option value="" disabled>Rol Değiştir</option>
                                  <option value="teacher">Öğretmen</option>
                                  <option value="editor">Editör</option>
                                  <option value="proUser">Pro Kullanıcı</option>
                                  <option value="student">Öğrenci</option>
                                </select>
                              )}
                              
                              {user.role === 'admin' && (
                                <span className="text-gray-500">Admin rolü değiştirilemez</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm || filterRole 
                            ? 'Arama kriterlerine uygun kullanıcı bulunamadı' 
                            : 'Kullanıcı bulunamadı'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Kullanıcı Detayları */}
        {activeTab === 'userDetails' && selectedUser && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveTab('users')}
                className="mr-4 text-blue-600 hover:text-blue-800"
              >
                ← Kullanıcı Listesine Dön
              </button>
              <h2 className="text-2xl font-semibold">Kullanıcı Detayları</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
                  <div className="w-32 h-32 mx-auto md:mx-0 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl mb-4">
                    {selectedUser.displayName ? selectedUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold">{selectedUser.displayName || '(İsimsiz)'}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        selectedUser.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : selectedUser.role === 'teacher'
                          ? 'bg-green-100 text-green-800'
                          : selectedUser.role === 'editor'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedUser.role === 'proUser'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {rbacService.getRoleDisplayName(selectedUser.role)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 md:border-l md:pl-6">
                  <h4 className="text-lg font-medium mb-4">Kullanıcı Bilgileri</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Kullanıcı ID</p>
                      <p>{selectedUser.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                      <p>{selectedUser.createdAt?.toLocaleString('tr-TR') || '-'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Son Güncelleme</p>
                      <p>{selectedUser.updatedAt?.toLocaleString('tr-TR') || '-'}</p>
                    </div>
                    
                    {isAdmin && selectedUser.role !== 'admin' && (
                      <div className="pt-4">
                        <h4 className="text-lg font-medium mb-4">Yönetim İşlemleri</h4>
                        
                        <div className="flex flex-wrap gap-2">
                          <select 
                            className="border border-gray-300 rounded px-3 py-2 bg-white"
                            defaultValue=""
                            onChange={(e) => e.target.value && handleRoleChange(selectedUser.id, e.target.value)}
                          >
                            <option value="" disabled>Rol Değiştir</option>
                            <option value="teacher" disabled={selectedUser.role === 'teacher'}>Öğretmen</option>
                            <option value="editor" disabled={selectedUser.role === 'editor'}>Editör</option>
                            <option value="proUser" disabled={selectedUser.role === 'proUser'}>Pro Kullanıcı</option>
                            <option value="student" disabled={selectedUser.role === 'student'}>Öğrenci</option>
                          </select>
                          
                          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                            E-posta Gönder
                          </button>
                          
                          <button className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Hesabı Askıya Al
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Toplantılar */}
        {activeTab === 'meetings' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Toplantı Yönetimi</h2>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <p className="text-center text-gray-500">Yaklaşan toplantılar burada listelenecek</p>
            </div>
          </div>
        )}
        
        {/* Ayarlar */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Sistem Ayarları</h2>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <p className="text-center text-gray-500">Sistem ayarları burada listelenecek</p>
            </div>
          </div>
        )}
        
        <div className="p-6 text-center text-sm text-gray-500">
          <Link
            href="/"
            className="text-blue-600 hover:underline flex items-center justify-center"
          >
            <Home size={16} className="mr-1" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 