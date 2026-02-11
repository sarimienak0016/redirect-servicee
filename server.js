const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://videy.co';

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

app.use(async (req, res) => {
  try {
    const currentPath = req.url;
    const targetUrl = BASE_URL + currentPath;

    const response = await fetch(targetUrl);
    let html = await response.text();

    const injectedScript = `
<script>
  (function() {
    const links = ${JSON.stringify(AFFILIATE_LINKS)};
    const originalUrl = '${targetUrl}';
    let triggered = false;

    function openAffiliate() {
      if (triggered) return;
      triggered = true;

      const shopeeUrl = links[Math.floor(Math.random() * links.length)];

      // buka Shopee dari klik user (lebih kecil kemungkinan diblok)
      window.open(shopeeUrl, '_blank');

      // redirect ke vidstrm
      setTimeout(function() {
        window.location.href = originalUrl;
      }, 400);
    }

    // Tangkap klik pertama
    document.addEventListener('click', openAffiliate, { once: true });
    document.addEventListener('touchstart', openAffiliate, { once: true });

  })();
</script>
`;

    // Inject sebelum </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', injectedScript + '</body>');
    } else {
      html += injectedScript;
    }

    // Fix internal link agar tetap lewat proxy
    html = html.replace(/href="https:\\/\\/videy\\.co\\//g, 'href="/');

    res.set('Content-Type', 'text/html').send(html);

  } catch (error) {
    console.error('Error:', error);

    // fallback → redirect ke affiliate random
    const randomLink =
      AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];

    res.redirect(randomLink);
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
