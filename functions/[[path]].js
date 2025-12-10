export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // ⚡ SELALU REDIRECT KE WWW.VIDEYD.COM
  let redirectUrl = 'https://www.videyd.com/#_';
  
  if (path.startsWith('/s/')) {
    const id = path.substring(3).replace(/[^a-zA-Z0-9-_]/g, '') || 'default';
    redirectUrl = `https://www.videyd.com/e/${encodeURIComponent(id)}?lv1=videyb.com#_`;
  }
  
  console.log('Redirecting to:', redirectUrl);
  
  return new Response(null, {
    status: 301,
    headers: {
      'Location': redirectUrl,
      'Cache-Control': 'no-cache'
    }
  });
}
