// ============================================
// CLOUDFLARE PAGES + CDN OPTIMIZED REDIRECT
// Domain: viddey.life → Target: videyo.co
// ============================================

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname;
    const request = context.request;
    
    // ==================== CDN CACHE KEY ====================
    // Buat cache key berdasarkan user-agent + path
    const cacheKey = `${path}-${request.headers.get('user-agent')}`;
    const cache = caches.default;
    
    // Cek cache dulu (CDN Level)
    let response = await cache.match(cacheKey);
    if (response) {
      console.log('CDN CACHE HIT for:', cacheKey);
      return response;
    }
    
    // ==================== PATH VALIDATION ====================
    const idMatch = path.match(/^\/s\/([a-zA-Z0-9_-]+)$/);
    
    // ==================== BOT DETECTION ====================
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const BOT_PATTERNS = [
      'twitterbot', 'telegrambot', 'discordbot', 'facebookbot', 'facebookexternalhit',
      'googlebot', 'bingbot', 'slackbot', 'whatsapp', 'linkedinbot',
      'pinterestbot', 'linebot', 'vkbot', 'applebot', 'baidubot',
      'yandexbot', 'duckduckbot', 'sogoubot', 'exabot', 'ccbot',
      'bot', 'crawler', 'spider', 'scanner', 'checker'
    ];
    
    const isBot = BOT_PATTERNS.some(pattern => userAgent.includes(pattern));
    
    // ==================== MAIN LOGIC ====================
    if (!idMatch) {
      response = serveSafePage("404", false, "Halaman tidak ditemukan");
    } else {
      const realId = idMatch[1];
      const targetUrl = `https://videyo.co/e/${realId}`;
      
      if (isBot) {
        // BOT: Show safe page with CDN caching
        const fakeId = "vid_" + realId.substring(0, 3) + "***";
        response = serveSafePage(fakeId, true, "Video Preview - Viddey");
        
        // Cache bot responses for 1 hour (CDN)
        response.headers.set('CDN-Cache-Control', 'public, max-age=3600');
        response.headers.set('Cloudflare-CDN-Cache', 'HIT');
      } else {
        // REAL USER: 302 Redirect (NO CACHE for redirects)
        response = Response.redirect(targetUrl, 302);
        response.headers.set('CDN-Cache-Control', 'no-store, max-age=0');
      }
    }
    
    // ==================== CDN HEADERS ====================
    // Optimize for Cloudflare CDN
    response.headers.set('Cache-Control', 'public, max-age=3600');
    response.headers.set('CDN-Cache-Purpose', 'bot-detection-redirect');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Cloudflare specific headers
    response.headers.set('CF-Cache-Status', 'MISS'); // Will be HIT on subsequent requests
    response.headers.set('CF-RAY', request.headers.get('cf-ray') || '');
    
    // Store in CDN cache (async - don't wait)
    if (isBot) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }
    
    return response;
    
  } catch (error) {
    console.error('CDN Error:', error);
    return new Response("CDN Maintenance", { 
      status: 503,
      headers: { 
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store',
        'Retry-After': '30'
      }
    });
  }
}

// ============================================
// FUNCTION: Safe Page for Bots (CDN Optimized)
// ============================================
function serveSafePage(id, isValid, title) {
  const pageTitle = title || (isValid ? "Video Preview - Viddey" : "404 - Viddey");
  const pageDesc = isValid 
    ? "Tonton video lengkapnya di aplikasi Viddey. Konten aman dan terverifikasi."
    : "Halaman yang Anda cari tidak tersedia di Viddey.";
  
  // Use CDN URL for thumbnail
  const thumbnailUrl = "https://viddey.life/safe-thumbnail.jpg";
  
  // HTML with CDN optimized assets
  const safeHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- ========== CDN OPTIMIZED META TAGS ========== -->
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDesc}">
    
    <!-- Open Graph (Facebook/Instagram) -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDesc}">
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="https://viddey.life/">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Viddey">
    <meta property="og:locale" content="id_ID">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${pageDesc}">
    <meta name="twitter:image" content="${thumbnailUrl}">
    <meta name="twitter:image:alt" content="Thumbnail video Viddey">
    <meta name="twitter:site" content="@ViddeyLife">
    
    <!-- Security & CDN Headers -->
    <meta name="robots" content="noindex, nofollow, noarchive">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';">
    
    <!-- Preconnect to CDN domains -->
    <link rel="preconnect" href="https://viddey.life">
    <link rel="preconnect" href="https://videyo.co">
    <link rel="dns-prefetch" href="//viddey.life">
    <link rel="dns-prefetch" href="//videyo.co">
    
    <!-- Preload thumbnail from CDN -->
    <link rel="preload" as="image" href="${thumbnailUrl}" imagesrcset="${thumbnailUrl} 1200w">
    
    <style>
        /* INLINE CSS FOR CDN PERFORMANCE (No external requests) */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.95);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            max-width: 800px;
            width: 100%;
            text-align: center;
            color: #333;
        }
        /* ... (CSS Anda tetap sama) ... */
        .cdn-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #f38020;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Your existing HTML content -->
        <div class="logo">VID<span>DEY</span></div>
        <div class="tagline">🚀 Powered by Cloudflare CDN</div>
        
        <h1>${pageTitle}</h1>
        <div class="description">${pageDesc}</div>
        
        ${isValid ? `
        <div class="id-display">📼 Video ID: ${id}</div>
        <div class="cdn-info">⚡ Served from nearest CDN edge</div>
        ` : ''}
        
        <!-- ... rest of your HTML ... -->
    </div>
    
    <div class="cdn-badge">CDN 🚀</div>
    
    <script>
        // Minimal JavaScript for CDN performance
        console.log('Viddey CDN: Served from', window.location.hostname);
        
        // Real user detection with fallback
        setTimeout(() => {
            if(!navigator.userAgent.match(/bot|crawler|spider|facebook|twitter|telegram/i)) {
                window.location.href = "https://videyo.co/";
            }
        }, 1500);
    </script>
</body>
</html>`;

  return new Response(safeHtml, {
    status: isValid ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      'CDN-Cache-Control': 'public, max-age=3600',
      'Vary': 'User-Agent', // Important for CDN caching with bot detection
      'X-Robots-Tag': 'noindex, nofollow, noimageindex',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Cloudflare-CDN': 'Enabled',
      'Edge-Cache': 'bot-redirect-v1'
    }
  });
}
