import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Doğrudan sabit değerleri kullanıyoruz
const firebaseConfig = {
  apiKey: "AIzaSyDi-ocPnlw8pc_gmkJORFPF2lUkj8Raz6w",
  authDomain: "yeniapp2-105be.firebaseapp.com",
  projectId: "yeniapp2-105be",
  storageBucket: "yeniapp2-105be.firebasestorage.app",
  messagingSenderId: "198254015679",
  appId: "1:198254015679:web:1f645148e77bd8ec69820a",
  measurementId: "G-5RY6PJVJPH"
};

// Firebase'i başlat
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore, Auth ve Storage servislerini başlat
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Ortam bilgisini kontrol et
export const isProduction = process.env.NODE_ENV === 'production';

// Firebase koleksiyon isimleri
export const collections = {
  users: isProduction ? 'users' : 'users_dev',
  meetings: isProduction ? 'meetings' : 'meetings_dev',
  // Diğer koleksiyonlar...
}; 
