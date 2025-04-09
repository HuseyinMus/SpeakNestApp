import { NextResponse } from 'next/server';
import { MeetingService } from '@/lib/services/MeetingService';

// Dynamic API route yapılandırması
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Request gövdesini JSON olarak al
    const body = await request.json();
    console.log('Zoom Webhook alındı:', body);
    
    // Doğrulama token'ı ile güvenlik kontrolü
    const zoomVerificationToken = process.env.NEXT_PUBLIC_ZOOM_VERIFICATION_TOKEN;
    const authHeader = request.headers.get('Authorization');
    
    // Token kontrolü - zorunlu güvenlik önlemi
    if (!authHeader || authHeader !== `Bearer ${zoomVerificationToken}`) {
      console.error('Geçersiz webhook doğrulama token\'ı');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Webhook event tipine göre işlem yapma
    const eventType = body.event;
    
    switch (eventType) {
      case 'meeting.started':
        console.log('Toplantı başladı:', body.payload.object.id);
        // Toplantı başladığında yapılacak işlemler
        if (body.payload?.object?.id) {
          await MeetingService.updateMeetingStatus(body.payload.object.id, 'active');
        }
        break;
        
      case 'meeting.ended':
        console.log('Toplantı sona erdi:', body.payload.object.id);
        // Toplantı bittiğinde yapılacak işlemler
        if (body.payload?.object?.id) {
          await MeetingService.updateMeetingStatus(body.payload.object.id, 'completed');
        }
        break;
        
      case 'meeting.created':
        console.log('Toplantı oluşturuldu:', body.payload.object);
        break;
        
      case 'meeting.updated':
        console.log('Toplantı güncellendi:', body.payload.object);
        break;
        
      case 'meeting.deleted':
        console.log('Toplantı silindi:', body.payload.object);
        break;
        
      case 'meeting.participant_joined':
        console.log('Katılımcı katıldı:', body.payload.object.participant.user_name);
        // Katılımcı katıldığında yapılacak işlemler
        if (body.payload?.object?.participant?.user_id && body.payload?.object?.id) {
          await MeetingService.addParticipant(
            body.payload.object.id,
            body.payload.object.participant.user_id
          );
        }
        break;
        
      case 'meeting.participant_left':
        // Katılımcı ayrıldığında
        if (body.payload?.object?.participant?.user_id && body.payload?.object?.id) {
          await MeetingService.removeParticipant(
            body.payload.object.id,
            body.payload.object.participant.user_id
          );
        }
        break;
        
      default:
        console.log('Bilinmeyen webhook eventi:', eventType);
    }
    
    // Webhook alındı cevabı
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook işleme hatası:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Webhook işlenirken bir hata oluştu' 
      },
      { status: 500 }
    );
  }
} 