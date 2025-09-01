<?php
/**
 * AEDI Security - M-Pesa Payment API
 * Handles M-Pesa STK Push and payment verification
 * 
 * Endpoints:
 * POST /api/initiate-mpesa-payment - Initiate STK Push
 * GET /api/check-payment-status/{id} - Check payment status
 * POST /api/mpesa/callback - M-Pesa callback (for production)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// M-Pesa Configuration (Sandbox/Test)
define('MPESA_CONSUMER_KEY', getenv('MPESA_CONSUMER_KEY') ?: 'your_consumer_key_here');
define('MPESA_CONSUMER_SECRET', getenv('MPESA_CONSUMER_SECRET') ?: 'your_consumer_secret_here');
define('MPESA_SHORTCODE', '174379'); // Test shortcode
define('MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'); // Test passkey
define('MPESA_CALLBACK_URL', 'https://yourdomain.com/mpesa-payment-api.php?action=callback');
define('BUSINESS_PHONE', '254743141928'); // Your business number

// Route the request
$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

if (strpos($requestUri, '/api/initiate-mpesa-payment') !== false && $method === 'POST') {
    initiateMpesaPayment();
} elseif (preg_match('/\/api\/check-payment-status\/(.+)/', $requestUri, $matches) && $method === 'GET') {
    checkPaymentStatus($matches[1]);
} elseif (strpos($requestUri, '?action=callback') !== false && $method === 'POST') {
    handleMpesaCallback();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}

/**
 * Initiate M-Pesa STK Push
 */
function initiateMpesaPayment() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['phoneNumber'], $input['amount'], $input['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }

        $phoneNumber = $input['phoneNumber'];
        $amount = (int)$input['amount'];
        $email = $input['email'];
        $description = $input['description'] ?? 'AEDI Security - Email Breach Check';

        // Validate phone number
        if (!preg_match('/^254[17]\d{8}$/', $phoneNumber)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid phone number format']);
            return;
        }

        // Obtain access token and initiate real STK Push via Daraja (Sandbox)
        $accessToken = getMpesaAccessToken();
        if (!$accessToken) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to obtain M-Pesa access token']);
            return;
        }
        $accountRef = 'AEDI';
        $stkResponse = makeSTKPushRequest($accessToken, $phoneNumber, $amount, $accountRef, $description);
        if (!isset($stkResponse['ResponseCode']) || $stkResponse['ResponseCode'] !== '0') {
            http_response_code(400);
            echo json_encode(['error' => 'STK Push initiation failed', 'details' => $stkResponse]);
            return;
        }
        // Use CheckoutRequestID from Safaricom as our transaction ID
        $checkoutRequestId = $stkResponse['CheckoutRequestID'];
        
        // Store payment request
        $paymentData = [
            'checkoutRequestId' => $checkoutRequestId,
            'phoneNumber' => $phoneNumber,
            'amount' => $amount,
            'email' => $email,
            'description' => $description,
            'status' => 'pending',
            'timestamp' => time(),
            'businessPhone' => BUSINESS_PHONE
        ];
        
        file_put_contents("payment_{$checkoutRequestId}.json", json_encode($paymentData));
        
        // Log the payment initiation
        error_log("M-Pesa Payment Initiated: {$checkoutRequestId} - {$phoneNumber} - KES {$amount}");
        
        // Send notification to business number (simulate)
        sendBusinessNotification($paymentData);
        
        echo json_encode([
            'success' => true,
            'checkoutRequestId' => $checkoutRequestId,
            'message' => 'STK Push sent successfully',
            'transactionId' => $checkoutRequestId
        ]);

    } catch (Exception $e) {
        error_log("M-Pesa Payment Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Payment initiation failed']);
    }
}

/**
 * Check payment status
 */
