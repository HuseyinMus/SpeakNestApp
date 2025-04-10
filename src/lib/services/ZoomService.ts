import { sign } from 'jsonwebtoken';

// Baz URL - deployment environment'ına göre değişir
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://speak-nest-app.vercel.app';
const API_PATH = '/api/zoom';
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

export class ZoomService {
  /**
   * Zoom toplantısı oluşturur
   */
  static async createMeeting(params: {
    title: string;
    description?: string;
    startTime: Date | string;
    duration?: number;
  }): Promise<ZoomMeetingResponse> {
    try {
      // API endpoint URL'yi oluştur - absolute URL kullan
      const apiUrl = new URL(`${API_PATH}/meetings`, BASE_URL).toString();
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${generateZoomJWT()}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Zoom toplantısı oluşturulamadı: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoom toplantısı oluşturma hatası:', error);
      throw error;
    }
  }

  /**
   * Zoom toplantı bilgilerini getirir
   */
  static async getMeeting(meetingId: string): Promise<ZoomMeetingResponse> {
    if (!meetingId) {
      throw new Error('Meeting ID gerekli');
    }

    try {
      // API endpoint URL'yi oluştur - absolute URL kullan
      const apiUrl = new URL(`${API_PATH}/meetings/${meetingId}`, BASE_URL).toString();
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${generateZoomJWT()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Toplantı bilgisi alınamadı: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Toplantı bilgisi alma hatası:', error);
      throw error;
    }
  }
}

// Zoom toplantı yanıt tipi
interface ZoomMeetingResponse {
  id?: string;
  topic?: string;
  start_time?: string;
  duration?: number;
  timezone?: string;
  agenda?: string;
  join_url?: string;
  // Diğer olası alanlar için spesifik tip tanımları
  host_email?: string;
  status?: string;
  type?: number;
  start_url?: string;
  password?: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    join_before_host?: boolean;
    mute_upon_entry?: boolean;
    waiting_room?: boolean;
    [key: string]: boolean | string | number | undefined;
  };
} 