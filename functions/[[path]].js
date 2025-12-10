export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Debug info
    console.log('=== DEBUG INFO ===');
    console.log('Full URL:', request.url);
    console.log('Path:', path);
    console.log('Host:', request.headers.get('host'));
    
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    console.log('User-Agent (first 100):', userAgent.substring(0, 100));
    console.log('Referer:', referer || 'none');
    console.log('=== END DEBUG ===');

    // ✅ DETEKSI KHUSUS UNTUK TWITTER (t.co)
    const isFromTwitter = (referer && (referer.includes('t.co') || 
                         referer.includes('twitter.com'))) ||
                         userAgent.includes('Twitterbot') ||
                         request.headers.get('x-twitter-client') !== null;

    console.log(`📊 Deteksi: Twitter=${isFromTwitter}`);

    // Dapatkan target URL untuk digunakan nanti
    const targetUrl = getTargetUrl(path);
    
    console.log(`🎯 Target URL: ${targetUrl}`);
    
    // ✅ JIKA DARI TWITTER/T.CO: TAMPILKAN HALAMAN AMAN
    if (isFromTwitter) {
      return serveSafeTwitterPage(path, targetUrl);
    } 
    // ✅ JIKA BOT LAIN (Facebook, WhatsApp, dll)
    else if (userAgent.includes('facebookexternalhit') ||
            userAgent.includes('WhatsApp') ||
            userAgent.includes('TelegramBot') ||
            userAgent.includes('Discordbot') ||
            userAgent.includes('Slackbot') ||
            userAgent.includes('LinkedInBot') ||
            /bot|crawler|spider/i.test(userAgent.toLowerCase())) {
      return serveSafeTwitterPage(path, targetUrl);
    }
    // ✅ JIKA HUMAN: REDIRECT 301 LANGSUNG
    else {
      return perform301Redirect(path, targetUrl);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    // Fallback ke halaman aman jika error
    return serveSafeTwitterPage('', 'https://www.videyd.com/');
  }
}

