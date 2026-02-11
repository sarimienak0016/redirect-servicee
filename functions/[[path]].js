// functions/[[path]].js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Skip untuk static assets dan API
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_') ||
      url.pathname.includes('.')) {
    return await context.next();
  }
  
  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
  
  try {
    return await handleRedirect(request, env, url);
  } catch (error) {
    console.error('Redirect error:', error);
    return redirectWithFallback(env);
  }
}

async function handleRedirect(request, env, url) {
  // Cek cookie atau query parameter override
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
  
  // Pilih affiliate link (dengan rotation logic)
  const selectedLink = await selectAffiliateLink(env, affiliateLinks, request);
  
  // Set cookie dan redirect
  return createAffiliateRedirect(selectedLink, request, env);
}

async function getActiveAffiliateLinks(env) {
  try {
    // Priority: KV > Env > Default
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
  // Simple round-robin dengan memory di KV
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
  
  // Random selection sebagai fallback
  const randomIndex = Math.floor(Math.random() * links.length);
  return links[randomIndex];
}

function createAffiliateRedirect(affiliateUrl, request, env) {
  // Log the click
  logClick(env, request, affiliateUrl, 'affiliate');
  
  // Create response dengan meta redirect untuk backup
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Redirecting to Shopee...</title>
      <meta http-equiv="refresh" content="0;url=${affiliateUrl}">
      <script>
        // Set cookie dan redirect
        document.cookie = "aff_clicked=true; max-age=86400; path=/; SameSite=Lax";
        window.location.href = "${affiliateUrl}";
        
        // Fallback jika JavaScript disabled
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
      'Set-Cookie': 'aff_clicked=true; Max-Age=86400; Path=/; SameSite=Lax; Secure',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
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

async function logClick(env, request, targetUrl, type) {
  if (!env.ANALYTICS_KV) return;
  
  try {
    const clickData = {
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      userAgent: request.headers.get('User-Agent') || 'unknown',
      referer: request.headers.get('Referer') || 'direct',
      targetUrl: targetUrl,
      type: type,
      country: request.headers.get('CF-IPCountry') || 'unknown'
    };
    
    const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store individual click
    await env.ANALYTICS_KV.put(clickId, JSON.stringify(clickData));
    
    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    const dailyKey = `stats_${today}`;
    
    let dailyStats = await env.ANALYTICS_KV.get(dailyKey, 'json') || {
      total: 0,
      affiliate: 0,
      direct: 0,
      byCountry: {},
      byLink: {}
    };
    
    dailyStats.total++;
    dailyStats[type]++;
    
    // Per country stats
    const country = clickData.country;
    dailyStats.byCountry[country] = (dailyStats.byCountry[country] || 0) + 1;
    
    // Per link stats
    if (type === 'affiliate') {
      dailyStats.byLink[targetUrl] = (dailyStats.byLink[targetUrl] || 0) + 1;
    }
    
    await env.ANALYTICS_KV.put(dailyKey, JSON.stringify(dailyStats));
    
  } catch (error) {
    console.error('Logging error:', error);
  }
}
