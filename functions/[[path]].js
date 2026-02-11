// functions/[[path]].js - FINAL WORKING VERSION
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
  
  // Skip untuk static assets
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_static/') ||
      url.pathname.match(/\.[a-z]+$/i)) {
    return await context.next();
  }
  
  try {
    return await handleRedirect(request, env, url);
  } catch (error) {
    console.error('Error:', error);
    return createErrorPage();
  }
}

async function handleRedirect(request, env, url) {
  // === PARAMETER CONTROL ===
  const testMode = url.searchParams.has('test');
  const clearMode = url.searchParams.has('clear');
  const directMode = url.searchParams.has('direct');
  const forceMode = url.searchParams.has('force');
  const appMode = url.searchParams.has('app');
  const nocookie = url.searchParams.has('nocookie');
  
  // === CLEAR COOKIE ===
  if (clearMode) {
    return clearCookies();
  }
  
  // === CHECK COOKIE ===
  let cookieExists = false;
  
  if (!nocookie) {
    const cookieHeader = request.headers.get('Cookie') || '';
    cookieExists = cookieHeader.includes('aff_clicked=');
  }
  
  // === DIRECT TO VIDEY.CO ===
  if (directMode || (cookieExists && !forceMode)) {
    return redirectToVidey(env);
  }
  
  // === GET AFFILIATE LINK ===
  const affiliateLinks = await getAffiliateLinks(env);
  
  if (affiliateLinks.length === 0) {
    return redirectToVidey(env);
  }
  
  // Pilih link
  const selectedLink = await selectAffiliateLink(env, affiliateLinks);
  
  // === CREATE REDIRECT PAGE ===
  return createRedirectPage(selectedLink, appMode, testMode, env);
}

async function getAffiliateLinks(env) {
  try {
    // Coba dari KV
    if (env.AFFILIATE_KV) {
      const kvLinks = await env.AFFILIATE_KV.get('affiliate_links', 'json');
      if (kvLinks && kvLinks.length > 0) return kvLinks;
    }
    
    // Coba dari env
    if (env.AFFILIATE_LINKS) {
      return JSON.parse(env.AFFILIATE_LINKS);
    }
    
    // Default links
    return [
      'https://s.shopee.co.id/8AQUp3ZesV',
      'https://s.shopee.co.id/9pYio8K2cw',
      'https://s.shopee.co.id/8pgBcJjIzl',
      'https://s.shopee.co.id/60M0F7txlS',
      'https://s.shopee.co.id/7VAo1N0hIp',
      'https://s.shopee.co.id/9KcSCm0Xb7',
      'https://s.shopee.co.id/3LLF3lT65E',
      'https://s.shopee.co.id/6VIGpbCEoc'
    ];
    
  } catch (error) {
    console.error('Error getting links:', error);
    return [];
  }
}

async function selectAffiliateLink(env, links) {
  if (links.length === 0) return null;
  
  // Simple round robin
  if (env.AFFILIATE_KV) {
    try {
      const lastIndex = await env.AFFILIATE_KV.get('last_index');
      let currentIndex = lastIndex ? parseInt(lastIndex) : 0;
      currentIndex = (currentIndex + 1) % links.length;
      
      await env.AFFILIATE_KV.put('last_index', currentIndex.toString());
      return links[currentIndex];
    } catch (error) {
      // Fallback to random
    }
  }
  
  const randomIndex = Math.floor(Math.random() * links.length);
  return links[randomIndex];
}

