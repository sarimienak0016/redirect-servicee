export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    // ADVANCED BOT DETECTION
    const userAgent = request.headers.get('user-agent') || '';
    const accept = request.headers.get('accept') || '';
    
    const isTwitterBot = userAgent.includes('Twitterbot');
    const isOtherBot = detectOtherBots(userAgent, accept);
    
    console.log(`🤖 Bot Detection - Twitter: ${isTwitterBot}, Other: ${isOtherBot}`);

    if (isTwitterBot || isOtherBot) {
      // BOTS: Kasih SAFE CONTENT (NO REDIRECT)
      console.log(`🛡️ Serving SAFE content to bot`);
      return serveSafeContent(path, host);
    } else {
      // HUMANS ONLY: Redirect dengan delay
      console.log(`👤 Redirecting human user`);
      return serveHumanRedirect(path, host);
    }
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}

// ===== ADVANCED BOT DETECTION =====
function detectOtherBots(userAgent, accept) {
  const botPatterns = [
    /Twitterbot/i, /facebookexternalhit/i, /WhatsApp/i,
    /TelegramBot/i, /Discordbot/i, /Slackbot/i,
    /Googlebot/i, /Bingbot/i, /YandexBot/i,
    /bot/i, /crawler/i, /spider/i, /monitoring/i
  ];
  
  const isBotByUA = botPatterns.some(pattern => pattern.test(userAgent));
  const hasSimpleAccept = accept.includes('*/*');
  
  return isBotByUA || hasSimpleAccept;
}

// ===== SAFE CONTENT FOR BOTS =====
function serveSafeContent(path, host) {
  const pathId = path.split('/').pop() || 'content';
  
  const safeHtml = `<!DOCTYPE html>
<html>
<head>
    <title>StreamVid - Video Platform</title>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="StreamVid - Premium Video Content">
    <meta name="twitter:description" content="Watch high-quality video content on StreamVid platform">
    <meta property="og:title" content="StreamVid - Video Platform">
    <meta property="og:description" content="Premium video streaming service">
    <meta property="og:url" content="https://${host}${path}">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .logo { font-size: 3em; margin-bottom: 20px; }
        h1 { margin-bottom: 10px; font-size: 1.8em; }
        .content-id {
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-family: monospace;
            margin: 15px 0;
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
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🎬</div>
        <h1>StreamVid Platform</h1>
        <p>Premium Video Streaming Service</p>
        
        <div class="content-id">ID: ${pathId}</div>
        
        <div class="features">
            <div class="feature">🔒 Secure</div>
            <div class="feature">📱 Mobile</div>
            <div class="feature">⚡ Fast</div>
            <div class="feature">🌐 Global</div>
        </div>
        
        <p>High-quality video content optimized for all devices</p>
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
function serveHumanRedirect(path, host) {
  // TARGET URL MAPPING
  let targetUrl;
  
  if (path.startsWith('/d/')) {
    const id = path.substring(3);
    targetUrl = `https://vide.ws/e/${id}`;
  }
  else if (path.startsWith('/f/')) {
    const id = path.substring(3);
    targetUrl = `https://vide.ws/f/${id}`;
  }
  else {
    targetUrl = 'https://vide.ws/';
  }

  // REDIRECT DENGAN VERIFICATION STYLE (bukan instant)
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>StreamVid - Verification</title>
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
        .verification {
            text-align: center;
            padding: 40px;
            background: #2a2a2a;
            border-radius: 10px;
            border: 1px solid #444;
        }
        .spinner {
            border: 3px solid #333;
            border-top: 3px solid #00ff88;
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
            background: #00ff88;
            width: 0%;
            animation: load 3s ease-in-out;
        }
        @keyframes load {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="verification">
        <div class="spinner"></div>
        <h3>Verifying Access...</h3>
        <p>Preparing your content securely</p>
        
        <div class="progress">
            <div class="progress-bar"></div>
        </div>
        
        <p style="font-size: 12px; color: #888; margin-top: 20px;">
            This helps ensure content security
        </p>
    </div>
    
    <script>
        // REDIRECT SETELAH 3 DETIK (bukan instant)
        setTimeout(function() {
            window.location.href = "${targetUrl}";
        }, 3000);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
