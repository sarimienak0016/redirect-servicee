export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    const userAgent = request.headers.get('user-agent') || '';
    console.log(`User-Agent: ${userAgent.substring(0, 80)}`);

    // BOT DETECTION YANG LEBIH SPECIFIC
    // HANYA detect bot-bot yang jelas-jelas bot
    const isDefiniteBot = 
      userAgent.includes('Twitterbot') ||           // Twitter
      userAgent.includes('facebookexternalhit') ||  // Facebook
      userAgent.includes('WhatsApp') ||            // WhatsApp
      userAgent.includes('TelegramBot') ||         // Telegram
      userAgent.includes('Discordbot') ||          // Discord
      userAgent.includes('Slackbot') ||            // Slack
      userAgent.includes('Googlebot') ||           // Google
      userAgent.includes('Bingbot') ||             // Bing
      userAgent.includes('YandexBot') ||           // Yandex
      userAgent.includes('DuckDuckBot') ||         // DuckDuckGo
      userAgent.includes('LinkedInBot') ||         // LinkedIn
      /crawler|spider|monitoring/i.test(userAgent); // General crawlers

    console.log(`Is Bot: ${isDefiniteBot}`);

    if (isDefiniteBot) {
      // BOT: Kasih safe content (STUCK di sini)
      console.log(`🛑 Bot detected - serving safe content`);
      return serveSafeContent(path, host);
    } else {
      // HUMAN: Redirect
      console.log(`👤 Human detected - redirecting`);
      return serveHumanRedirect(path);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error', { status: 500 });
  }
}

// ===== SAFE CONTENT UNTUK BOT (STUCK DI SINI) =====
function serveSafeContent(path, host) {
  const pathId = path.split('/').pop() || 'content';
  
  const safeHtml = `<!DOCTYPE html>
<html>
<head>
    <title>MediaHub - Digital Platform</title>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="MediaHub - Content Platform">
    <meta name="twitter:description" content="Digital content platform for creators and viewers">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
        }
        h1 { 
            color: #2c5aa0; 
            margin-bottom: 15px; 
        }
        .content-id {
            background: #e9ecef;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Courier New', monospace;
            color: #495057;
            margin: 15px 0;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖥️ MediaHub</h1>
        <p>Digital Content Platform</p>
        
        <div class="content-id">Content ID: ${pathId}</div>
        
        <p>Platform for digital content sharing and discovery</p>
        <div style="margin-top: 20px; color: #6c757d; font-size: 0.9em;">
            Connect with creators worldwide
        </div>
    </div>
</body>
</html>`;

  return new Response(safeHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// ===== REDIRECT UNTUK HUMAN =====
function serveHumanRedirect(path) {
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

  console.log(`🎯 Redirecting human to: ${targetUrl}`);

  // SIMPLE REDIRECT YANG WORK
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }
        .loading {
            text-align: center;
            padding: 20px;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <div>Loading your content...</div>
    </div>
    
    <script>
        // AUTO REDIRECT - TANPA KLIK
        setTimeout(function() {
            console.log('Redirecting now to: ${targetUrl}');
            window.location.href = "${targetUrl}";
        }, 1500);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