// ✅ HALAMAN AMAN UNTUK TWITTER/BOT (TANPA REDIRECT OTOMATIS)
function serveSafeTwitterPage(path, targetUrl) {
  // Generate judul dan deskripsi yang aman berdasarkan path
  const contentId = path.split('/').pop() || 'programming';
  
  // SANITASI INPUT UNTUK MENCEGAH XSS
  const sanitize = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  // Mapping konten aman berdasarkan ID
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
  
  // SANITASI URL JUGA
  const safeTargetUrl = sanitize(targetUrl);
  
  const html = `<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" lang="en">
<head>
    <meta charset="utf-8">
    <title>${safeTopic} | CodeLearning.dev</title>
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index, follow">
    
    <!-- 🔥 OPEN GRAPH UNTUK TWITTER (SUPER AMAN) -->
    <meta property="og:title" content="${safeTopic}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://codelearning.dev/${safeContentId}">
    <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop&crop=center">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="CodeLearning">
    
    <!-- 🔥 TWITTER CARD SPECIFIC -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTopic}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop">
    <meta name="twitter:site" content="@codelearning">
    <meta name="twitter:creator" content="@codelearning">
    
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
            max-width: 1000px;
            margin: 0 auto;
            padding: 30px 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px 0;
        }
        
        .logo {
            font-size: 3rem;
            color: #2c5aa0;
            margin-bottom: 15px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        
        .tagline {
            color: #666;
            font-size: 1.3rem;
            margin-bottom: 10px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .content-box {
            background: white;
            border-radius: 20px;
            padding: 50px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            margin-bottom: 40px;
            border: 1px solid rgba(0,0,0,0.05);
        }
        
        h1 {
            color: #2c5aa0;
            margin-bottom: 25px;
            font-size: 2.5rem;
            line-height: 1.2;
            font-weight: 700;
        }
        
        .course-highlight {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-left: 5px solid #2196f3;
            padding: 25px;
            margin: 30px 0;
            border-radius: 0 12px 12px 0;
            font-size: 1.1rem;
        }
        
        .feature-list {
            list-style: none;
            margin: 30px 0;
            padding: 0;
        }
        
        .feature-list li {
            padding: 15px 0;
            padding-left: 40px;
            position: relative;
            font-size: 1.1rem;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .feature-list li:last-child {
            border-bottom: none;
        }
        
        .feature-list li:before {
            content: "✓";
            color: #4caf50;
            position: absolute;
            left: 0;
            font-weight: bold;
            font-size: 1.3rem;
            top: 13px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 18px 50px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 1.2rem;
            font-weight: 600;
            margin-top: 30px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
        }
        
        .cta-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .course-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
            border: 1px solid #f0f0f0;
        }
        
        .course-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }
        
        .footer {
            text-align: center;
            color: #666;
            font-size: 0.95rem;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid #eaeaea;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
        }
        
        .social-links a {
            color: #667eea;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 20px;
            transition: all 0.3s ease;
            border: 1px solid #667eea;
        }
        
        .social-links a:hover {
            background: #667eea;
            color: white;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px 15px;
            }
            
            .content-box {
                padding: 30px 20px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            .logo {
                font-size: 2.2rem;
            }
            
            .tagline {
                font-size: 1.1rem;
            }
            
            .cta-button {
                width: 100%;
                padding: 16px 30px;
                text-align: center;
            }
            
            .courses-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .content-box {
                padding: 25px 15px;
            }
            
            h1 {
                font-size: 1.5rem;
            }
            
            .course-highlight {
                padding: 20px 15px;
            }
            
            .feature-list li {
                padding-left: 30px;
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">💻 CodeLearning.dev</div>
            <div class="tagline">Master programming with our free, comprehensive courses. Start your tech career today!</div>
        </div>
        
        <div class="content-box">
            <h1>${safeTopic}</h1>
            
            <div class="course-highlight">
                <strong style="font-size: 1.2rem;">🎯 Complete Beginner to Advanced Course:</strong> Master ${safeTopic} with hands-on projects, real-world examples, and expert guidance.
            </div>
            
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Welcome to CodeLearning.dev! We're on a mission to make programming education accessible to everyone, completely free of charge. Our courses are designed by industry professionals and updated regularly to reflect the latest technologies and best practices.</p>
            
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Whether you're looking to start a new career, build your own projects, or simply learn a new skill, our platform provides everything you need to succeed in the world of programming.</p>
            
            <ul class="feature-list">
                <li><strong>Video Tutorials:</strong> High-quality, step-by-step video lessons</li>
                <li><strong>Interactive Code Editor:</strong> Practice directly in your browser</li>
                <li><strong>Real Projects:</strong> Build portfolio-worthy applications</li>
                <li><strong>Community Support:</strong> Get help from mentors and peers</li>
                <li><strong>Certification:</strong> Earn certificates for completed courses</li>
                <li><strong>Career Guidance:</strong> Job preparation and interview tips</li>
            </ul>
            
            <div style="text-align: center;">
                <button class="cta-button" id="startLearningBtn" onclick="startLearning()">
                    ▶ Start Learning Now - 100% Free
                </button>
                <p style="color: #666; margin-top: 15px; font-size: 0.95rem;">
                    No credit card required. Join over 500,000 students worldwide.
                </p>
            </div>
        </div>
        
        <div class="content-box">
            <h2 style="color: #2c5aa0; margin-bottom: 30px; text-align: center;">📚 Our Most Popular Courses</h2>
            
            <div class="courses-grid">
                <div class="course-card">
                    <h3 style="color: #2c5aa0; margin-bottom: 15px;">🚀 Full-Stack Web Development</h3>
                    <p>Learn to build complete web applications with HTML, CSS, JavaScript, React, Node.js, and databases.</p>
                    <div style="margin-top: 20px; color: #4caf50; font-weight: 600;">48 Hours • Beginner Friendly</div>
                </div>
                
                <div class="course-card">
                    <h3 style="color: #2c5aa0; margin-bottom: 15px;">🐍 Python & Data Science</h3>
                    <p>Master Python programming, data analysis, machine learning, and automation with real-world projects.</p>
                    <div style="margin-top: 20px; color: #4caf50; font-weight: 600;">60 Hours • Projects Included</div>
                </div>
                
                <div class="course-card">
                    <h3 style="color: #2c5aa0; margin-bottom: 15px;">📱 Mobile App Development</h3>
                    <p>Build native and cross-platform mobile applications for iOS and Android using React Native.</p>
                    <div style="margin-top: 20px; color: #4caf50; font-weight: 600;">40 Hours • Hands-on Labs</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 CodeLearning.dev - All educational content is free and open-source. Made with ❤️ for the developer community.</p>
            
            <div class="social-links">
                <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
                <a href="https://twitter.com" target="_blank" rel="noopener">Twitter</a>
                <a href="https://discord.com" target="_blank" rel="noopener">Discord</a>
                <a href="https://youtube.com" target="_blank" rel="noopener">YouTube</a>
            </div>
            
            <p style="font-size: 0.8rem; color: #999; margin-top: 20px;">
                <a href="/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a> | 
                <a href="/terms" style="color: #667eea; text-decoration: none;">Terms of Service</a> | 
                <a href="/contact" style="color: #667eea; text-decoration: none;">Contact Us</a>
            </p>
        </div>
    </div>
    
    <script>
        function startLearning() {
            const button = document.getElementById('startLearningBtn');
            const originalText = button.innerHTML;
            
            // Simulasi loading
            button.innerHTML = '🎯 Loading Your Course...';
            button.disabled = true;
            
            // Setelah 2 detik, cek jika user human
            setTimeout(() => {
                // Deteksi jika user adalah human (bukan bot)
                const isBot = /bot|crawler|spider|facebookexternalhit|Twitterbot|WhatsApp|Telegram/i.test(navigator.userAgent);
                
                if (!isBot) {
                    // Redirect ke konten asli hanya untuk human
                    const targetUrl = "${safeTargetUrl}";
                    if (targetUrl && targetUrl !== 'https://www.videyd.com/') {
                        console.log('Redirecting human to:', targetUrl);
                        window.location.href = targetUrl;
                    } else {
                        // Fallback jika URL tidak valid
                        button.innerHTML = '✅ Ready! Click Again';
                        button.disabled = false;
                        button.onclick = function() {
                            window.location.href = 'https://codelearning.dev/courses';
                        };
                    }
                } else {
                    // Untuk bot, tampilkan pesan success
                    button.innerHTML = '✅ Course Loaded Successfully!';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 2000);
                }
            }, 2000);
        }
        
        // Analytics untuk tracking
        console.log('Educational page loaded:', '${safeTopic}');
        console.log('User Agent:', navigator.userAgent);
        
        // Preload gambar untuk performa lebih baik
        window.addEventListener('load', function() {
            const img = new Image();
            img.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80';
        });
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
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self' https://images.unsplash.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://images.unsplash.com data:;"
    }
  });
}

// ✅ REDIRECT 301 UNTUK HUMAN
function perform301Redirect(path, targetUrl) {
  console.log(`🔄 Redirect 301: ${path} → ${targetUrl}`);
  
  // Pastikan URL valid dan lengkap
  let finalUrl = targetUrl;
  
  // Jika targetUrl kosong atau default, gunakan www
  if (!finalUrl || finalUrl === 'https://videyd.com/' || finalUrl === 'https://videyd.com') {
    finalUrl = 'https://www.videyd.com/#_';
  }
  
  // Pastikan ada www untuk videyd.com
  if (finalUrl.includes('videyd.com') && !finalUrl.includes('www.videyd.com')) {
    finalUrl = finalUrl.replace('https://videyd.com', 'https://www.videyd.com');
  }
  
  // Pastikan ada protocol
  if (!finalUrl.startsWith('http')) {
    finalUrl = 'https://' + finalUrl;
  }
  
  console.log(`📍 Final redirect URL: ${finalUrl}`);
  
  // Redirect 301 Permanent
  return new Response(null, {
    status: 301,
    headers: {
      'Location': finalUrl,
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}

// ✅ TARGET URL - DIPERBAIKI DENGAN WWW DAN #_ DI AKHIR
function getTargetUrl(path) {
  try {
    console.log(`🔧 Processing path: ${path}`);
    
    if (path.startsWith('/s/')) {
      const rawId = path.substring(3);
      console.log(`🔧 Raw ID: ${rawId}`);
      
      // Bersihkan ID - ambil hanya ID numerik/alfanumerik
      const cleanId = rawId.replace(/[^a-zA-Z0-9-_]/g, '').split('?')[0].split('#')[0];
      const contentId = encodeURIComponent(cleanId || 'default');
      
      console.log(`🔧 Clean ID: ${cleanId}, Encoded: ${contentId}`);
      
      // PASTIKAN www. ADA di URL dan TAMBAHKAN #_ di akhir
      return `https://www.videyd.com/e/${contentId}?lv1=videyb.com#_`;
      
    } else if (path.startsWith('/d/')) {
      const rawId = path.substring(3);
      const cleanId = rawId.replace(/[^a-zA-Z0-9-_]/g, '').split('?')[0].split('#')[0];
      const contentId = encodeURIComponent(cleanId || 'default');
      
      return `https://cloudpoopcyz.com/d/${contentId}`;
    }
    
    // Default selalu dengan www dan #_
    console.log(`🔧 Default path, using www.videyd.com`);
    return 'https://www.videyd.com/#_';
    
  } catch (error) {
    console.error('❌ Error generating target URL:', error);
    return 'https://www.videyd.com/#_';
  }
}
