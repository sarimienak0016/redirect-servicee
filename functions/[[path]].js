// functions/[[path]].js - COMPLETE FIXED VERSION
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Skip untuk static assets dan API
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_') ||
      url.pathname.includes('.')) {
    return await context.next();
  }
  
  try {
    return await handleRedirect(request, env, url);
  } catch (error) {
    console.error('Redirect error:', error);
    return redirectWithFallback(env);
  }
}

async function handleRedirect(request, env, url) {
  // Cek cookie
  const cookieHeader = request.headers.get('Cookie') || '';
  const hasVisited = cookieHeader.includes('aff_clicked=true');
  const forceDirect = url.searchParams.has('direct');
  
  // Jika sudah visit atau force direct, redirect ke videy.co
  if (hasVisited || forceDirect) {
    return redirectToVidey(env);
  }
  
  // Ambil affiliate links
  const affiliateLinks = await getActiveAffiliateLinks(env);
  
  if (affiliateLinks.length === 0) {
    return redirectToVidey(env);
  }
  
  // Pilih affiliate link
  const selectedLink = await selectAffiliateLink(env, affiliateLinks, request);
  
  // Cek user agent untuk menentukan redirect type
  return createSmartRedirect(selectedLink, request, env);
}

async function getActiveAffiliateLinks(env) {
  try {
    if (env.AFFILIATE_KV) {
      const kvLinks = await env.AFFILIATE_KV.get('affiliate_links', 'json');
      if (kvLinks && kvLinks.length > 0) return kvLinks;
    }
    
    if (env.AFFILIATE_LINKS) {
      return JSON.parse(env.AFFILIATE_LINKS);
    }
    
    return getDefaultLinks();
  } catch (error) {
    return getDefaultLinks();
  }
}

function getDefaultLinks() {
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
}

async function selectAffiliateLink(env, links, request) {
  // Simple round-robin
  if (env.AFFILIATE_KV) {
    try {
      const lastIndex = await env.AFFILIATE_KV.get('last_index');
      let currentIndex = lastIndex ? parseInt(lastIndex) : 0;
      currentIndex = (currentIndex + 1) % links.length;
      
      await env.AFFILIATE_KV.put('last_index', currentIndex.toString());
      return links[currentIndex];
    } catch (error) {
      // Fallback ke random
    }
  }
  
  const randomIndex = Math.floor(Math.random() * links.length);
  return links[randomIndex];
}

function createSmartRedirect(affiliateUrl, request, env) {
  const userAgent = request.headers.get('User-Agent') || '';
  const url = new URL(request.url);
  
  // Extract Shopee code
  const shopeeCode = extractShopeeCode(affiliateUrl);
  
  // Deteksi platform
  const isAndroid = userAgent.includes('Android') || userAgent.includes('WebView');
  const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad');
  const isMobile = isAndroid || isIOS;
  
  // Force app open jika ada parameter ?app=1
  const forceApp = url.searchParams.has('app');
  
  if ((isMobile || forceApp) && shopeeCode) {
    // Redirect khusus untuk mobile/app
    return createMobileRedirect(shopeeCode, isAndroid, isIOS, affiliateUrl, request, env);
  }
  
  // Untuk desktop browser, pakai cara biasa
  return createWebRedirect(affiliateUrl, request, env);
}

