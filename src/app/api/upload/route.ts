import { NextResponse } from 'next/server';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase/config';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    
    const bytes = await file.arrayBuffer();
    const snapshot = await uploadBytes(storageRef, bytes);
    const url = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 