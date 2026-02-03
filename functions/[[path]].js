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
      'twitterbot', 'telegrambot', 'facebookbot', 'whatsapp',
      'facebookexternalhit', 'linkedinbot', 'discordbot', 'slackbot'
    ];
    
    const isBot = BOT_PATTERNS.some(pattern => userAgent.includes(pattern));
    
    // 3. LOGIKA UTAMA
    if (!idMatch) {
      // Redirect ke homepage jika path salah
      return Response.redirect('https://videyo.co', 302);
    }
    
    const videoId = idMatch[1];
    
    // PAKAI PATH /s/ UNTUK SEMUA (KONSISTEN!)
    const targetUrl = `https://videyo.co/s/${videoId}`;
    
    if (isBot) {
      // BOT: Tampilkan HTML preview
      return serveBotPage(videoId, url);
    }
    
    // USER: Redirect ke videyo.co
    return Response.redirect(targetUrl, 302);
    
  } catch (error) {
    // Fallback redirect jika error
    return Response.redirect('https://videyo.co', 302);
  }
}

// ============================================
// FUNCTION: HTML untuk Bot
// ============================================
function serveBotPage(videoId, url) {
  const pageUrl = url.toString();
  const thumbnailUrl = "https://viddey.life/safe-thumbnail.jpg";
  const targetUrl = `https://videyo.co/s/${videoId}`;
  
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- TWITTER CARD -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@ViddeyLife">
    <meta name="twitter:title" content="🎬 Video ${videoId} - Viddey">
    <meta name="twitter:description" content="Watch this amazing video on Viddey. Safe content.">
    <meta name="twitter:image" content="${thumbnailUrl}">
    <meta name="twitter:url" content="${pageUrl}">
    
    <!-- OPEN GRAPH -->
    <meta property="og:title" content="🎬 Video ${videoId} - Viddey">
    <meta property="og:description" content="Watch this amazing video on Viddey.">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:type" content="video.other">
    
    <!-- CANONICAL -->
    <link rel="canonical" href="${targetUrl}">
    
    <style>
        body {
            font-family: sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            display: inline-block;
            backdrop-filter: blur(10px);
        }
        .play-button {
            background: #1DA1F2;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 Viddey Video Player</h1>
        <p>Video ID: <strong>${videoId}</strong></p>
        <p>Loading video...</p>
        
        <a href="${targetUrl}" class="play-button">
            ▶ Play Video Now
        </a>
        
        <p style="font-size: 14px; opacity: 0.8;">
            Redirecting to videyo.co...
        </p>
    </div>
    
    <script>
        // Auto-redirect untuk user biasa
        setTimeout(() => {
            window.location.href = "${targetUrl}";
        }, 1500);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