function extractShopeeCode(url) {
  const match = url.match(/shopee\.co\.id\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function createMobileRedirect(shopeeCode, isAndroid, isIOS, webUrl, request, env) {
  let deepLink = '';
  let appStoreUrl = '';
  
  if (isAndroid) {
    // Android deep link
    deepLink = `intent://shopee.co.id/share_product/${shopeeCode}#Intent;scheme=shopee;package=com.shopee.id;end`;
    appStoreUrl = 'https://play.google.com/store/apps/details?id=com.shopee.id';
  } else if (isIOS) {
    // iOS universal link
    deepLink = `shopee://share_product/${shopeeCode}`;
    appStoreUrl = 'https://apps.apple.com/id/app/shopee/id959841443';
  }
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting to Shopee App...</title>
    
    <!-- iOS Universal Link Meta Tags -->
    <meta property="al:ios:url" content="shopee://share_product/${shopeeCode}" />
    <meta property="al:ios:app_store_id" content="959841443" />
    <meta property="al:ios:app_name" content="Shopee" />
    <meta property="al:android:url" content="shopee://share_product/${shopeeCode}" />
    <meta property="al:android:app_name" content="Shopee" />
    <meta property="al:android:package" content="com.shopee.id" />
    <meta property="al:web:url" content="${webUrl}" />
    
    <script>
      // Set cookie dulu
      document.cookie = "aff_clicked=true; max-age=86400; path=/; SameSite=None; Secure";
      
      // Coba redirect ke app
      function openApp() {
        const startTime = Date.now();
        
        // Try deep link
        window.location.href = "${deepLink}";
        
        // Check if app opened
        setTimeout(function() {
          const timeElapsed = Date.now() - startTime;
          
          // If still on page after 500ms, app probably not installed
          if (timeElapsed < 1200) {
            // Fallback 1: Try app store
            window.location.href = "${appStoreUrl}";
            
            // Fallback 2: Open web after 3 seconds
            setTimeout(function() {
              window.location.href = "${webUrl}";
            }, 3000);
          }
        }, 500);
      }
      
      // Start process
      setTimeout(openApp, 100);
      
      // Fallback untuk browser yang block popup
      window.onblur = function() {
        // User switched to app
        window.close();
      };
    </script>
    
    <style>
      body {
        margin: 0;
        padding: 40px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        text-align: center;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .container {
        max-width: 400px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 40px 30px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        color: #333;
      }
      
      h1 {
        margin: 0 0 20px 0;
        font-size: 24px;
        color: #FF5722;
      }
      
      .loading {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 87, 34, 0.3);
        border-radius: 50%;
        border-top-color: #FF5722;
        animation: spin 1s ease-in-out infinite;
        margin: 20px 0;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .button {
        display: inline-block;
        margin: 20px 10px 0;
        padding: 12px 25px;
        background: #FF5722;
        color: white;
        text-decoration: none;
        border-radius: 25px;
        font-weight: bold;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      
      .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(255, 87, 34, 0.3);
      }
      
      .button.secondary {
        background: #666;
      }
      
      .info {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🛍️ Opening Shopee App...</h1>
      <div class="loading"></div>
      <p>Redirecting to Shopee application...</p>
      <p style="font-size: 14px; color: #666;">
        If the app doesn't open automatically:
      </p>
      <div>
        <a href="${deepLink}" class="button">Open in App</a>
        <a href="${webUrl}" class="button secondary">Open in Browser</a>
      </div>
      <div class="info">
        <p>Don't have Shopee app?</p>
        <a href="${appStoreUrl}" style="color: #FF5722; text-decoration: none;">
          Download from ${isAndroid ? 'Play Store' : 'App Store'}
        </a>
      </div>
    </div>
  </body>
  </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'aff_clicked=true; Max-Age=86400; Path=/; SameSite=None; Secure'
    }
  });
}

function createWebRedirect(affiliateUrl, request, env) {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Redirecting to Shopee...</title>
    <meta http-equiv="refresh" content="0;url=${affiliateUrl}">
    
    <!-- Original Shopee redirect meta tags -->
    <meta property="og:url" content="${affiliateUrl}" />
    <meta property="al:web:url" content="${affiliateUrl}" />
    
    <script>
      // Set cookie
      document.cookie = "aff_clicked=true; max-age=86400; path=/; SameSite=Lax";
      
      // Redirect
      window.location.href = "${affiliateUrl}";
      
      // Fallback
      setTimeout(function() {
        window.location.href = "${affiliateUrl}";
      }, 100);
    </script>
  </head>
  <body>
    <p>Redirecting to Shopee... <a href="${affiliateUrl}">Click here if not redirected</a></p>
  </body>
  </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'aff_clicked=true; Max-Age=86400; Path=/; SameSite=Lax'
    }
  });
}

function redirectToVidey(env) {
  const videyUrl = env.TARGET_URL || 'https://videy.co';
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': videyUrl,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

function redirectWithFallback(env) {
  const videyUrl = env.TARGET_URL || 'https://videy.co';
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="3;url=${videyUrl}">
  </head>
  <body>
    <h2>Something went wrong</h2>
    <p>Redirecting to Videy in 3 seconds...</p>
    <p><a href="${videyUrl}">Click here to go now</a></p>
  </body>
  </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}
