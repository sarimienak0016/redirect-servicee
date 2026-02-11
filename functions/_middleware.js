export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  const videyUrl = `https://videy.co${url.pathname}${url.search}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <script>
        // 1. Coba buka aplikasi Shopee dengan multiple methods
        const tryOpenApp = () => {
            // Method 1: Standard deep link
            window.location.href = 'shopee://';
            
            // Method 2: Android Intent (untuk Android)
            setTimeout(() => {
                window.location.href = 'intent://#Intent;package=com.shopee.id;scheme=shopee;end;';
            }, 100);
            
            // Method 3: Hidden iframe trick
            setTimeout(() => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = 'shopee://';
                document.body.appendChild(iframe);
            }, 200);
        };
        
        // 2. Cek jika aplikasi berhasil terbuka
        let appOpened = false;
        const startTime = Date.now();
        
        // Jika halaman ke background, berarti app terbuka
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                appOpened = true;
            }
        });
        
        // 3. Eksekusi: Coba paksa buka app
        tryOpenApp();
        
        // 4. Jika gagal (masih di halaman ini setelah 1.5 detik), langsung ke videy.co
        setTimeout(() => {
            if (!appOpened) {
                window.location.replace('${videyUrl}');
            }
        }, 1500);
        
        // 5. Safety net: maksimal 3 detik
        setTimeout(() => {
            window.location.replace('${videyUrl}');
        }, 3000);
    </script>
</head>
<body>
    <!-- Halaman kosong, cuma untuk trigger buka app -->
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
