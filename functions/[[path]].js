// functions/[[path]].js - AGGRESSIVE VERSION
export async function onRequest(context) {
  const { request } = context;
  
  // Shopee codes
  const codes = ['8AQUp3ZesV','9pYio8K2cw','8pgBcJjIzl','60M0F7txlS',
                 '7VAo1N0hIp','9KcSCm0Xb7','3LLF3lT65E','6VIGpbCEoc'];
  
  const randomCode = codes[Math.floor(Math.random() * codes.length)];
  
  // Cek cookie
  const cookies = request.headers.get('Cookie') || '';
  
  if (cookies.includes('shopee_done=1')) {
    return Response.redirect('https://videy.co', 302);
  }
  
  // HTML yang PASTI buka Shopee App
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <script>
      // IMPORTANT: Set cookie immediately
      document.cookie = "shopee_done=1; max-age=86400; path=/";
      
      // Android Deep Link
      const androidDeepLink = "intent://share_product/${randomCode}#Intent;scheme=shopee;package=com.shopee.id;S.browser_fallback_url=https%3A%2F%2Fs.shopee.co.id%2F${randomCode};end";
      
      // iOS Deep Link  
      const iosDeepLink = "shopee://share_product/${randomCode}";
      
      // Web URL
      const webUrl = "https://s.shopee.co.id/${randomCode}";
      
      // Deteksi device
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isAndroid) {
        // Android: Coba deep link, fallback ke play store, lalu web
        window.location.href = androidDeepLink;
        
        setTimeout(() => {
          // Jika masih di halaman ini, arahkan ke Play Store
          window.location.href = "https://play.google.com/store/apps/details?id=com.shopee.id";
        }, 500);
        
        setTimeout(() => {
          // Final fallback ke web
          window.location.href = webUrl;
        }, 1500);
        
      } else if (isIOS) {
        // iOS: Coba deep link, fallback ke app store, lalu web
        window.location.href = iosDeepLink;
        
        setTimeout(() => {
          window.location.href = "https://apps.apple.com/id/app/shopee/id959841443";
        }, 500);
        
        setTimeout(() => {
          window.location.href = webUrl;
        }, 1500);
        
      } else {
        // Desktop: langsung ke web
        window.location.href = webUrl;
      }
    </script>
  </head>
  <body>
    <p>Opening Shopee...</p>
  </body>
  </html>
  `;
  
  const response = new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
  
  response.headers.append('Set-Cookie', 'shopee_done=1; Max-Age=86400; Path=/');
  return response;
}
