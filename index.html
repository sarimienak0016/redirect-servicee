<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video Stream</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      height: 100vh;
      overflow: hidden;
    }
    
    #redirect-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      text-align: center;
      padding: 20px;
      cursor: pointer;
    }
    
    .click-box {
      background: #EE4D2D;
      color: white;
      padding: 20px 40px;
      border-radius: 10px;
      font-size: 24px;
      font-weight: bold;
      margin: 30px 0;
      transition: transform 0.2s;
      pointer-events: none;
    }
    
    .instruction {
      font-size: 18px;
      margin-top: 20px;
      opacity: 0.9;
      pointer-events: none;
    }
    
    h1 {
      pointer-events: none;
    }
    
    #redirect-overlay:hover .click-box {
      transform: scale(1.05);
    }
    
    #redirect-overlay:active {
      background: rgba(0, 0, 0, 0.90);
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(238, 77, 45, 0); }
      100% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0); }
    }
    
    .click-box {
      animation: pulse 2s infinite;
    }
  </style>
</head>
<body>
  <div id="redirect-overlay">
    <h1>🎬 Video Player</h1>
    <div class="click-box">
      KLIK DIMANAPUN UNTUK PLAY VIDEO
    </div>
    <div class="instruction">
      Klik di area manapun<br>
      <small></small>
    </div>
  </div>

  <script>
    // DEEP LINKS untuk buka APLIKASI Shopee (ACAK)
    const SHOPEE_DEEP_LINKS = [
      // Android Intent (paling efektif)
      'intent://main#Intent;package=com.shopee.id;scheme=shopee;end',
      'intent://main#Intent;package=com.shopee.id;action=android.intent.action.VIEW;scheme=shopee;end',
      // iOS & Android deep links
      'shopee://',
      'shopee.co.id://',
      'com.shopee.id://'
    ];
    
    // AFFILIATE LINKS untuk fallback (ACAK)
    const AFFILIATE_LINKS = [
      'https://s.shopee.co.id/8AQUp3ZesV',
      'https://s.shopee.co.id/9pYio8K2cw', 
      'https://s.shopee.co.id/8pgBcJjIzl',
      'https://s.shopee.co.id/60M0F7txlS',
      'https://s.shopee.co.id/7VAo1N0hIp',
      'https://s.shopee.co.id/9KcSCm0Xb7',
      'https://s.shopee.co.id/3LLF3lT65E',
      'https://s.shopee.co.id/6VIGpbCEoc'
    ];
    
    const BASE_URL = 'https://vidstrm.cloud';
    let hasClicked = false;
    
    // Fungsi untuk ambil link ACAK
    function getRandomAffiliateLink() {
      return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    }
    
    // Fungsi buka aplikasi Shopee
    function openShopeeApp() {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      if (!isMobile) {
        // Desktop - buka tab baru dengan link ACAK
        window.open(getRandomAffiliateLink(), '_blank');
        return;
      }
      
      if (isAndroid) {
        // Android pakai Intent (paling ampuh)
        try {
          // Coba intent pertama
          window.location.href = 'intent://main#Intent;package=com.shopee.id;scheme=shopee;end';
          
          // Fallback: kalau gak kebuka dalam 2 detik, buka web ACAK
          setTimeout(() => {
            if (!hasClicked) {
              window.location.href = getRandomAffiliateLink();
            }
          }, 2000);
        } catch (e) {
          window.location.href = getRandomAffiliateLink();
        }
      } else {
        // iOS pakai deep link biasa
        // Coba buka deep link dengan iframe trick
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'shopee://';
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
          // Kalau masih di halaman ini setelah 500ms, buka web ACAK
          setTimeout(() => {
            if (document.body.contains(iframe) || !hasClicked) {
              window.location.href = getRandomAffiliateLink();
            }
          }, 500);
        }, 500);
      }
    }
    
    // Versi alternatif: buka link ACAK di tab baru dulu, baru redirect
    function openShopeeWithTab() {
      if (hasClicked) return;
      hasClicked = true;
      
      // 1. Buka Shopee affiliate ACAK di tab baru
      const shopeeUrl = getRandomAffiliateLink();
      window.open(shopeeUrl, '_blank');
      
      // 2. Langsung redirect ke vidstrm di tab sekarang
      setTimeout(() => {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = BASE_URL + currentPath;
      }, 300);
    }
    
    // Versi: coba buka aplikasi, kalau gagal baru tab baru
    function handleClick() {
      if (hasClicked) return;
      hasClicked = true;
      
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile: coba buka aplikasi dulu
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        
        // Pilih random deep link atau intent
        const deepLinks = ['shopee://', 'shopee.co.id://', 'intent://main#Intent;package=com.shopee.id;scheme=shopee;end'];
        const randomDeepLink = deepLinks[Math.floor(Math.random() * deepLinks.length)];
        
        iframe.src = randomDeepLink;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
          
          // Jika masih di halaman ini, buka web ACAK di tab baru
          setTimeout(() => {
            const shopeeUrl = getRandomAffiliateLink();
            window.open(shopeeUrl, '_blank');
            
            // Redirect ke vidstrm
            setTimeout(() => {
              const currentPath = window.location.pathname + window.location.search;
              window.location.href = BASE_URL + currentPath;
            }, 300);
          }, 500);
        }, 500);
      } else {
        // Desktop: langsung buka tab baru ACAK
        openShopeeWithTab();
      }
    }
    
    // Setup event listeners
    const overlay = document.getElementById('redirect-overlay');
    
    // Klik di mana saja di overlay
    overlay.addEventListener('click', handleClick);
    
    // Touch event untuk mobile
    overlay.addEventListener('touchstart', function(e) {
      e.preventDefault();
      handleClick();
    });
    
    // Tekan tombol keyboard juga
    document.addEventListener('keydown', function(e) {
      if ((e.code === 'Space' || e.code === 'Enter') && !hasClicked) {
        e.preventDefault();
        handleClick();
      }
    });
    
    // Auto redirect setelah 10 detik (fallback)
    setTimeout(() => {
      if (!hasClicked) {
        console.log('Auto redirect setelah 10 detik');
        handleClick();
      }
    }, 10000);
    
    console.log('Siap: Klik di mana saja untuk buka aplikasi Shopee');
    console.log('Total affiliate links:', AFFILIATE_LINKS.length);
  </script>
</body>
</html>
