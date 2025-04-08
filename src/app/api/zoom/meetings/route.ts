import { NextResponse } from 'next/server';

// Statik dışa aktarım için gerekli yapılandırma
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('İstek gövdesi:', body);
    
    // Önce token alalım
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
      throw new Error(`Token alınamadı: ${JSON.stringify(tokenError)}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token alındı');

    // Toplantı oluştur
    const { title, description, startTime, duration } = body;
    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: title,
        type: 2, // Scheduled meeting
        start_time: new Date(startTime).toISOString(),
        duration: duration,
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
      }),
    });

    console.log('Zoom yanıt durumu:', meetingResponse.status);
    const meetingData = await meetingResponse.json();
    console.log('Zoom yanıt verisi:', meetingData);

    if (!meetingResponse.ok) {
      throw new Error(`Zoom toplantısı oluşturulamadı: ${JSON.stringify(meetingData)}`);
    }

    return NextResponse.json({
      joinUrl: meetingData.join_url,
      meetingId: meetingData.id,
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