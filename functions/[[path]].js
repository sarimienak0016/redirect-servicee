// ============================================
// CLOUDFLARE PAGES REDIRECT SYSTEM
// GitHub Version - Simple & Working
// ============================================

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname;
    
    console.log(`[${new Date().toISOString()}] Request: ${path}`);
    
    // 1. VALIDATE PATH: /s/xxx
    const idMatch = path.match(/^\/s\/([a-zA-Z0-9_-]+)$/);
    
    if (!idMatch) {
      // Invalid path - show 404
      return htmlResponse(404, "404 - Not Found", "Halaman tidak ditemukan");
    }
    
    const videoId = idMatch[1];
    const targetUrl = `https://videyo.co/e/${videoId}`;
    
    // 2. BOT DETECTION
    const userAgent = (context.request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /twitterbot|telegrambot|facebookbot|googlebot|bingbot|slackbot|whatsapp|bot|crawler|spider/i.test(userAgent);
    
    if (isBot) {
      // 3. FOR BOTS: Show safe page
      console.log(`[BOT] ${userAgent.substring(0, 50)}... viewing safe page for ID: ${videoId}`);
      return showBotSafePage(videoId);
    }
    
    // 4. FOR REAL USERS: Redirect to videyo.co
    console.log(`[USER] Redirecting to: ${targetUrl}`);
    return Response.redirect(targetUrl, 301);
    
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    return htmlResponse(500, "System Error", "Sedang dalam pemeliharaan");
  }
}

// ============================================
// HELPER: Show safe page for bots
// ============================================
function showBotSafePage(videoId) {
  const safeId = videoId.substring(0, 3) + "***";
  const thumbnailUrl = "https://placehold.co/1200x630/4a6ee0/ffffff.png?text=Video+Preview";
  
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Preview - Platform Video</title>
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Video Preview">
    <meta name="twitter:description" content="Tonton video lengkapnya di aplikasi kami">
    <meta name="twitter:image" content="${thumbnailUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Video Preview">
    <meta property="og:description" content="Tonton video lengkapnya di aplikasi kami">
    <meta property="og:type" content="video.other">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Security -->
    <meta name="robots" content="noindex, nofollow">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: rgba(255,255,255,0.95);
            border-radius: 16px;
            padding: 40px;
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            text-align: center;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 10px;
        }
        h1 {
            color: #2d3748;
            margin: 20px 0;
            font-size: 28px;
        }
        .description {
            color: #4a5568;
            font-size: 17px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .thumbnail {
            background: #4a6ee0;
            height: 300px;
            border-radius: 12px;
            margin: 25px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            font-weight: 600;
        }
        .info-box {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #4a6ee0;
        }
        .info-title {
            color: #2d3748;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .info-text {
            color: #718096;
            font-size: 15px;
        }
        .id-display {
            background: #edf2f7;
            padding: 12px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            color: #4a5568;
            font-weight: 600;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #a0aec0;
            font-size: 14px;
        }
        @media (max-width: 640px) {
            .container { padding: 25px; }
            h1 { font-size: 24px; }
            .thumbnail { height: 200px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">VIDEO PLATFORM</div>
        
        <h1>Video Preview</h1>
        
        <div class="description">
            Konten video tersedia untuk ditonton. Akses lengkap melalui aplikasi resmi kami.
        </div>
        
        <div class="thumbnail">
            VIDEO PREVIEW
        </div>
        
        <div class="id-display">
            ID: ${safeId}
        </div>
        
        <div class="info-box">
            <div class="info-title">ℹ️ Informasi</div>
            <div class="info-text">
                Video ini aman dan sesuai dengan kebijakan platform. Untuk pengalaman terbaik, gunakan aplikasi mobile kami.
            </div>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Platform Video • Konten terverifikasi</p>
            <p style="font-size: 12px; margin-top: 5px;">Preview ID: ${Date.now().toString(36)}</p>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}

// ============================================
// HELPER: HTML response for errors
// ============================================
function htmlResponse(status, title, message) {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; }
        h1 { color: #${status === 404 ? '4a5568' : 'e53e3e'}; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <p>${message}</p>
</body>
</html>`;
  
  return new Response(html, {
    status: status,
    headers: { 'Content-Type': 'text/html' }
  });
}
