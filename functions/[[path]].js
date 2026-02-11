export async function onRequest(context) {
  const { request } = context;
  
  // Link Shopee kamu
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
  
  // Cek cookie sederhana
  const cookies = request.headers.get('Cookie') || '';
  
  if (cookies.includes('sudah_shopee=1')) {
    // SUDAH ke Shopee → ke videy.co
    return Response.redirect('https://videy.co', 302);
  }
  
  // BELUM ke Shopee → pilih random link
  const randomLink = shopeeLinks[Math.floor(Math.random() * shopeeLinks.length)];
  
  // Response dengan cookie
  const response = Response.redirect(randomLink, 302);
  response.headers.append('Set-Cookie', 'sudah_shopee=1; Max-Age=86400; Path=/');
  
  return response;
}
