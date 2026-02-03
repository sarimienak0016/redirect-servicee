// ============================================
// CLOUDFLARE PAGES SECURE REDIRECT
// ============================================

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname;
    
    // 1. VALIDASI PATH: hanya format /s/xxx
    const idMatch = path.match(/^\/s\/([a-zA-Z0-9_-]+)$/);
    
    // 2. DETEKSI BOT
    const userAgent = (context.request.headers.get('user-agent') || '').toLowerCase();
    const BOT_PATTERNS = [
      'twitterbot', 'telegrambot', 'facebookbot', 'whatsapp'
    ];
    
    const isBot = BOT_PATTERNS.some(pattern => userAgent.includes(pattern));
    
    // 3. LOGIKA UTAMA
    if (!idMatch) {
      return Response.redirect('https://videyo.co', 302);
    }
    
    const realId = idMatch[1];
    const targetUrl = `https://videyo.co/e/${realId}`;
    
    if (isBot) {
      const html = `<!DOCTYPE html>
<html>
<head>
    <title>Video ${realId} - Viddey</title>
    <meta property="og:title" content="Video ${realId}">
    <meta property="og:image" content="https://viddey.life/safe-thumbnail.jpg">
</head>
<body>Loading video...</body>
</html>`;
      return new Response(html, { 
        headers: { 'Content-Type': 'text/html' } 
      });
    }
    
    return Response.redirect(targetUrl, 302);
    
  } catch (error) {
    return Response.redirect('https://videyo.co', 302);
  }
}
