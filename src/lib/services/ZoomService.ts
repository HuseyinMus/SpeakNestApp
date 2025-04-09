export class ZoomService {
  // API rotalarımızı kullanacak şekilde değiştiriyoruz
  private static API_BASE = '/api/zoom';

  /**
   * Zoom toplantısı oluşturur
   */
  static async createMeeting(
    title: string,
    description: string,
    startTime: Date,
    duration: number = 60
  ) {
    try {
      // Debug: Parametreleri ve tiplerini kontrol et
      console.log('ZoomService.createMeeting parametreleri:', {
        title: typeof title === 'undefined' ? 'undefined' : title,
        description: typeof description === 'undefined' ? 'undefined' : description,
        startTime: startTime instanceof Date ? startTime.toISOString() : 'geçersiz tarih',
        duration
      });

      // Parametreleri kontrol et
      if (!title || !description || !startTime) {
        throw new Error('Gerekli alanlar eksik: title, description ve startTime zorunludur');
      }

      // Debug: API isteği içeriği
      const requestBody = {
        title,
        description,
        startTime: startTime.toISOString(),
        duration,
      };
      console.log('ZoomService API isteği:', requestBody);

      const response = await fetch(`${this.API_BASE}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Zoom toplantısı oluşturulamadı');
      }

      if (!data.joinUrl || !data.meetingId) {
        throw new Error('Toplantı yanıtında gerekli bilgiler eksik');
      }

      return data;
    } catch (error: any) {
      console.error('Zoom toplantısı oluşturma hatası:', error);
      throw error;
    }
  }

  /**
   * Zoom toplantı bilgilerini getirir
   */
  static async getMeeting(meetingId: string): Promise<any> {
    try {
      if (!meetingId) {
        throw new Error('Meeting ID gerekli');
      }

      const response = await fetch(`${this.API_BASE}/meetings/${meetingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Toplantı bilgileri alınamadı');
      }

      return data;
    } catch (error) {
      console.error('Toplantı bilgileri alma hatası:', error);
      throw error;
    }
  }
} 