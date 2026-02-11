export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  const videyUrl = `https://videy.co${url.pathname}${url.search}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <script>
        // 1. Coba buka aplikasi Shopee dengan timing berbeda
        let attempts = 0;
        const maxAttempts = 3;
        
        function tryOpenShopee() {
            attempts++;
            
            // Attempt 1: Immediate (0ms)
            if (attempts === 1) {
                console.log('Attempt 1: Immediate');
                window.location.href = 'shopee://';
            }
            
            // Attempt 2: After 100ms
            else if (attempts === 2) {
                console.log('Attempt 2: After 100ms');
                window.location.href = 'intent://#Intent;package=com.shopee.id;scheme=shopee;end;';
                
                // Juga coba dengan iframe
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = 'shopee://';
                document.body.appendChild(iframe);
            }
            
            // Attempt 3: After 300ms
            else if (attempts === 3) {
                console.log('Attempt 3: After 300ms');
                // Coba dengan user gesture simulation
                const link = document.createElement('a');
                link.href = 'shopee://';
                link.click();
            }
            
            // Jika masih belum terbuka setelah 3 attempts, ke videy.co
            if (attempts >= maxAttempts) {
                setTimeout(() => {
                    window.location.replace('${videyUrl}');
                }, 500);
            } else {
                // Coba attempt berikutnya
                setTimeout(tryOpenShopee, 100);
            }
        }
        
        // 2. Mulai attempts
        setTimeout(tryOpenShopee, 50);
        
        // 3. Safety net: ke videy.co setelah 2 detik
        setTimeout(() => {
            window.location.replace('${videyUrl}');
        }, 2000);
        
    </script>
</head>
<body>
    <!-- Kosong -->
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
