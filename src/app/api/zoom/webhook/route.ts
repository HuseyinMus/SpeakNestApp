import { NextResponse } from 'next/server';
import { MeetingService } from '@/lib/services/MeetingService';

// Dynamic API route yapılandırması
export const runtime = 'nodejs';

// Statik dışa aktarım için gerekli yapılandırma
export const dynamic = 'force-dynamic';

// Test modu - geliştirme ortamında true yapın
const DEV_MODE = process.env.NODE_ENV === 'development' || true;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const challenge = searchParams.get('challenge');
    
    console.log('Webhook challenge isteği alındı:', challenge);
    
    // Zoom webhook doğrulama isteği - challenge değerini plain text olarak döndür
    if (challenge) {
      console.log('Challenge yanıtı gönderiliyor:', challenge);
      return new NextResponse(challenge, {
        headers: { 'Content-Type': 'text/plain' },
        status: 200
      });
    }
    
    return NextResponse.json({ 
      message: 'Zoom webhook endpoint',
      mode: DEV_MODE ? 'development' : 'production' 
    });
  } catch (error) {
    console.error('Webhook GET hatası:', error);
    return NextResponse.json(
      { error: 'Webhook işlenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Webhook işleme
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Zoom webhook alındı:', body);

    // Webhook türüne göre işlem yap
    switch (body.event) {
      case 'meeting.started':
        // Toplantı başladığında
        console.log('Toplantı başladı:', body.payload.object);
        break;
        
      case 'meeting.ended':
        // Toplantı bittiğinde
        console.log('Toplantı bitti:', body.payload.object);
        break;
        
      case 'meeting.participant_joined':
        // Katılımcı katıldığında
        console.log('Katılımcı katıldı:', body.payload.object);
        break;
        
      case 'meeting.participant_left':
        // Katılımcı ayrıldığında
        console.log('Katılımcı ayrıldı:', body.payload.object);
        break;
        
      default:
        console.log('Bilinmeyen webhook eventi:', body.event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook işleme hatası:', error);
    return NextResponse.json(
      { error: 'Webhook işlenirken hata oluştu' },
      { status: 500 }
    );
  }
} 