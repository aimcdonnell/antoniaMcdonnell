<?php

// Enable error reporting for debugging purposes.
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Set return headers for JSON response and cross-origin access.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Record the script start time for performance monitoring.
$executionStartTime = microtime(true);

// Load configuration settings securely.
define('SECURE_ACCESS', true);
$config = require './config.php';

// Validate the OpenCage API key.
$opencageApiKey = OPENCAGE_API_KEY;

if (empty($opencageApiKey)) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - Configuration";
    $output["status"]["description"] = "OpenCage API key is missing in the configuration.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Determine the API request URL based on input parameters.
if (isset($_REQUEST["lat"]) && isset($_REQUEST["lng"])) {
    $lat = $_REQUEST["lat"];
    $lng = $_REQUEST["lng"];
    $url = "https://api.opencagedata.com/geocode/v1/json?q=" . $lat . "," . $lng . "&key=" . $opencageApiKey;
} elseif (isset($_REQUEST["isoCode"])) {
    $isoCode = urlencode($_REQUEST["isoCode"]);
    $url = "https://api.opencagedata.com/geocode/v1/json?q=" . $isoCode . "&key=" . $opencageApiKey;
} elseif (isset($_REQUEST["capital"])) {
    $capital = urlencode($_REQUEST["capital"]);
    $url = "https://api.opencagedata.com/geocode/v1/json?q=" . $capital . "&key=" . $opencageApiKey;
} else {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Missing Parameters";
    $output["status"]["description"] = "Latitude/Longitude, ISO code, or Capital is required.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Perform the API request.
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
$cURLERROR = curl_errno($ch);
curl_close($ch);

// Handle cURL errors.
if ($cURLERROR) {
    $output["status"]["code"] = $cURLERROR;
    $output["status"]["name"] = "Failure - cURL";
    $output["status"]["description"] = curl_strerror($cURLERROR);
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Decode the API response.
$decode = json_decode($result, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    $output["status"]["code"] = json_last_error();
    $output["status"]["name"] = "Failure - JSON Decode";
    $output["status"]["description"] = json_last_error_msg();
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Check for results in the API response.
if (isset($decode["results"][0])) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode["results"];
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - No Data";
    $output["status"]["description"] = "No geocode data results found.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
}

// Return the output as a JSON response.
echo json_encode($output);
?>
