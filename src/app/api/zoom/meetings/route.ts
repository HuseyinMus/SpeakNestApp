import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// Dynamic API route yapılandırması
export const runtime = 'nodejs';

const ZOOM_API_KEY = 'j4qbt1vUQOCJpmwWwaDt8g';
const ZOOM_API_SECRET = 'SmfLM35kaHUsKDJZWQbXor7j0kt90gUU';

// JWT token oluştur
function generateZoomJWT(): string {
  const payload = {
    iss: ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 saat geçerli
  };

  return sign(payload, ZOOM_API_SECRET);
}

export async function POST(request: Request) {
  try {
    const { title, description, startTime, duration = 60 } = await request.json();

    if (!title || !startTime) {
      return NextResponse.json(
        { error: 'Başlık ve başlangıç zamanı gerekli' },
        { status: 400 }
      );
    }

    // Zoom API'ye istek at
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${generateZoomJWT()}`,
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

    if (!response.ok) {
      const error = await response.json();
      console.error('Zoom API hatası:', error);
      return NextResponse.json(
        { error: 'Toplantı oluşturulamadı: ' + error.message },
        { status: response.status }
      );
    }

    const meetingData = await response.json();
    return NextResponse.json({
      id: meetingData.id,
      join_url: meetingData.join_url,
      start_url: meetingData.start_url,
      password: meetingData.password,
    });

  } catch (error) {
    console.error('Toplantı oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Toplantı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID gerekli' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      headers: {
        'Authorization': `Bearer ${generateZoomJWT()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Zoom API hatası:', error);
      return NextResponse.json(
        { error: 'Toplantı bilgileri alınamadı: ' + error.message },
        { status: response.status }
      );
    }

    const meetingData = await response.json();
    return NextResponse.json(meetingData);

  } catch (error) {
    console.error('Toplantı bilgileri alma hatası:', error);
    return NextResponse.json(
      { error: 'Toplantı bilgileri alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 