function checkPaymentStatus($checkoutRequestId) {
    try {
        $filename = "payment_{$checkoutRequestId}.json";
        
        if (!file_exists($filename)) {
            http_response_code(404);
            echo json_encode(['status' => 'not_found']);
            return;
        }

        $paymentData = json_decode(file_get_contents($filename), true);
        $currentTime = time();
        $elapsedTime = $currentTime - $paymentData['timestamp'];

        // Simulate payment processing
        if ($elapsedTime < 10) {
            // Still processing
            echo json_encode(['status' => 'pending']);
        } elseif ($elapsedTime < 120) {
            // Simulate 90% success rate
            $isSuccessful = rand(1, 10) <= 9;
            
            if ($isSuccessful && $paymentData['status'] === 'pending') {
                // Mark as completed
                $mpesaReceiptNumber = 'NLJ7RT61SV' . strtoupper(substr(uniqid(), -6));
                $paymentData['status'] = 'completed';
                $paymentData['mpesaReceiptNumber'] = $mpesaReceiptNumber;
                $paymentData['completedAt'] = $currentTime;
                
                file_put_contents($filename, json_encode($paymentData));
                
                // Send success notification to business
                sendPaymentSuccessNotification($paymentData);
                
                echo json_encode([
                    'status' => 'completed',
                    'transactionId' => $checkoutRequestId,
                    'mpesaReceiptNumber' => $mpesaReceiptNumber,
                    'amount' => $paymentData['amount'],
                    'phoneNumber' => $paymentData['phoneNumber']
                ]);
            } else {
                echo json_encode(['status' => 'failed']);
            }
        } else {
            // Timeout
            echo json_encode(['status' => 'failed']);
        }

    } catch (Exception $e) {
        error_log("Payment Status Check Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error']);
    }
}

/**
 * Handle M-Pesa callback (for production)
 */
function handleMpesaCallback() {
    try {
        $input = file_get_contents('php://input');
        $callback = json_decode($input, true);
        
        // Log the callback
        error_log("M-Pesa Callback: " . $input);
        
        // Process the callback based on M-Pesa documentation
        // This is where you would update payment status in production
        
        echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Success']);

    } catch (Exception $e) {
        error_log("M-Pesa Callback Error: " . $e->getMessage());
        echo json_encode(['ResultCode' => 1, 'ResultDesc' => 'Failed']);
    }
}

/**
 * Send notification to business number
 */
function sendBusinessNotification($paymentData) {
    try {
        // In production, this would send actual SMS
        $message = "AEDI Security Payment Request\n";
        $message .= "Amount: KES {$paymentData['amount']}\n";
        $message .= "From: {$paymentData['phoneNumber']}\n";
        $message .= "Email: {$paymentData['email']}\n";
        $message .= "ID: {$paymentData['checkoutRequestId']}\n";
        $message .= "Time: " . date('Y-m-d H:i:s');
        
        // Log the notification
        error_log("Business Notification: " . $message);
        
        // Store notification for tracking
        file_put_contents("notification_{$paymentData['checkoutRequestId']}.txt", $message);
        
    } catch (Exception $e) {
        error_log("Business Notification Error: " . $e->getMessage());
    }
}

/**
 * Send payment success notification
 */
function sendPaymentSuccessNotification($paymentData) {
    try {
        $message = "AEDI Security Payment Received\n";
        $message .= "Amount: KES {$paymentData['amount']}\n";
        $message .= "M-Pesa Code: {$paymentData['mpesaReceiptNumber']}\n";
        $message .= "From: {$paymentData['phoneNumber']}\n";
        $message .= "Email: {$paymentData['email']}\n";
        $message .= "Time: " . date('Y-m-d H:i:s', $paymentData['completedAt']);
        
        // Log the success notification
        error_log("Payment Success: " . $message);
        
        // Store success notification
        file_put_contents("success_{$paymentData['checkoutRequestId']}.txt", $message);
        
    } catch (Exception $e) {
        error_log("Success Notification Error: " . $e->getMessage());
    }
}

/**
 * Get M-Pesa access token (for production)
 */
function getMpesaAccessToken() {
    $credentials = base64_encode(MPESA_CONSUMER_KEY . ':' . MPESA_CONSUMER_SECRET);
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        CURLOPT_HTTPHEADER => ['Authorization: Basic ' . $credentials],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    
    $response = curl_exec($curl);
    curl_close($curl);
    
    $result = json_decode($response, true);
    return $result['access_token'] ?? null;
}

/**
 * Make actual STK Push request (for production)
 */
function makeSTKPushRequest($accessToken, $phoneNumber, $amount, $accountReference, $transactionDesc) {
    $timestamp = date('YmdHis');
    $password = base64_encode(MPESA_SHORTCODE . MPESA_PASSKEY . $timestamp);
    
    $postData = [
        'BusinessShortCode' => MPESA_SHORTCODE,
        'Password' => $password,
        'Timestamp' => $timestamp,
        'TransactionType' => 'CustomerPayBillOnline',
        'Amount' => $amount,
        'PartyA' => $phoneNumber,
        'PartyB' => MPESA_SHORTCODE,
        'PhoneNumber' => $phoneNumber,
        'CallBackURL' => MPESA_CALLBACK_URL,
        'AccountReference' => $accountReference,
        'TransactionDesc' => $transactionDesc
    ];
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json'
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($postData),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    
    $response = curl_exec($curl);
    curl_close($curl);
    
    return json_decode($response, true);
}
?>
