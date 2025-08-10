<?php
/**
 * Simple test script to check HaveIBeenPwned API connectivity
 */

header('Content-Type: text/plain');

echo "=== HaveIBeenPwned API Test ===\n\n";

// Test email (Adobe breach is well-known)
$test_email = 'test@adobe.com';
$api_url = 'https://haveibeenpwned.com/api/v3/breachedaccount/' . urlencode($test_email);

echo "Testing email: $test_email\n";
echo "API URL: $api_url\n\n";

// Create context
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: AEDI-Security-Test/1.0',
            'Accept: application/json'
        ],
        'timeout' => 10
    ]
]);

echo "Making API request...\n";

// Make request
$response = @file_get_contents($api_url, false, $context);

// Check response
if ($response === false) {
    echo "❌ API request failed!\n\n";
    
    // Check what went wrong
    $error = error_get_last();
    if ($error) {
        echo "Error details: " . $error['message'] . "\n";
    }
    
    // Try to get HTTP response headers
    if (isset($http_response_header)) {
        echo "\nHTTP Response Headers:\n";
        foreach ($http_response_header as $header) {
            echo "  $header\n";
        }
    }
    
    echo "\nPossible issues:\n";
    echo "- Network connectivity\n";
    echo "- API endpoint changed\n";
    echo "- Rate limiting\n";
    echo "- Server blocking requests\n";
    
} else {
    echo "✅ API request successful!\n\n";
    
    echo "Response length: " . strlen($response) . " bytes\n";
    echo "Response content:\n";
    echo $response . "\n\n";
    
    // Try to decode JSON
    $data = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        echo "✅ Valid JSON response\n";
        echo "Number of breaches found: " . count($data) . "\n";
        
        if (!empty($data)) {
            echo "\nFirst breach details:\n";
            $first_breach = $data[0];
            echo "- Name: " . ($first_breach['Name'] ?? 'Unknown') . "\n";
            echo "- Date: " . ($first_breach['BreachDate'] ?? 'Unknown') . "\n";
            echo "- Count: " . ($first_breach['PwnCount'] ?? 'Unknown') . "\n";
        }
    } else {
        echo "❌ Invalid JSON response\n";
        echo "JSON Error: " . json_last_error_msg() . "\n";
    }
}

echo "\n=== Test Complete ===\n";
?>
