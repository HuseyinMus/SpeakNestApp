import { NextResponse } from 'next/server';

// Statik dışa aktarım için gerekli yapılandırma
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      throw new Error('Authorization code not found');
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
      throw new Error('Token alınamadı');
    }

    const tokenData = await tokenResponse.json();
    console.log('Token alındı:', tokenData);

    // Kullanıcıyı ana sayfaya yönlendir
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
} 