export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    // ✅ BOT DETECTION AMAN
    const isFromSocialMedia = referer.includes('twitter.com') || 
                             referer.includes('t.co') ||
                             userAgent.includes('Twitterbot') ||
                             userAgent.includes('facebookexternalhit') ||
                             userAgent.includes('WhatsApp') ||
                             userAgent.includes('TelegramBot');

    console.log(`🔍 From Social Media: ${isFromSocialMedia}`);

    if (isFromSocialMedia) {
      // 🛡️ KONTEN NETRAL UNTUK SOCIAL MEDIA
      console.log(`🛡️ Serving NEUTRAL content for social media`);
      return serveNeutralContent(path);
    } else {
      // HUMAN: Redirect langsung
      console.log(`👤 Regular visitor - redirecting`);
      return performRedirect(path);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error', { status: 500 });
  }
}

// ✅ KONTEN SUPER NETRAL & AMAN
function serveNeutralContent(path) {
  const contentId = path.split('/').pop() || 'default';
  
  // 🎯 VARIASI JUDUL & DESKRIPSI AMAN
  const safeTitles = [
    "Digital Platform",
    "System Portal", 
    "Service Gateway",
    "Platform Digital",
    "Access Portal"
  ];
  
  const safeDescriptions = [
    "Platform untuk layanan digital terintegrasi",
    "Sistem akses untuk berbagai kebutuhan",
    "Gateway layanan digital modern", 
    "Portal akses terpadu",
    "Platform solusi digital"
  ];
  
  const randomTitle = safeTitles[Math.floor(Math.random() * safeTitles.length)];
  const randomDesc = safeDescriptions[Math.floor(Math.random() * safeDescriptions.length)];

  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#">
<head>
    <title>${randomTitle}</title>
    <meta charset="utf-8">
    
    <!-- 🛡️ META TAG NETRAL -->
    <meta property="og:title" content="${randomTitle}">
    <meta property="og:description" content="${randomDesc}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Platform">
    
    <!-- 🛡️ TWITTER CARD NETRAL -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${randomTitle}">
    <meta name="twitter:description" content="${randomDesc}">
    
    <!-- 🛡️ NO SUSPICIOUS KEYWORDS -->
    <meta name="description" content="${randomDesc}">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 1.6;
        }
        .container {
            background: white;
            padding: 50px 40px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #495057;
            margin-bottom: 16px;
            font-size: 1.6em;
            font-weight: 600;
        }
        .code {
            background: #f1f3f5;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: 'Monaco', 'Consolas', monospace;
            color: #495057;
            margin: 20px 0;
            display: inline-block;
            font-size: 0.95em;
            border: 1px solid #e9ecef;
        }
        .description {
            color: #6c757d;
            margin-bottom: 20px;
            font-size: 1.05em;
        }
        .note {
            color: #868e96;
            font-size: 0.85em;
            margin-top: 25px;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
        }
        .status {
            display: inline-block;
            background: #d8f5d8;
            color: #2b8a3e;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="status">System Active</div>
        <h1>${randomTitle}</h1>
        <p class="description">${randomDesc}</p>
        
        <div class="code">Reference: ${contentId}</div>
        
        <p style="color: #5c636a; font-size: 0.95em;">
            Platform stabil dan terpercaya untuk akses digital
        </p>
        
        <div class="note">
            Layanan tersedia 24/7 • Support terintegrasi
        </div>
    </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

// ✅ REDIRECT CEPAT UNTUK HUMAN
function performRedirect(path) {
  let targetUrl;
  
  if (path.startsWith('/d/')) {
    targetUrl = 'https://vide20.com/e/' + path.substring(3);
  }
  else if (path.startsWith('/f/')) {
    targetUrl = 'https://vide20.com/f/' + path.substring(3);
  }
  else {
    targetUrl = 'https://vide20.com/';
  }

  console.log(`🎯 Redirecting to: ${targetUrl}`);
  
  // Redirect langsung tanpa HTML
  return Response.redirect(targetUrl, 302);
}
