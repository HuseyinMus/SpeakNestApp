import { NextRequest, NextResponse } from 'next/server';

// Statik dışa aktarım için gerekli yapılandırma
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(
  request: NextRequest,
  context: { params: { meetingId: string } }
) {
  try {
    // Token al
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
      throw new Error('Token alınamadı');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Toplantı bilgilerini al
    const meetingResponse = await fetch(`https://api.zoom.us/v2/meetings/${context.params.meetingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!meetingResponse.ok) {
      throw new Error('Toplantı bilgileri alınamadı');
    }

    const meetingData = await meetingResponse.json();
    return NextResponse.json(meetingData);
  } catch (error: any) {
    console.error('Toplantı bilgileri alma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 