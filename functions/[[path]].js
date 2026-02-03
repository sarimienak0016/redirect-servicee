export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname;
    const request = context.request;
    
    // Support multiple patterns
    const idMatch = path.match(/^\/(?:s|watch|v|video)\/([a-zA-Z0-9_-]+)$/);
    
    // Bot detection
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /twitterbot|facebookexternalhit|whatsapp|telegrambot/i.test(userAgent);
    
    if (!idMatch) {
      return Response.redirect('https://videyo.co', 302);
    }
    
    const videoId = idMatch[1];
    const targetUrl = `https://videyo.co/s/${videoId}`;
    
    if (isBot) {
      return serveBotPage(videoId, url);
    }
    
    // Create redirect with headers
    const response = Response.redirect(targetUrl, 302);
    
    // Add security headers to redirect
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'interest-cohort=()');
    headers.set('Cache-Control', 'no-store, max-age=0');
    headers.set('X-Redirect-Source', 'viddey.life');
    headers.set('X-Redirect-Destination', targetUrl);
    headers.set('X-Viddey-Version', '2.0');
    
    return new Response(response.body, {
      status: 302,
      headers: headers
    });
    
  } catch (error) {
    // Error response dengan headers
    return new Response('Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store'
      }
    });
  }
}

function serveBotPage(videoId, url) {
  const pageUrl = url.toString();
  const targetUrl = `https://videyo.co/s/${videoId}`;
  
  // Multiple thumbnails
  const thumbnails = [
    'https://viddey.life/safe-thumbnail.jpg',
    'https://viddey.life/thumbs/1.jpg',
    'https://viddey.life/thumbs/2.jpg'
  ];
  const thumbnailUrl = thumbnails[0]; // atau random
  
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- TWITTER CARD -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@UsernameAsliAnda"> <!-- GANTI INI! -->
    <meta name="twitter:title" content="Video ${videoId}">
    <meta name="twitter:description" content="Watch this video on Viddey">
    <meta name="twitter:image" content="${thumbnailUrl}">
    <meta name="twitter:url" content="${pageUrl}">
    
    <!-- OPEN GRAPH -->
    <meta property="og:title" content="Video ${videoId}">
    <meta property="og:description" content="Watch this video on Viddey">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:type" content="video.other">
    
    <style>
        body { 
            font-family: sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #667eea; 
            color: white; 
        }
    </style>
</head>
<body>
    <h1>Viddey Video Player</h1>
    <p>Video ID: ${videoId}</p>
    <p><a href="${targetUrl}">Click to watch</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      
      // Security Headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'interest-cohort=()',
      
      // Twitter/Facebook specific
      'X-Twitter-Card-URL': pageUrl,
      'X-OG-Image': thumbnailUrl,
      
      // Custom
      'X-Viddey-Response': 'bot-preview',
      'X-Video-ID': videoId,
      'X-Timestamp': Date.now().toString()
    }
  });
}
