<?php
header('Content-Type: application/json; charset=utf-8');

$city = isset($_GET['city']) ? trim($_GET['city']) : '';
$lat  = isset($_GET['lat'])  ? trim($_GET['lat'])  : '';
$lon  = isset($_GET['lon'])  ? trim($_GET['lon'])  : '';

if (!$city && !($lat && $lon)) {
    echo json_encode(['error' => 'No location provided']);
    exit;
}

// Apni OpenWeatherMap API key yahan daalo
$apiKey = '20cc253959113279e8ad79ec90820797';

// Endpoint choose karo
if ($lat && $lon) {
    // Location ke liye current weather endpoint use karo
    $endpoint = "https://api.openweathermap.org/data/2.5/weather?lat=" . urlencode($lat) . "&lon=" . urlencode($lon) . "&units=metric&appid=" . $apiKey;
} else {
    // City name ke liye
    $endpoint = "https://api.openweathermap.org/data/2.5/weather?q=" . urlencode($city) . "&units=metric&appid=" . $apiKey;
}

// Cache settings
$cache_dir = __DIR__ . '/cache';
if (!is_dir($cache_dir)) {
    mkdir($cache_dir, 0755, true);
}
$cache_file = $cache_dir . '/' . md5($endpoint) . '.json';
$cache_ttl = 600; // 10 minutes

// Agar cache valid hai to wahi return karo
if (file_exists($cache_file) && (time() - filemtime($cache_file) < $cache_ttl)) {
    echo file_get_contents($cache_file);
    exit;
}

// API request with cURL
$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($response === false || !$response) {
    echo json_encode(['error' => 'API request failed: ' . $err]);
    exit;
}

// Cache save karo aur output bhejo
file_put_contents($cache_file, $response);
echo $response;
