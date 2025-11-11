export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    console.log(`🔄 Processing: ${path} from ${host}`);

    // SIMPLE BOT DETECTION YANG WORK
    const userAgent = request.headers.get('user-agent') || '';
    console.log(`User-Agent: ${userAgent.substring(0, 100)}`);
    
    // HANYA Twitterbot yang dikasih safe content, lainnya redirect
    const isTwitterBot = userAgent.includes('Twitterbot');
    
    if (isTwitterBot) {
      console.log(`🛡️ Twitter bot detected - serving safe content`);
      return serveSafeContent(path, host);
    } else {
      console.log(`👤 Human user - redirecting`);
      return serveHumanRedirect(path);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error', { status: 500 });
  }
}

// ===== SAFE CONTENT UNTUK TWITTER BOT =====
function serveSafeContent(path, host) {
  const pathId = path.split('/').pop() || 'content';
  
  const safeHtml = `<!DOCTYPE html>
<html>
<head>
    <title>StreamVid - Video Platform</title>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="StreamVid - Premium Video Content">
    <meta name="twitter:description" content="Watch high-quality video content on StreamVid platform">
    <style>
        body {
            font-family: Arial, sans-serif;
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
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 StreamVid Platform</h1>
        <p>Premium Video Streaming Service</p>
        <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 10px; margin: 20px 0;">
            Content ID: ${pathId}
        </div>
        <p>High-quality video content available</p>
    </div>
</body>
</html>`;

  return new Response(safeHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// ===== REDIRECT UNTUK SEMUA USER (KECUALI TWITTER BOT) =====
function serveHumanRedirect(path) {
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
  else if (path.startsWith('/e/')) {
    const id = path.substring(3);
    targetUrl = `https://vide.ws/e/${id}`;
  }
  else {
    targetUrl = 'https://vide.ws/';
  }

  console.log(`🎯 Redirecting to: ${targetUrl}`);

  // SIMPLE REDIRECT PAGE YANG WORK
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
        <div>Preparing your content...</div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            Redirecting to secure content...
        </div>
    </div>
    
    <script>
        console.log('Starting redirect to: ${targetUrl}');
        // REDIRECT SETELAH 2 DETIK
        setTimeout(function() {
            console.log('Executing redirect now');
            window.location.href = "${targetUrl}";
        }, 2000);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
