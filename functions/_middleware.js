export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Ambil path asli dari URL user
  const originalPath = url.pathname + url.search; // Contoh: "/123" atau "/abc?param=value"
  const targetUrl = `https://videy.co${originalPath}`;
  
  // List link Shopee affiliate kamu
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
  
  // Pilih random link
  const randomLink = shopeeLinks[Math.floor(Math.random() * shopeeLinks.length)];
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <script>
        // Simpan target URL untuk nanti
        sessionStorage.setItem('targetUrl', '${targetUrl}');
        
        // Langsung ke Shopee (ini yang work!)
        window.location.href = '${randomLink}';
        
        // Fallback: jika setelah 3 detik masih di sini, ke videy.co
        setTimeout(function() {
            window.location.href = '${targetUrl}';
        }, 3000);
    </script>
</head>
<body>
    <!-- Halaman kosong -->
</body>
</html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  });
}
