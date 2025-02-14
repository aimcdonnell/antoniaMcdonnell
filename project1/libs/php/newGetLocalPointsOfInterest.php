<?php 

ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Set return headers for JSON response and cross-origin access.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$executionStartTime = microtime(true);

define('SECURE_ACCESS', true);
$config = require './config.php';

$locationIQApiKey = LOCATIONIQ_API_KEY;

if (empty($locationIQApiKey)) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - Configuration";
    $output["status"]["description"] = "LocationIQ API key is missing in the configuration.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$lat = isset($_REQUEST["lat"]) ? $_REQUEST["lat"] : null;
$lon = isset($_REQUEST["lng"]) ? $_REQUEST["lng"] : null;

if (!$lat || !$lng) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Error retrieving lat or lng value from getPointsOfInterest.php";
    $output["status"]["description"] = "Latitude and/or longitude is missing or invalid.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$url = "https://eu1.locationiq.com/v1/nearby.php?key=" . $locationIQApiKey . "&lat=" . $lat . "&lon=" . $lon . "&radius=1000&format=json";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Execute the cURL request and store the response.
$result = curl_exec($ch);

// Check for cURL errors.
$cURLERROR  = curl_error($ch);
curl_close($ch);

if ($cURLERROR) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = $cURLERROR;
    $output["status"]["description"] = curl_strerror($cURLERROR);
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
} else {
    // Decode the JSON response.
    $poiData = json_decode($result, true);
}

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

if (isset($poiData[0])) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Points of Interest found.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = $poiData;
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - No Points of Interest found";
    $output["status"]["description"] = "No Points of Interest found.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
}

//Return the output as a JSON response.
echo json_encode($output);
?>