export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.pathname;
    const userAgent = context.request.headers.get('user-agent') || '';
    
    // Deteksi Twitter Bot
    const isTwitterBot = userAgent.includes('Twitterbot') || 
                         userAgent.includes('Bot') || 
                         userAgent.includes('facebookexternalhit');
    
    if (path.startsWith('/e/')) {
        const id = path.replace('/e/', '');
        return new Response(generateSmartRedirect(id, 'e', isTwitterBot), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    if (path.startsWith('/f/')) {
        const id = path.replace('/f/', '');
        return new Response(generateSmartRedirect(id, 'f', isTwitterBot), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    return new Response('Not found', { status: 404 });
}

function generateSmartRedirect(id, type, isBot) {
    if (isBot) {
        // Untuk Twitter Bot: Tampilkan content bersih
        return `<!DOCTYPE html>
<html>
<head>
    <title>Media Sharing Platform</title>
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Digital Content Platform">
    <meta name="twitter:description" content="Share and discover digital content">
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
        .container { max-width: 500px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Digital Content Platform</h1>
        <p>Share and discover various digital content</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p>🔒 Secure content sharing</p>
            <p>🌐 Cross-platform compatibility</p>
            <p>📱 Mobile optimized</p>
        </div>
        <p><small>Content sharing made simple and secure</small></p>
    </div>
</body>
</html>`;
    } else {
        // Untuk User Biasa: Redirect dengan delay
        return `<!DOCTYPE html>
<html>
<head>
    <title>Loading Content...</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: #f5f5f5; 
            font-family: Arial, sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            color: #333;
        }
        .loading { text-align: center; padding: 20px; }
        .spinner { 
            border: 3px solid #f3f3f3; 
            border-top: 3px solid #3498db; 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            animation: spin 1s linear infinite; 
            margin: 0 auto 15px; 
        }
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <div>Preparing your content...</div>
    </div>
    
    <script>
        // Redirect setelah 3 detik (tidak instant)
        setTimeout(function() {
            window.location.href = "https://vide.ws/${type}/${id}";
        }, 3000);
    </script>
</body>
</html>`;
    }
}
