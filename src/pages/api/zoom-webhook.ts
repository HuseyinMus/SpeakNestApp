import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// Zoom API Güvenlik Tokenları
// Bu değerleri Zoom App Marketplace'ten almanız gerekir
const ZOOM_WEBHOOK_SECRET_TOKEN = 'U1W-BBmR52jYNNmAJBTw'; // Bu değeri kendi token'ınız ile değiştirin

/**
 * Zoom Webhook API
 * Docs: https://developers.zoom.us/docs/api/webhooks/
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET request - webhook validation (Challenge Response Check)
  if (req.method === 'GET') {
    const { challenge } = req.query;
    
    // Challenge parametresi varsa, düz metin olarak döndür
    if (challenge) {
      console.log('Zoom Webhook Challenge:', challenge);
      
      // !!! ÖNEMLİ: Content-Type header'ı text/plain olmalı
      res.setHeader('Content-Type', 'text/plain');
      
      // SADECE challenge değerini düz metin olarak döndür
      return res.status(200).send(String(challenge));
    }
    
    // Challenge yoksa normal yanıt
    return res.status(200).json({ message: 'Zoom Webhook API - Ready' });
  }
  
  // POST request - webhook events
  if (req.method === 'POST') {
    try {
      // Webhook imza doğrulama
      const timestamp = req.headers['x-zm-request-timestamp'];
      const signature = req.headers['x-zm-signature'];
      const body = req.body;
      
      // İmza doğrulama (isteğe bağlı güvenlik katmanı)
      if (signature && ZOOM_WEBHOOK_SECRET_TOKEN) {
        // Dokümantasyona uygun şekilde mesaj oluştur
        const message = `v0:${timestamp}:${JSON.stringify(req.body)}`;
        
        // HMAC-SHA256 hash oluştur
        const hashForVerify = crypto.createHmac('sha256', ZOOM_WEBHOOK_SECRET_TOKEN)
          .update(message)
          .digest('hex');
        
        // İmza oluştur
        const expectedSignature = `v0=${hashForVerify}`;
        
        // İmza kontrolü
        if (signature !== expectedSignature) {
          console.warn('Zoom webhook imza doğrulama başarısız!');
          console.log('Beklenen:', expectedSignature);
          console.log('Gelen:', signature);
          
          // İmza doğrulama hatası - yanıtı 3 saniye içinde vermek gerekir!
          return res.status(401).json({ error: 'Invalid signature' });
        }
      }
      
      // Log event bilgisini
      console.log(`Zoom webhook received: ${body.event}`);
      
      // Event tipine göre işlem yap
      switch(body.event) {
        case 'meeting.started':
          console.log(`Meeting started: ${body.payload.object.id}`);
          break;
        case 'meeting.ended':
          console.log(`Meeting ended: ${body.payload.object.id}`);
          break;
        case 'meeting.participant_joined':
          console.log(`Participant joined: ${body.payload.object.participant.user_name}`);
          break;
        case 'meeting.participant_left':
          console.log(`Participant left: ${body.payload.object.participant.user_name}`);
          break;
        default:
          console.log(`Other event: ${body.event}`);
      }
      
      // Webhook başarı yanıtı - 3 saniye içinde yanıt verilmelidir!
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({ error: 'Webhook processing error' });
    }
  }
  
  // Method Not Allowed
  return res.status(405).end();
} 