const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// tujuan akhir
const FINAL_BASE_URL = 'https://vidtronx.com';

// telegram
const TELEGRAM = 'https://t.me/viddayvid';

// affiliate
const AFFILIATE_LINKS = [
  'https://s.shopee.co.id/4qA9Bh0rNF',
  'https://s.shopee.co.id/8V3RYSQETG',
  'https://s.shopee.co.id/9KcXC4pyuT'
];

// random affiliate
function getRandomAffiliate() {
  return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
}

// semua route
app.get('*', (req, res) => {

  const path = req.path.replace(/^\/+/, '');
  const videoId = path || 'default';

  const html = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watch Video</title>

    <style>
      body{
        margin:0;
        background:#000;
        color:#fff;
        font-family:sans-serif;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
      }

      .box{
        text-align:center;
        max-width:400px;
        width:100%;
        padding:20px;
      }

      .thumb{
        width:100%;
        border-radius:12px;
        margin-bottom:20px;
      }

      .btn{
        width:100%;
        padding:14px;
        margin:10px 0;
        border:none;
        border-radius:10px;
        font-size:16px;
        cursor:pointer;
      }

      .play{
        background:#16a34a;
        color:#fff;
      }

      .tele{
        background:#2563eb;
        color:#fff;
      }

      .loading{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:#000;
        display:none;
        justify-content:center;
        align-items:center;
        font-size:20px;
        z-index:999;
      }
    </style>
  </head>

  <body>

    <div class="box">

      <img class="thumb" src="https://i.imgur.com/8Km9tLL.jpg">

      <h2>Watch Full Video</h2>

      <button class="btn play" onclick="goVideo()">▶ Lanjut Video</button>
      <button class="btn tele" onclick="goTele()">📲 Join Telegram</button>

    </div>

    <div class="loading" id="loading">
      Loading video...
    </div>

    <script>

      const FINAL = "${FINAL_BASE_URL}";
      const TELE = "${TELEGRAM}";
      const AFF = ${JSON.stringify(AFFILIATE_LINKS)};

      function rand(){
        return AFF[Math.floor(Math.random()*AFF.length)];
      }

      function randomDelay(){
        return Math.floor(Math.random() * 3000) + 2000;
      }

      function goVideo(){

        let id = window.location.pathname.split("/").pop() || "default";

        // buka affiliate
        window.open(rand(), "_blank");

        // tampil loading
        document.getElementById("loading").style.display = "flex";

        // delay random
        let delay = randomDelay();

        setTimeout(()=>{
          window.location.href = FINAL.replace(/\\/$/,"") + "/e/" + id;
        }, delay);

      }

      function goTele(){
        window.location.href = TELE;
      }

    </script>

  </body>
  </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
