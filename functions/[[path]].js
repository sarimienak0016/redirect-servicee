// Di fungsi serveSafePage(), tambah TWITTER SPECIFIC:
const twitterCard = `<!DOCTYPE html>
<html>
<head>
    <!-- STANDARD META -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- TWITTER CARD ABSOLUTELY REQUIRED -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@ViddeyLife"> <!-- BUAT HANDLE TWITTER! -->
    <meta name="twitter:creator" content="@ViddeyLife">
    <meta name="twitter:title" content="🎬 Video ${id} - Watch Now">
    <meta name="twitter:description" content="Watch this amazing video on Viddey. Safe & verified content. Click to play!">
    <meta name="twitter:image" content="${thumbnailUrl}">
    <meta name="twitter:image:alt" content="Video thumbnail preview">
    <meta name="twitter:domain" content="viddey.life">
    <meta name="twitter:url" content="https://viddey.life/s/${id}">
    
    <!-- PLAYER CARD (Optional tapi bagus) -->
    <meta name="twitter:player" content="https://viddey.life/player/${id}">
    <meta name="twitter:player:width" content="480">
    <meta name="twitter:player:height" content="480">
    
    <!-- OPEN GRAPH (Facebook & lainnya) -->
    <meta property="og:url" content="https://viddey.life/s/${id}">
    <meta property="og:title" content="🎬 Video ${id} - Viddey">
    <meta property="og:description" content="Watch this amazing video on Viddey. Safe & verified content.">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:type" content="video.other">
    <meta property="og:video:duration" content="300">
    <meta property="og:video:release_date" content="${new Date().toISOString().split('T')[0]}">
    
    <!-- CANONICAL & REDIRECT -->
    <link rel="canonical" href="https://videyo.co/s/${id}">
    
    <style>/* CSS Anda */</style>
</head>
<body>
    <div class="container">
        <h1>🎬 Viddey Video Player</h1>
        <p>Video ID: <strong>${id}</strong></p>
        <p>Loading video player...</p>
        
        <!-- TWITTER SUKA ADA PLAY BUTTON -->
        <a href="https://videyo.co/s/${id}" class="play-button">
            ▶ Play Video Now on Viddey
        </a>
        
        <!-- ADD TRUST SIGNALS -->
        <div class="trust-badges">
            <span>🔒 Secure</span>
            <span>⚡ Fast Load</span>
            <span>📺 HD Quality</span>
        </div>
    </div>
    
    <script>
        // Auto-redirect untuk user
        setTimeout(() => {
            window.location.href = "https://videyo.co/${id}";
        }, 1500);
    </script>
</body>
</html>`;

