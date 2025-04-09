import { NextResponse } from 'next/server';

// Dynamic API route yapılandırması - edge runtime kullanma
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Request body'yi al ve log'la
    const body = await request.json();
    console.log('Zoom API isteği alındı:', body);
    
    // Gerekli alanların kontrolü
    if (!body.title || !body.description || !body.startTime) {
      console.error("Eksik alanlar:", { 
        title: !!body.title, 
        description: !!body.description, 
        startTime: !!body.startTime 
      });
      return NextResponse.json(
        { error: "Gerekli alanlar eksik: title, description ve startTime zorunludur" },
        { status: 400 }
      );
    }
    
    // String olarak startTime'ı Date'e çevir
    let startDate: Date;
    try {
      console.log("startTime değeri:", body.startTime);
      console.log("startTime tipi:", typeof body.startTime);
      
      startDate = new Date(body.startTime);
      
      console.log("Oluşturulan tarih:", startDate);
      console.log("Tarih ISO string:", startDate.toISOString());
      console.log("Tarih geçerli mi:", !isNaN(startDate.getTime()));
      
      if (isNaN(startDate.getTime())) {
        throw new Error("Geçersiz tarih formatı");
      }
    } catch (error) {
      console.error("Tarih dönüştürme hatası:", error);
      return NextResponse.json(
        { error: "Geçersiz başlangıç zamanı formatı" },
        { status: 400 }
      );
    }
    
    // Önce token alalım
    console.log('Zoom token alınıyor...');
    
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: process.env.NEXT_PUBLIC_ZOOM_ACCOUNT_ID || '',
        client_id: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID || '',
        client_secret: process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET || '',
      }),
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.json();
      console.error('Token alınamadı:', tokenError);
      throw new Error(`Token alınamadı: ${JSON.stringify(tokenError)}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token alındı');

    // Toplantı oluştur
    const { title, description, duration } = body;
    
    // Zoom API isteği oluştur
    const meetingData = {
      topic: title,
      type: 2, // Scheduled meeting
      start_time: startDate.toISOString(),
      duration: duration || 60,
      timezone: 'Europe/Istanbul',
      agenda: description,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: false,
        waiting_room: false,
        auto_recording: 'none',
      },
    };
    
    console.log('Zoom API isteği gönderiliyor:', meetingData);
    
    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_ZOOM_API_KEY || '',
      },
      body: JSON.stringify(meetingData),
    });

    console.log('Zoom yanıt durumu:', meetingResponse.status);
    const meetingResponseData = await meetingResponse.json();
    console.log('Zoom yanıt verisi:', meetingResponseData);

    if (!meetingResponse.ok) {
      throw new Error(`Zoom toplantısı oluşturulamadı: ${JSON.stringify(meetingResponseData)}`);
    }

    return NextResponse.json({
      joinUrl: meetingResponseData.join_url,
      meetingId: meetingResponseData.id,
    });
  } catch (error: any) {
    console.error('Zoom API detaylı hata:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Bir hata oluştu',
        details: error.stack
      },
      { status: 500 }
    );
  }
} 