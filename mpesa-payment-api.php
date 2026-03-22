<?php
/**
 * AEDI Security - M-Pesa Payment API (Shim)
 * This file delegates all requests to the backend implementation to avoid duplication.
 * Legacy paths and server rewrites that target this file will continue to work.
 */

require_once __DIR__ . '/backend/mpesa-payment-api.php';
