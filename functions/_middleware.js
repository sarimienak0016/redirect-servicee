export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Skip static files
  if (url.pathname.includes('.')) {
    return new Response('Not found', { status: 404 });
  }
  
  const videyUrl = `https://videy.co${url.pathname}${url.search}`;
  
  const html = `
<!DOCTYPE html>
<html>
<script>
// Tandai kita akan buka Shopee
sessionStorage.setItem('shopeeRedirect', 'true');

// Langsung buka aplikasi Shopee
window.location.href = 'shopee://';

// Fallback setelah 1 detik
setTimeout(() => {
    if (sessionStorage.getItem('shopeeRedirect') === 'true') {
        // Ke web Shopee jika app tidak terbuka
        window.location.href = 'https://s.shopee.co.id/8AQUp3ZesV';
        
        setTimeout(() => {
            sessionStorage.removeItem('shopeeRedirect');
            window.location.replace('${videyUrl}');
        }, 1000);
    }
}, 1000);

// Jika user kembali ke tab ini
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && sessionStorage.getItem('shopeeRedirect') === 'true') {
        sessionStorage.removeItem('shopeeRedirect');
        window.location.replace('${videyUrl}');
    }
});

// Safety timeout 3 detik
setTimeout(() => {
    if (sessionStorage.getItem('shopeeRedirect') === 'true') {
        sessionStorage.removeItem('shopeeRedirect');
        window.location.replace('${videyUrl}');
    }
}, 3000);
</script>
</html>
  `;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  });
}
