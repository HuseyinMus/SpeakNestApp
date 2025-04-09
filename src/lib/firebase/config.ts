// İstemci tarafı kontrolü
const isClient = typeof window !== 'undefined';

// Firebase modüllerini dinamik olarak import et
let firebase = {
  app: null,
  auth: null,
  firestore: null,
  storage: null
};

// Doğrudan sabit değerleri kullanıyoruz
export const firebaseConfig = {
  apiKey: "AIzaSyDi-ocPnlw8pc_gmkJORFPF2lUkj8Raz6w",
  authDomain: "yeniapp2-105be.firebaseapp.com",
  projectId: "yeniapp2-105be",
  storageBucket: "yeniapp2-105be.appspot.com",
  messagingSenderId: "198254015679",
  appId: "1:198254015679:web:1f645148e77bd8ec69820a"
};

// Debug için log ekleme
if (isClient) {
  console.log("Firebase Config:", firebaseConfig);
  console.log("Environment:", process.env.NODE_ENV);
}

// Ortam bilgisini kontrol et
export const isProduction = process.env.NODE_ENV === 'production';

// Firebase koleksiyon isimleri
export const collections = {
  users: isProduction ? 'users' : 'users_dev',
  meetings: isProduction ? 'meetings' : 'meetings_dev',
  // Diğer koleksiyonlar...
};

// Bu fonksiyon Firebase servislerini başlatır
export async function initFirebase() {
  if (isClient) {
    // Sadece istemci tarafında import et
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    const { getAuth } = await import('firebase/auth');
    const { getStorage } = await import('firebase/storage');
    
    // Firebase'i başlat
    const app = initializeApp(firebaseConfig);
    
    // Servisleri başlat
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    // Servisleri referansla
    firebase = { app, auth, db, storage };
  }
  
  return firebase;
}

// Firebase bileşenlerini dışa aktar
export const getFirebaseApp = async () => {
  if (!firebase.app) await initFirebase();
  return firebase.app;
};

export const getFirebaseAuth = async () => {
  if (!firebase.auth) await initFirebase();
  return firebase.auth;
};

export const getFirestoreDb = async () => {
  if (!firebase.db) await initFirebase();
  return firebase.db;
};

export const getFirebaseStorage = async () => {
  if (!firebase.storage) await initFirebase();
  return firebase.storage;
}; 
