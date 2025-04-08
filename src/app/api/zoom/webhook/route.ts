import { NextResponse } from 'next/server';
import { MeetingService } from '@/lib/services/MeetingService';

// Statik dışa aktarım için gerekli yapılandırma
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Zoom Webhook Olayı:', body);

    // Event türüne göre işlem yap
    switch (body.event) {
      case 'meeting.started':
        // Toplantı başladığında
        if (body.payload?.object?.id) {
          await MeetingService.updateMeetingStatus(body.payload.object.id, 'active');
        }
        break;

      case 'meeting.ended':
        // Toplantı bittiğinde
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
        // Katılımcı katıldığında
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
        console.log('Bilinmeyen event:', body.event);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook işleme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook işlenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 