export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.pathname;
    
    // Handle /e/xxx routes
    if (path.startsWith('/e/')) {
        const id = path.replace('/e/', '');
        return generateRedirectPage(id, 'e');
    }
    
    // Handle /f/xxx routes  
    if (path.startsWith('/f/')) {
        const id = path.replace('/f/', '');
        return generateRedirectPage(id, 'f');
    }
    
    // Default response
    return new Response('Not found', { status: 404 });
}

function generateRedirectPage(id, type) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>vdey.de - Secure Link</title>
    <meta http-equiv="refresh" content="0;url=https://vide.ws/${type}/${id}">
    <script type="text/javascript">
        window.location.href = "https://vide.ws/${type}/${id}";
    </script>
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
        .loading {
            text-align: center;
            padding: 20px;
        }
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
        <div>Loading...</div>
    </div>
    
    <script>
        setTimeout(function() {
            window.location.href = "https://vide.ws/${type}/${id}";
        }, 100);
    </script>
</body>
</html>
    `;
    
    return new Response(html, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=3600'
        }
    });
}
