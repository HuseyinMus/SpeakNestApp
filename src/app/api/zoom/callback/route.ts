import { NextResponse } from 'next/server';

// Statik dışa aktarım için gerekli yapılandırma
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// OAuth callback işleme
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const challenge = searchParams.get('challenge');

    // Eğer challenge varsa, webhook doğrulama isteği
    if (challenge) {
      return new NextResponse(challenge, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Eğer code yoksa hata döndür
    if (!code) {
      throw new Error('Authorization code bulunamadı');
    }

    // Token al
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID}:${process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/zoom/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token alma hatası:', errorData);
      throw new Error(`Token alınamadı: ${errorData.message || 'Bilinmeyen hata'}`);
    }

    await tokenResponse.json(); // Sadece response'u tüketmek için
    console.log('Token başarıyla alındı');

    // Başarılı yönlendirme
    return NextResponse.redirect(new URL('/prouser-panel', request.url));

  } catch (error) {
    console.error('OAuth callback hatası:', error);
    // Hata durumunda ana sayfaya yönlendir
    return NextResponse.redirect(new URL('/?error=oauth_failed', request.url));
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook işleme hatası:', error);
    return NextResponse.json(
      { error: 'Webhook işlenirken hata oluştu' },
      { status: 500 }
    );
  }
} 