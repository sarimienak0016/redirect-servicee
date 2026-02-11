export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Semua request masuk sini
  return await handleAllRequests(request, env, url);
}

async function handleAllRequests(request, env, url) {
  // === 1. DAFTAR LINK SHOPEE KAMU ===
  const shopeeLinks = [
    'https://s.shopee.co.id/8AQUp3ZesV',
    'https://s.shopee.co.id/9pYio8K2cw',
    'https://s.shopee.co.id/8pgBcJjIzl',
    'https://s.shopee.co.id/60M0F7txlS',
    'https://s.shopee.co.id/7VAo1N0hIp',
    'https://s.shopee.co.id/9KcSCm0Xb7',
    'https://s.shopee.co.id/3LLF3lT65E',
    'https://s.shopee.co.id/6VIGpbCEoc'
  ];
  
  // === 2. TARGET AKHIR ===
  const targetUrl = 'https://videy.co';
  
  // === 3. CEK COOKIE ===
  const cookieHeader = request.headers.get('Cookie') || '';
  const sudahLewatShopee = cookieHeader.includes('sudah_shopee=true');
  
  // === 4. LOGIC SEDERHANA ===
  if (!sudahLewatShopee) {
    // BELUM lewat Shopee → Redirect ke Shopee
    const randomLink = shopeeLinks[Math.floor(Math.random() * shopeeLinks.length)];
    
    // Set cookie bahwa sudah lewat Shopee
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Redirect ke Shopee</title>
      <script>
        // Set cookie
        document.cookie = "sudah_shopee=true; max-age=86400; path=/";
        
        // Redirect langsung ke Shopee
        window.location.href = "${randomLink}";
      </script>
    </head>
    <body>
      <p>Redirect ke Shopee... <a href="${randomLink}">Klik di sini</a></p>
    </body>
    </html>
    `;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': 'sudah_shopee=true; Max-Age=86400; Path=/'
      }
    });
    
  } else {
    // SUDAH lewat Shopee → Redirect ke videy.co
    return new Response(null, {
      status: 302,
      headers: {
        'Location': targetUrl
      }
    });
  }
}
