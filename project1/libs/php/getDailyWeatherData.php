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

$weatherApiKey = WEATHER_API_KEY;

if(empty($weatherApiKey)) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - Configuration";
    $output["status"]["description"] = "Weather API key is missing in the configuration.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$lat = isset($_REQUEST["lat"]) ? $_REQUEST["lat"] : null;
$lng = isset($_REQUEST["lng"]) ? $_REQUEST["lng"] : null;

if(!$lat || !$lng) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Error retrieving lat or lng value from getDailyWeatherData.php";
    $output["status"]["description"] = "Latitude and/or longitude is missing or invalid.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$url = "https://api.openweathermap.org/data/2.5/forecast?lat=" . $lat . "&lon=" . $lng . "&appid=" . $weatherApiKey . "&units=metric";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Execute the API request and capture the result.
$result = curl_exec($ch);

// Check for cURL errors.
$cURLERROR = curl_errno($ch);
curl_close($ch);

if ($cURLERROR) {
    $output["status"]["code"] = $cURLERROR;
    $output["status"]["name"] = "Failure - cURL";
    $output["status"]["description"] = curl_strerror($cURLERROR);
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
} else {
    // Decode the JSON response.
    $weather = json_decode($result, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $output["status"]["code"] = json_last_error();
        $output["status"]["name"] = "Failure - JSON";
        $output["status"]["description"] = json_last_error_msg();
        $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
        $output["data"] = null;
    } else {
        // Check for API-specific errors.
        if (isset($weather["error"])) {
            $output["status"]["code"] = $weather["error"]["code"];
            $output["status"]["name"] = "Failure - Geonames API";
            $output["status"]["description"] = $weather["error"]["message"];
            $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
            $output["data"] = null;
        } else {
            // Prepare the response data.
            $output["status"]["code"] = 200;
            $output["status"]["name"] = "ok";
            $output["status"]["description"] = "Data retrieved successfully.";
            $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
            $output["data"] = $weather;
        }
    }
}

// Return the output as a JSON response.
echo json_encode($output);

?>