function createRedirectPage(affiliateUrl, appMode, testMode, env) {
  const shopeeCode = extractShopeeCode(affiliateUrl);
  const isTest = testMode || false;
  
  // Generate HTML dengan MULTIPLE fallback methods
  const html = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membuka Shopee...</title>
    
    <!-- Shopee App Meta Tags -->
    <meta property="al:android:url" content="shopee://share_product/${shopeeCode}">
    <meta property="al:android:app_name" content="Shopee">
    <meta property="al:android:package" content="com.shopee.id">
    <meta property="al:ios:url" content="shopee://share_product/${shopeeCode}">
    <meta property="al:ios:app_store_id" content="959841443">
    <meta property="al:ios:app_name" content="Shopee">
    <meta property="al:web:url" content="${affiliateUrl}">
    
    <!-- Open Graph -->
    <meta property="og:url" content="${affiliateUrl}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Shopee Indonesia">
    
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      
      .container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        animation: fadeIn 0.5s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .logo {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #ff6b6b, #ffa726);
        border-radius: 20px;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: white;
        font-weight: bold;
      }
      
      h1 {
        color: #333;
        margin-bottom: 10px;
        font-size: 24px;
      }
      
      p {
        color: #666;
        margin-bottom: 30px;
        line-height: 1.6;
      }
      
      .loading {
        width: 50px;
        height: 50px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #ff6b6b;
        border-radius: 50%;
        margin: 0 auto 30px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .button-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
      }
      
      .btn {
        padding: 15px 25px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: block;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #ff6b6b, #ffa726);
        color: white;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
      }
      
      .btn-secondary {
        background: #f5f5f5;
        color: #333;
        border: 2px solid #e0e0e0;
      }
      
      .btn-secondary:hover {
        background: #e8e8e8;
      }
      
      .debug-info {
        margin-top: 30px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
        text-align: left;
        display: ${isTest ? 'block' : 'none'};
      }
      
      .debug-info h3 {
        color: #666;
        margin-bottom: 10px;
        font-size: 14px;
      }
      
      .debug-info code {
        font-family: monospace;
        background: #e9ecef;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 12px;
      }
      
      .timer {
        font-size: 14px;
        color: #888;
        margin-top: 10px;
      }
      
      .cookie-notice {
        background: #e3f2fd;
        padding: 10px 15px;
        border-radius: 10px;
        margin: 20px 0;
        font-size: 14px;
        color: #1565c0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">🛍️</div>
      <h1>Membuka Shopee...</h1>
      <p>Sedang mengarahkan ke aplikasi Shopee. Harap tunggu sebentar.</p>
      
      <div class="loading"></div>
      
      <div class="timer" id="timer">Redirect dalam: <span id="countdown">3</span> detik</div>
      
      <div class="cookie-notice">
        ✓ Cookie telah disimpan. Kembali ke halaman ini akan langsung mengarah ke videy.co
      </div>
      
      <div class="button-group">
        <a href="${affiliateUrl}" class="btn btn-primary" id="directLink">
          Klik di sini jika tidak otomatis redirect
        </a>
        
        <button class="btn btn-secondary" onclick="openInApp()">
          Buka di Aplikasi Shopee
        </button>
      </div>
      
      <div class="debug-info">
        <h3>Debug Info:</h3>
        <p><strong>Affiliate URL:</strong> <code>${affiliateUrl}</code></p>
        <p><strong>Shopee Code:</strong> <code>${shopeeCode}</code></p>
        <p><strong>Mode:</strong> ${appMode ? 'App' : 'Web'}</p>
        <p><strong>Timestamp:</strong> <code>${new Date().toISOString()}</code></p>
      </div>
    </div>

    <script>
      // Set cookie untuk 24 jam
      document.cookie = "aff_clicked=true; max-age=86400; path=/; SameSite=Lax";
      console.log('✓ Cookie set: aff_clicked=true');
      
      const affiliateUrl = "${affiliateUrl}";
      const shopeeCode = "${shopeeCode}";
      const isAppMode = ${appMode ? 'true' : 'false'};
      
      // Multiple methods to open Shopee
      const methods = [
        // Method 1: Direct click simulation (most effective)
        function() {
          console.log('Method 1: Simulating direct click');
          const link = document.getElementById('directLink');
          if (link) {
            link.click();
          }
        },
        
        // Method 2: Window location (standard redirect)
        function() {
          console.log('Method 2: Window location redirect');
          window.location.href = affiliateUrl;
        },
        
        // Method 3: App deep link (for mobile)
        function() {
          if (isAppMode) {
            console.log('Method 3: Trying app deep link');
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isAndroid = /android/i.test(userAgent);
            const isIOS = /iPad|iPhone|iPod/.test(userAgent);
            
            if (isAndroid) {
              window.location.href = 'intent://share_product/' + shopeeCode + '#Intent;scheme=shopee;package=com.shopee.id;end';
            } else if (isIOS) {
              window.location.href = 'shopee://share_product/' + shopeeCode;
            }
          }
        },
        
        // Method 4: Meta refresh (fallback)
        function() {
          console.log('Method 4: Meta refresh fallback');
          const meta = document.createElement('meta');
          meta.httpEquiv = 'refresh';
          meta.content = '0;url=' + affiliateUrl;
          document.head.appendChild(meta);
        },
        
        // Method 5: Iframe trick (bypass some blockers)
        function() {
          console.log('Method 5: Iframe redirect');
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = affiliateUrl;
          document.body.appendChild(iframe);
        }
      ];
      
      // Countdown timer
      let seconds = 3;
      const countdownEl = document.getElementById('countdown');
      const timerInterval = setInterval(() => {
        seconds--;
        countdownEl.textContent = seconds;
        
        if (seconds <= 0) {
          clearInterval(timerInterval);
          executeRedirect();
        }
      }, 1000);
      
      // Execute all redirect methods
      function executeRedirect() {
        console.log('🚀 Executing redirect methods...');
        
        // Try each method with delay
        methods.forEach((method, index) => {
          setTimeout(() => {
            try {
              method();
            } catch (error) {
              console.error('Method ' + (index + 1) + ' failed:', error);
            }
          }, index * 100); // 100ms delay between methods
        });
        
        // Final fallback after 3 seconds
        setTimeout(() => {
          console.log('Final fallback: direct window location');
          window.location.href = affiliateUrl;
        }, 3000);
      }
      
      // Open in app function
      function openInApp() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        
        if (isAndroid) {
          window.location.href = 'intent://share_product/' + shopeeCode + '#Intent;scheme=shopee;package=com.shopee.id;end';
          setTimeout(() => {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.shopee.id';
          }, 1000);
        } else if (isIOS) {
          window.location.href = 'shopee://share_product/' + shopeeCode;
          setTimeout(() => {
            window.location.href = 'https://apps.apple.com/id/app/shopee/id959841443';
          }, 1000);
        } else {
          window.location.href = affiliateUrl;
        }
      }
      
      // Auto-start redirect after page load
      window.addEventListener('load', function() {
        console.log('Page loaded, starting redirect sequence...');
        // Start immediately if in test mode
        if (${isTest ? 'true' : 'false'}) {
          executeRedirect();
        }
      });
      
      // Click anywhere on page to trigger redirect
      document.addEventListener('click', function() {
        console.log('Page clicked, triggering redirect');
        executeRedirect();
      });
      
      // Trigger redirect on touch (for mobile)
      document.addEventListener('touchstart', function() {
        console.log('Touch detected, triggering redirect');
        executeRedirect();
      });
      
    </script>
  </body>
  </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'aff_clicked=true; Max-Age=86400; Path=/; SameSite=Lax',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

function extractShopeeCode(url) {
  const match = url.match(/shopee\.co\.id\/([a-zA-Z0-9]+)/);
  return match ? match[1] : 'unknown';
}

function redirectToVidey(env) {
  const videyUrl = env.TARGET_URL || 'https://videy.co';
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Redirecting to videy.co...</title>
    <script>
      setTimeout(() => {
        window.location.href = "${videyUrl}";
      }, 100);
    </script>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
    <h2>Redirecting to videy.co...</h2>
    <p><a href="${videyUrl}">Click here if not redirected</a></p>
  </body>
  </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

function clearCookies() {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <script>
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
      });
      
      setTimeout(() => {
        window.location.href = '/?test=1';
      }, 1000);
    </script>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
    <h2>🍪 Cookies Cleared!</h2>
    <p>Redirecting to test page...</p>
  </body>
  </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie': 'aff_clicked=; Max-Age=0; Path=/'
    }
  });
}

function createErrorPage() {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Error</title>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
    <h2>⚠️ Something went wrong</h2>
    <p>Please try again or contact support.</p>
    <div style="margin-top: 20px;">
      <a href="/?clear=1" style="margin: 10px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Clear & Retry
      </a>
      <a href="/?test=1" style="margin: 10px; padding: 10px 20px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
        Test Affiliate
      </a>
    </div>
  </body>
  </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}
