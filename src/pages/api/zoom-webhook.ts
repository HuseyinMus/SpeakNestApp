import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Basit Zoom Webhook Handler
 * Sadece challenge yanıtı için optimize edilmiş
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Zoom webhook isteği alındı:', {
    method: req.method,
    query: req.query,
    headers: req.headers,
    url: req.url,
  });

  // Challenge parametresi varsa
  if (req.query.challenge) {
    const challenge = req.query.challenge as string;
    console.log('Challenge değeri:', challenge);
    
    // Sadece challenge değerini plain text olarak döndür
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(challenge);
  }

  // Normal yanıt
  return res.status(200).json({ message: 'Zoom Webhook API - Ready' });
} 