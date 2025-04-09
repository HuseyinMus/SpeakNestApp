import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Basit Zoom Webhook API
 * Bu en temel seviyede webhook yanıtı için oluşturulmuştur
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Tüm request bilgilerini log'la
  console.log('[DEBUG] Zoom webhook request received', {
    method: req.method,
    url: req.url,
    query: JSON.stringify(req.query),
    headers: JSON.stringify(req.headers),
  });

  // GET isteği - webhook doğrulama
  if (req.method === 'GET') {
    // Tüm query parametrelerini kontrol et
    const allParams = req.query;
    console.log('[DEBUG] All query params:', allParams);
    
    let challenge = req.query.challenge;
    
    // Farklı formatlarda gelebilecek challenge parametresi için kontrol
    if (!challenge && 'challenge' in req.query) {
      challenge = String(req.query['challenge']);
    }
    
    console.log('[DEBUG] Challenge param processed as:', challenge);
    
    if (challenge) {
      // !ÖNEMLİ! - Sadece challenge parametresini düz metin olarak gönder
      // Başka herhangi bir çıktı veya header soruna neden olabilir
      console.log('[DEBUG] Sending challenge response:', challenge);
      res.setHeader('Content-Type', 'text/plain');
      
      // Herhangi bir extra karakter olmadan sadece challenge değerini gönder
      return res.send(String(challenge));
    }
    
    // Challenge yoksa normal yanıt
    return res.status(200).json({ message: 'Zoom Webhook API - Ready' });
  }
  
  // POST isteği - webhook olayları
  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('[DEBUG] Webhook payload received:', body);
      
      // Webhook event tipine göre işlemler
      if (body && body.event) {
        console.log(`[DEBUG] Zoom event: ${body.event}`);
      }
      
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('[ERROR] Webhook processing error:', error);
      return res.status(500).json({ error: 'Webhook processing error' });
    }
  }
  
  // Diğer metodlar için 405 Method Not Allowed
  return res.status(405).json({ error: 'Method not allowed' });
} 