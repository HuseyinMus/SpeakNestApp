import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Basit Zoom Webhook Handler
 * Sadece challenge yanıtı için optimize edilmiş
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET isteği için basit challenge yanıtı (eski model)
  if (req.method === 'GET') {
    const challenge = req.query.challenge;
    
    if (challenge) {
      console.log("GET challenge yanıtı gönderiliyor:", challenge);
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(String(challenge));
    }
    
    return res.status(200).json({ message: 'Zoom Webhook GET endpoint hazır' });
  }
  
  // POST isteği için JSON payload işleme (yeni model)
  if (req.method === 'POST') {
    const { event, payload } = req.body;
    console.log("POST isteği alındı:", event);
    
    // URL validation event'i
    if (event === 'endpoint.url_validation') {
      const plainToken = payload?.plainToken;
      // ZOOM_WEBHOOK_SECRET_TOKEN değerini .env.local dosyasından alıyoruz
      // Bu değeri Zoom Developer Dashboard'dan webhook secret olarak almanız gerekiyor
      const secret = process.env.ZOOM_WEBHOOK_SECRET_TOKEN || 'webhook-secret';
      
      console.log("URL doğrulama isteği alındı, plainToken:", plainToken);
      
      const encryptedToken = crypto
        .createHmac('sha256', secret)
        .update(plainToken)
        .digest('hex');
      
      console.log("Şifrelenmiş token oluşturuldu:", encryptedToken);
      
      return res.status(200).json({
        plainToken,
        encryptedToken,
      });
    }
    
    // Diğer Zoom event'leri
    console.log('Zoom Webhook Event:', event, req.body);
    return res.status(200).json({ received: true });
  }
  
  // Desteklenmeyen HTTP method'ları için
  res.status(405).json({ error: 'Method Not Allowed' });
} 