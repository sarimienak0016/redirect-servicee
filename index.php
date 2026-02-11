<?php
// 1. SHOPEE CODES KAMU
$codes = ['8AQUp3ZesV','9pYio8K2cw','8pgBcJjIzl','60M0F7txtlS',
          '7VAo1N0hIp','9KcSCm0Xb7','3LLF3lT65E','6VIGpbCEoc'];

// 2. PILIH RANDOM CODE
$code = $codes[array_rand($codes)];

// 3. AMBIL PATH DARI URL
// Contoh: https://domain.com/v123 → path = "/v123"
$path = $_SERVER['REQUEST_URI'];

// 4. BUAT TARGET URL
$target = "https://videy.co" . $path;

// 5. SHOPEE APP URL
$shopee = "shopee://share_product/$code";
?>

<!DOCTYPE html>
<html>
<script>
// 1. BUKA SHOPEE APP
window.location.href = "<?php echo $shopee; ?>";

// 2. SETELAH 1 DETIK, KE TARGET
setTimeout(() => {
    window.location.href = "<?php echo $target; ?>";
}, 1000);
</script>
<body>Loading...</body>
</html>
