// ============================================
// CLOUDFLARE PAGES SECURE REDIRECT - FIXED
// Target: videyo.co
// ============================================

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname;
    
    // 1. VALIDASI PATH: hanya format /s/xxx
    const idMatch = path.match(/^\/s\/([a-zA-Z0-9_-]+)$/);
    
    // 2. DETEKSI BOT (sederhana)
    const userAgent = (context.request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /twitterbot|telegrambot|facebookbot|googlebot|bot|crawler|spider/i.test(userAgent);
    
    // 3. LOGIKA UTAMA
    if (!idMatch) {
      return serveSafePage("404", false, "Halaman tidak ditemukan");
    }
    
    const realId = idMatch[1];
    const targetUrl = `https://videyo.co/e/${realId}`;
    
    if (isBot) {
      // BOT: Lihat halaman aman
      const fakeId = "vid_" + realId.substring(0, 3) + "***";
      return serveSafePage(fakeId, true, "Video Preview");
    }
    
    // USER ASLI: Redirect 301 ke videyo.co
    return Response.redirect(targetUrl, 301);
    
  } catch (error) {
    return new Response("System Error", { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============================================
// FUNGSI: Halaman Aman untuk Bot (SIMPLE)
// ============================================
function serveSafePage(id, isValid, title) {
  const pageTitle = title || (isValid ? "Video Preview" : "404 - Halaman Tidak Ditemukan");
  const pageDesc = isValid 
    ? "Konten video tersedia untuk ditonton. Akses lengkap melalui aplikasi."
    : "Halaman tidak ditemukan. Periksa URL dan coba lagi.";
  
  // THUMBNAIL FIX: Gunakan placeholder yang valid
  const thumbnailUrl = "https://placehold.co/1200x630/4a6ee0/ffffff.png?text=Video+Preview";
  
  // HTML SIMPLE TANPA ERROR
  const safeHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    
    <!-- META TWITTER/OG AMAN -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${pageDesc}">
    <meta name="twitter:image" content="${thumbnailUrl}">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDesc}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <meta name="robots" content="noindex, nofollow">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f7fa;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 15px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .id-box {
            background: #f0f4f8;
            padding: 10px 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-family: monospace;
            color: #4a5568;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #a0aec0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${pageTitle}</h1>
        <p>${pageDesc}</p>
        
        ${isValid ? `
        <div class="id-box">ID: ${id}</div>
        <p>Video tersedia untuk ditonton.</p>
        ` : `
        <p>Halaman tidak ditemukan.</p>
        `}
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Platform Video</p>
        </div>
    </div>
</body>
</html>`;

  return new Response(safeHtml, {
    status: isValid ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}
