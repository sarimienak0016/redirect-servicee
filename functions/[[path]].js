export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    // ✅ STEALTH BOT DETECTION
    const isLikelyBot = userAgent.includes('Twitterbot') || 
                       userAgent.includes('facebookexternalhit') ||
                       userAgent.includes('WhatsApp') ||
                       referer.includes('t.co');

    console.log(`🤖 Bot detected: ${isLikelyBot}`);

    if (isLikelyBot) {
      // 🛡️ BOT: Safe content dengan meta redirect
      return serveBotContent(path);
    } else {
      // 👤 HUMAN: Redirect dengan delay
      return serveHumanRedirect(path);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error', { status: 500 });
  }
}

// ✅ BOT CONTENT - AMAN & NATURAL
function serveBotContent(path) {
  const contentId = path.split('/').pop() || 'default';
  const targetUrl = getTargetUrl(path);
  
  // Random delay 2-4 detik untuk bot
  const delay = Math.floor(Math.random() * 2) + 2;
  
  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#">
<head>
    <title>Content Viewer</title>
    <meta charset="utf-8">
    
    <!-- 🛡️ SAFE META TAGS -->
    <meta property="og:title" content="Content Viewer">
    <meta property="og:description" content="View and manage your content">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Content Viewer">
    
    <!-- 🛡️ TWITTER CARD SAFE -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Content Viewer">
    <meta name="twitter:description" content="View and manage your content">
    
    <!-- 🎯 META REFRESH -->
    <meta http-equiv="refresh" content="${delay};url=${targetUrl}">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            background: rgba(255,255,255,0.95);
            color: #333;
            padding: 50px 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 500px;
            backdrop-filter: blur(10px);
        }
        h1 {
            color: #2c5aa0;
            margin-bottom: 15px;
            font-size: 1.8em;
        }
        .loading {
            margin: 25px 0;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        .content-id {
            background: #f8f9fa;
            padding: 10px 20px;
            border-radius: 25px;
            font-family: 'Monaco', 'Consolas', monospace;
            color: #495057;
            margin: 20px 0;
            display: inline-block;
            border: 1px solid #e9ecef;
        }
        .info {
            color: #6c757d;
            font-size: 0.9em;
            margin-top: 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 Content Viewer</h1>
        <p>Preparing your content experience...</p>
        
        <div class="loading">
            <div class="spinner"></div>
        </div>
        
        <div class="content-id">ID: ${contentId}</div>
        
        <p>Optimizing playback and quality settings</p>
        
        <div class="info">
            Redirecting to content in ${delay} seconds...
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

// ✅ HUMAN REDIRECT - SIMPLE & CLEAN
function serveHumanRedirect(path) {
  const targetUrl = getTargetUrl(path);
  
  // Random delay 1-2 detik untuk human
  const delay = Math.floor(Math.random() * 1) + 1;
  
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="${delay};url=${targetUrl}">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }
        .loader {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        .text {
            color: #666;
            margin: 10px 0;
        }
        .small {
            font-size: 0.8em;
            color: #999;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loader">
        <div class="spinner"></div>
        <div class="text">Loading your content...</div>
        <div class="small">Please wait</div>
    </div>
    
    <script>
        // Fallback redirect
        setTimeout(function() {
            window.location.href = "${targetUrl}";
        }, ${delay * 1000});
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// ✅ GET TARGET URL
function getTargetUrl(path) {
  if (path.startsWith('/d/')) {
    return 'https://vide20.com/e/' + path.substring(3);
  } else if (path.startsWith('/f/')) {
    return 'https://vide20.com/f/' + path.substring(3);
  } else {
    return 'https://vide20.com/';
  }
}
