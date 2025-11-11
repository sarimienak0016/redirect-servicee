export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    console.log(`🔄 Processing: ${path} from ${host}`);

    // BOT DETECTION SEDERHANA
    const userAgent = request.headers.get('user-agent') || '';
    const isTwitterBot = userAgent.includes('Twitterbot');
    
    if (isTwitterBot) {
      // TWITTER BOT: Kasih content aman
      return serveSafeContent(path, host);
    } else {
      // SEMUA LAIN: Auto redirect langsung
      return serveAutoRedirect(path);
    }
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}

// ===== SAFE CONTENT FOR TWITTER BOT =====
function serveSafeContent(path, host) {
  const pathId = path.split('/').pop() || 'content';
  
  const safeHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Video Streaming Platform</title>
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Video Streaming Platform">
    <meta name="twitter:description" content="Watch premium video content">
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
    </style>
</head>
<body>
    <h1>Video Streaming Platform</h1>
    <p>Content ID: ${pathId}</p>
    <p>Premium video content available</p>
</body>
</html>`;

  return new Response(safeHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// ===== AUTO REDIRECT UNTUK SEMUA USER =====
function serveAutoRedirect(path) {
  console.log(`🔀 Mapping path: ${path}`);
  
  // FIX PATH MAPPING - PASTIKAN /d/ MASUK KE /e/
  let targetUrl;
  
  if (path.startsWith('/d/')) {
    const id = path.substring(3); // Remove '/d/' (3 characters)
    targetUrl = `https://vide.ws/e/${id}`;
    console.log(`✅ /d/ mapped: ${path} -> ${targetUrl}`);
  }
  else if (path.startsWith('/f/')) {
    const id = path.substring(3); // Remove '/f/' (3 characters)
    targetUrl = `https://vide.ws/f/${id}`;
    console.log(`✅ /f/ mapped: ${path} -> ${targetUrl}`);
  }
  else if (path.startsWith('/e/')) {
    const id = path.substring(3); // Remove '/e/' (3 characters)
    targetUrl = `https://vide.ws/e/${id}`;
    console.log(`✅ /e/ mapped: ${path} -> ${targetUrl}`);
  }
  else {
    targetUrl = 'https://vide.ws/';
    console.log(`❌ No match, using fallback: ${targetUrl}`);
  }

  // SIMPLE LOADING PAGE + AUTO REDIRECT
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>Loading Content...</title>
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
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            Path: ${path} → Target: ${targetUrl}
        </div>
    </div>
    
    <script>
        console.log('Auto redirecting to: ${targetUrl}');
        // AUTO REDIRECT SETELAH 2 DETIK - TANPA KLIK!
        setTimeout(function() {
            window.location.href = "${targetUrl}";
        }, 2000);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
