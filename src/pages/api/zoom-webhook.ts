import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Basit Zoom Webhook API
 * Bu en temel seviyede webhook yanıtı için oluşturulmuştur
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[DEBUG] Zoom webhook request received', {
    method: req.method,
    url: req.url,
    query: req.query,
  });

  // GET isteği - webhook doğrulama
  if (req.method === 'GET') {
    const { challenge } = req.query;
    
    console.log('[DEBUG] Challenge param received:', challenge);
    
    if (challenge) {
      // Challenge yanıtı - sadece challenge parametresini düz metin olarak döndür
      console.log('[DEBUG] Sending challenge response');
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(String(challenge));
    }
    
    // Doğrulama yok - normal yanıt
    return res.status(200).json({ message: 'Zoom Webhook API' });
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