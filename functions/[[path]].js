// ============================================
// CLOUDFLARE PAGES SECURE REDIRECT
// Domain: viddey.life → Target: videyo.co
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
      'twitterbot', 'telegrambot', 'discordbot', 'facebookbot', 'googlebot',
      'bingbot', 'slackbot', 'whatsapp', 'linkedinbot', 'pinterestbot',
      'yahoo', 'yandexbot', 'duckduckbot', 'baidubot', 'sogoubot',
      'bot', 'crawler', 'spider', 'scanner', 'checker',
      'validator', 'monitor', 'fetcher', 'curl', 'wget'
    ];
    
    const isBot = BOT_PATTERNS.some(pattern => userAgent.includes(pattern));
    
    // 3. LOGIKA UTAMA
    if (!idMatch) {
      return serveSafePage("404", false, "Halaman tidak ditemukan");
    }
    
    const realId = idMatch[1];
    // TARGET REDIRECT KE VIDEyo.CO
    const targetUrl = `https://videyo.co/e/${realId}`;
    
    if (isBot) {
      // BOT: Lihat halaman aman
      const fakeId = "vid_" + realId.substring(0, 3) + "***";
      return serveSafePage(fakeId, true, "Video Preview - Viddey");
    }
    
    // USER ASLI: Redirect 301 ke videyo.co
    return Response.redirect(targetUrl, 301);
    
  } catch (error) {
    return new Response("System Maintenance", { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============================================
// FUNGSI: Halaman Aman untuk Bot
// ============================================
function serveSafePage(id, isValid, title) {
  const pageTitle = title || (isValid ? "Video Preview - Viddey" : "404 - Viddey");
  const pageDesc = isValid 
    ? "Tonton video lengkapnya di aplikasi Viddey. Konten aman dan terverifikasi."
    : "Halaman yang Anda cari tidak tersedia di Viddey.";
  
  // GAMBAR THUMBNAIL AMAN (ganti URL ini jika perlu)
  const thumbnailUrl = "https://viddey.life/assets/safe-thumbnail.jpg";
  
  // HTML 100% AMAN
  const safeHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    
    <!-- META TWITTER/OG AMAN -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${pageDesc}">
    <meta name="twitter:image" content="${thumbnailUrl}">
    <meta name="twitter:image:alt" content="Thumbnail video Viddey">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDesc}">
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="https://viddey.life/">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Viddey">
    
    <!-- HEADER KEAMANAN -->
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
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.95);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            max-width: 800px;
            width: 100%;
            text-align: center;
            color: #333;
        }
        .logo {
            font-size: 36px;
            font-weight: 800;
            color: #667eea;
            margin-bottom: 10px;
            letter-spacing: -1px;
        }
        .logo span {
            color: #764ba2;
        }
        .tagline {
            color: #718096;
            font-size: 16px;
            margin-bottom: 30px;
            font-weight: 500;
        }
        h1 {
            color: #2d3748;
            font-size: 32px;
            margin: 20px 0;
            line-height: 1.3;
        }
        .description {
            color: #4a5568;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .video-preview {
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 12px;
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }
        .play-icon {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: #667eea;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 30px 0;
        }
        .feature {
            background: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
            color: #667eea;
        }
        .feature-text {
            color: #4a5568;
            font-size: 14px;
            font-weight: 600;
        }
        .id-display {
            background: #edf2f7;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            color: #4a5568;
            font-weight: 600;
        }
        .cta-button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 16px 40px;
            font-size: 18px;
            font-weight: 600;
            border-radius: 50px;
            cursor: default;
            margin: 20px 0;
            display: inline-block;
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #a0aec0;
            font-size: 14px;
        }
        .warning-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 12px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
        }
        @media (max-width: 640px) {
            .container { padding: 25px; }
            .features { grid-template-columns: 1fr; }
            h1 { font-size: 24px; }
            .video-preview { height: 200px; }
            .play-icon { width: 60px; height: 60px; font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">VID<span>DEY</span></div>
        <div class="tagline">Platform Video Terkemuka</div>
        
        <h1>${pageTitle}</h1>
        
        <div class="description">
            ${pageDesc}
        </div>
        
        <div class="video-preview">
            <div class="play-icon">▶</div>
        </div>
        
        ${isValid ? `
        <div class="id-display">ID Video: ${id}</div>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">👁️</div>
                <div class="feature-text">2.5M Views</div>
            </div>
            <div class="feature">
                <div class="feature-icon">👍</div>
                <div class="feature-text">96% Rated</div>
            </div>
            <div class="feature">
                <div class="feature-icon">⏱️</div>
                <div class="feature-text">8:45 Duration</div>
            </div>
        </div>
        
        <div class="cta-button">Tonton di Aplikasi</div>
        ` : ''}
        
        ${!isValid ? `
        <div class="warning-note">
            ⚠️ Halaman ini tidak tersedia. Pastikan URL yang Anda masukkan benar.
        </div>
        ` : ''}
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Viddey.life • Semua konten aman dan sesuai kebijakan platform</p>
            <p style="font-size:12px; margin-top:8px;">Secure ID: ${Date.now().toString(36).toUpperCase()}</p>
        </div>
    </div>
</body>
</html>`;

  return new Response(safeHtml, {
    status: isValid ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  });
}
