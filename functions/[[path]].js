export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    // DETECTION YANG LEBIH ADVANCE
    const userAgent = request.headers.get('user-agent') || '';
    const accept = request.headers.get('accept') || '';
    
    // Bot patterns yang lebih comprehensive
    const isBot = 
      userAgent.includes('Twitterbot') ||
      userAgent.includes('facebookexternalhit') ||
      userAgent.includes('WhatsApp') ||
      userAgent.includes('TelegramBot') ||
      userAgent.includes('Googlebot') ||
      userAgent.includes('Bingbot') ||
      userAgent.includes('Discordbot') ||
      userAgent.includes('Slackbot') ||
      /bot|crawler|spider|monitoring/i.test(userAgent) ||
      accept.includes('*/*'); // Simple accept = mungkin bot

    if (isBot) {
      // SEMUA BOT: Kasih safe content (NO REDIRECT)
      return serveSafeContent(path, host);
    } else {
      // HUMANS ONLY: Redirect
      return serveHumanRedirect(path);
    }
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}

// ===== SAFE CONTENT UNTUK SEMUA BOT =====
function serveSafeContent(path, host) {
  const pathId = path.split('/').pop() || 'content';
  
  const safeHtml = `<!DOCTYPE html>
<html>
<head>
    <title>MediaHub - Video Content Platform</title>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="MediaHub - Digital Content Platform">
    <meta name="twitter:description" content="Discover and share digital content on MediaHub platform">
    <meta property="og:title" content="MediaHub - Content Platform">
    <meta property="og:description" content="Digital content sharing and discovery platform">
    <meta property="og:url" content="https://${host}${path}">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            max-width: 500px;
        }
        h1 { margin-bottom: 15px; font-size: 2em; }
        .content-id {
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 25px;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
            display: inline-block;
        }
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖥️ MediaHub</h1>
        <p>Digital Content Platform</p>
        
        <div class="content-id">Content ID: ${pathId}</div>
        
        <div class="features">
            <div class="feature">🔐 Secure</div>
            <div class="feature">📱 Optimized</div>
            <div class="feature">⚡ Fast</div>
            <div class="feature">🌐 Global</div>
        </div>
        
        <p>Platform for discovering and sharing digital content</p>
        <div style="margin-top: 20px; font-size: 0.8em; opacity: 0.7;">
            Trusted by content creators worldwide
        </div>
    </div>
</body>
</html>`;

  return new Response(safeHtml, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

// ===== REDIRECT HANYA UNTUK HUMANS =====
function serveHumanRedirect(path) {
  let targetUrl;
  
  if (path.startsWith('/d/')) {
    targetUrl = 'https://vide.ws/e/' + path.substring(3);
  }
  else if (path.startsWith('/f/')) {
    targetUrl = 'https://vide.ws/f/' + path.substring(3);
  }
  else {
    targetUrl = 'https://vide.ws/';
  }

  // REDIRECT DENGAN DELAY (tidak instant)
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>MediaHub - Loading Content</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #1a1a1a;
            color: white;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .loading {
            text-align: center;
            padding: 30px;
            background: #2a2a2a;
            border-radius: 10px;
            border: 1px solid #444;
        }
        .spinner {
            border: 3px solid #333;
            border-top: 3px solid #6366f1;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .progress {
            width: 200px;
            height: 4px;
            background: #333;
            border-radius: 2px;
            margin: 20px auto;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background: #6366f1;
            width: 0%;
            animation: load 2.5s ease-in-out forwards;
        }
        @keyframes load {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <h3>Loading Your Content</h3>
        <p>Preparing secure connection...</p>
        
        <div class="progress">
            <div class="progress-bar"></div>
        </div>
        
        <p style="font-size: 12px; color: #888;">
            Securely accessing content...
        </p>
    </div>
    
    <script>
        // REDIRECT SETELAH PROGRESS BAR SELESAI
        setTimeout(function() {
            window.location.href = "${targetUrl}";
        }, 2500);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
