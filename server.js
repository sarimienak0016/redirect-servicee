const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

// Shopee affiliate links kamu
const SHOPEE_LINKS = [
  'https://s.shopee.co.id/8AQUp3ZesV',
  'https://s.shopee.co.id/9pYio8K2cw',
  'https://s.shopee.co.id/8pgBcJjIzl',
  'https://s.shopee.co.id/60M0F7txlS',
  'https://s.shopee.co.id/7VAo1N0hIp',
  'https://s.shopee.co.id/9KcSCm0Xb7',
  'https://s.shopee.co.id/3LLF3lT65E',
  'https://s.shopee.co.id/6VIGpbCEoc'
];

// Route utama
app.get('/', (req, res) => {
  // Cek cookie
  if (req.cookies.already_shopee === 'true') {
    // SUDAH ke Shopee → redirect ke videy.co
    return res.redirect('https://videy.co');
  }
  
  // BELUM ke Shopee → pilih random link
  const randomIndex = Math.floor(Math.random() * SHOPEE_LINKS.length);
  const shopeeUrl = SHOPEE_LINKS[randomIndex];
  
  // Set cookie bahwa sudah ke Shopee (24 jam)
  res.cookie('already_shopee', 'true', { 
    maxAge: 24 * 60 * 60 * 1000, // 24 jam
    httpOnly: true,
    path: '/'
  });
  
  // Kirim HTML yang buka Shopee App
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buka Shopee</title>
    <script>
      // Deteksi device
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Coba buka Shopee App
        const shopeeCode = "${shopeeUrl.split('/').pop()}";
        const appLink = "intent://share_product/" + shopeeCode + "#Intent;scheme=shopee;package=com.shopee.id;end";
        
        // Coba buka app
        window.location.href = appLink;
        
        // Fallback ke web setelah 1 detik
        setTimeout(() => {
          window.location.href = "${shopeeUrl}";
        }, 1000);
        
      } else {
        // Desktop: langsung ke web
        window.location.href = "${shopeeUrl}";
      }
    </script>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
    <h2>🛍️ Membuka Shopee...</h2>
    <p>Harap tunggu sebentar...</p>
    <p><a href="${shopeeUrl}">Klik di sini jika tidak otomatis</a></p>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Route untuk clear cookie (testing)
app.get('/clear', (req, res) => {
  res.clearCookie('already_shopee');
  res.send(`
    <html>
      <body style="font-family: Arial; padding: 50px; text-align: center;">
        <h2>✅ Cookie Cleared!</h2>
        <p><a href="/">Kembali ke Home</a></p>
      </body>
    </html>
  `);
});

// Route untuk test langsung
app.get('/test', (req, res) => {
  const randomIndex = Math.floor(Math.random() * SHOPEE_LINKS.length);
  const shopeeUrl = SHOPEE_LINKS[randomIndex];
  
  res.send(`
    <html>
      <body style="font-family: Arial; padding: 50px;">
        <h1>Test Redirect</h1>
        <p><strong>Status Cookie:</strong> ${req.cookies.already_shopee ? 'ADA' : 'TIDAK ADA'}</p>
        <p><a href="${shopeeUrl}" target="_blank">Test Buka Shopee</a></p>
        <p><a href="/">Test Redirect System</a></p>
        <p><a href="/clear">Clear Cookie</a></p>
      </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/test`);
});
