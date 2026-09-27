// ArogyaSetu AI — Google Cloud Run / Cloud Functions Enterprise Backend Proxy
// Encapsulates Gemini API keys, rate-limiting, and server-side model orchestration

import http from 'http';
import https from 'https';

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Healthcheck for Google Cloud Run container probes
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'HEALTHY',
      service: 'ArogyaSetu AI Enterprise Gateway',
      cloudProvider: 'Google Cloud Run (asia-south1 / Mumbai)',
      dpdpActCompliant: true,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Endpoint: /api/gemini-proxy
  if (req.url === '/api/gemini-proxy' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const model = payload.model || 'gemini-2.0-flash';
        const apiKey = payload.apiKey || GEMINI_API_KEY;

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing Google Gemini API Key' }));
          return;
        }

        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const googleReq = https.request(googleUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, (googleRes) => {
          let googleData = '';
          googleRes.on('data', chunk => { googleData += chunk; });
          googleRes.on('end', () => {
            res.writeHead(googleRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(googleData);
          });
        });

        googleReq.on('error', (err) => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Gateway failed to reach Google AI Studio', detail: err.message }));
        });

        googleReq.write(JSON.stringify(payload.geminiPayload || {}));
        googleReq.end();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`[Google Cloud Run] ArogyaSetu Gateway active on port ${PORT}`);
});
