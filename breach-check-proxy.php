<?php
/**
 * AEDI Security - Free Breach Check Proxy
 * This PHP file acts as a server-side proxy to bypass CORS issues
 * Upload this to your hosting's public_html directory
 */

// Enable CORS for local development and production
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Allow-Credentials: false');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get email from request
$email = isset($_GET['email']) ? $_GET['email'] : (isset($_POST['email']) ? $_POST['email'] : '');

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email parameter is required']);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

// Rate limiting (simple file-based)
$rate_limit_file = 'breach_check_rate_limit.txt';
$current_time = time();
$rate_limit_window = 2; // 2 seconds between requests

if (file_exists($rate_limit_file)) {
    $last_request = (int)file_get_contents($rate_limit_file);
    if (($current_time - $last_request) < $rate_limit_window) {
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded. Please wait 2 seconds between requests.']);
        exit();
    }
}

// Update rate limit file
file_put_contents($rate_limit_file, $current_time);

// HaveIBeenPwned API URL
$api_url = 'https://haveibeenpwned.com/api/v3/breachedaccount/' . urlencode($email) . '?truncateResponse=false';

// Create context for the request
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: AEDI-Security-Breach-Checker/1.0',
            'Accept: application/json'
        ],
        'timeout' => 10
    ]
]);

// Make the API request with better error handling
$response = @file_get_contents($api_url, false, $context);
$http_response_header_copy = $http_response_header ?? [];

// Debug: Log the request attempt
error_log("HIBP API Request: " . $api_url);
error_log("Response: " . ($response === false ? 'FALSE' : 'SUCCESS'));

// Check if request was successful
if ($response === false) {
    // Get the actual HTTP response code
    $response_code = 0;
    if (!empty($http_response_header_copy)) {
        $status_line = $http_response_header_copy[0];
        error_log("HTTP Status: " . $status_line);

        if (preg_match('/HTTP\/\d\.\d\s+(\d+)/', $status_line, $matches)) {
            $response_code = (int)$matches[1];
        }
    }

    // Handle 404 (no breaches found) - this is actually success!
    if ($response_code === 404) {
        echo json_encode([
            'isBreached' => false,
            'breaches' => [],
            'message' => 'Good news! Your email was not found in any known data breaches.',
            'source' => 'HaveIBeenPwned (Server-side)',
            'debug' => 'HTTP 404 - No breaches found (this is good!)'
        ]);
        exit();
    }

    // Handle rate limiting
    if ($response_code === 429) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Please wait a moment and try again',
            'debug' => 'HTTP 429 - Rate limited by HIBP API'
        ]);
        exit();
    }

    // API request failed for other reasons
    http_response_code(503);
    echo json_encode([
        'error' => 'Breach checking service temporarily unavailable',
        'message' => 'Please try again later or visit haveibeenpwned.com directly',
        'debug' => 'HTTP ' . $response_code . ' - API request failed',
        'headers' => $http_response_header_copy
    ]);
    exit();
}

// Parse the response
$breaches = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from breach checking service']);
    exit();
}

// Calculate risk score
$risk_score = 0;
if (!empty($breaches)) {
    $risk_score = min(count($breaches) * 15, 60);
    
    // Add points for verified breaches
    foreach ($breaches as $breach) {
        if (isset($breach['IsVerified']) && $breach['IsVerified']) {
            $risk_score += 10;
        }
        if (isset($breach['IsSensitive']) && $breach['IsSensitive']) {
            $risk_score += 15;
        }
    }
    
    $risk_score = min($risk_score, 100);
}

// Format response
$formatted_response = [
    'isBreached' => !empty($breaches),
    'breachCount' => count($breaches),
    'breaches' => $breaches,
    'riskScore' => $risk_score,
    'message' => empty($breaches) 
        ? 'Good news! Your email was not found in any known data breaches.'
        : 'Your email was found in ' . count($breaches) . ' breach' . (count($breaches) > 1 ? 'es' : ''),
    'source' => 'HaveIBeenPwned (Server-side)',
    'lastChecked' => date('c')
];

// Log successful check (optional)
$log_entry = date('Y-m-d H:i:s') . " - Breach check for domain: " . substr($email, strpos($email, '@')) . " - Result: " . (empty($breaches) ? 'Clean' : count($breaches) . ' breaches') . "\n";
@file_put_contents('breach_check_log.txt', $log_entry, FILE_APPEND | LOCK_EX);

// Return the response
echo json_encode($formatted_response);
?>
