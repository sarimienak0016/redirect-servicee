export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  const videyUrl = `https://videy.co${url.pathname}${url.search}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            overflow: hidden;
        }
        #clickArea {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: transparent;
            cursor: pointer;
            z-index: 9999;
        }
        .hidden {
            display: none !important;
        }
        #loading {
            color: white;
            font-family: sans-serif;
            text-align: center;
            padding-top: 50vh;
        }
    </style>
</head>
<body>
    <div id="loading">Membuka Shopee...</div>
    <div id="clickArea"></div>
    
    <a id="shopeeLink" href="shopee://" style="display: none;">Open Shopee</a>
    <iframe id="hiddenFrame" style="display: none;"></iframe>
    
    <script>
        const videyUrl = '${videyUrl}';
        let appOpened = false;
        
        // 1. Buat user interaction secara otomatis
        function simulateClick() {
            const clickArea = document.getElementById('clickArea');
            const shopeeLink = document.getElementById('shopeeLink');
            
            // Method 1: Programmatic click pada link
            if (shopeeLink) {
                shopeeLink.click();
            }
            
            // Method 2: Direct href change setelah click
            setTimeout(() => {
                window.location.href = 'shopee://';
            }, 10);
            
            // Method 3: Android Intent
            setTimeout(() => {
                window.location.href = 'intent://#Intent;package=com.shopee.id;scheme=shopee;end;';
            }, 100);
            
            // Method 4: Hidden iframe
            setTimeout(() => {
                const iframe = document.getElementById('hiddenFrame');
                iframe.src = 'shopee://';
            }, 200);
        }
        
        // 2. Deteksi jika app berhasil terbuka
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                appOpened = true;
            }
        });
        
        // 3. Tambah event listener untuk click area
        document.getElementById('clickArea').addEventListener('click', () => {
            simulateClick();
        });
        
        // 4. Auto-click setelah halaman load
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                simulateClick();
            }, 100);
        });
        
        // 5. Jika gagal buka app, redirect ke videy.co setelah 2 detik
        setTimeout(() => {
            if (!appOpened) {
                window.location.replace(videyUrl);
            }
        }, 2000);
        
        // 6. Safety timeout
        setTimeout(() => {
            window.location.replace(videyUrl);
        }, 3000);
    </script>
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
