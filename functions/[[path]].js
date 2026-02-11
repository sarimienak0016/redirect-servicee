export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const affiliateLinks = [
    "https://shopee.co.id/affiliate_link_1",
    "https://shopee.co.id/affiliate_link_2",
    "https://shopee.co.id/affiliate_link_3"
  ];

  const randomAffiliate =
    affiliateLinks[Math.floor(Math.random() * affiliateLinks.length)];

  const finalTarget = `https://videy.co${path}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <script>
      // coba buka shopee app
      window.location.href = "${randomAffiliate}";

      // kalau dalam 3 detik masih di browser → lanjut ke videy
      setTimeout(function() {
        window.location.href = "${finalTarget}";
      }, 3000);
    </script>
  </head>
  <body>
    <p>Loading...</p>
  </body>
  </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
