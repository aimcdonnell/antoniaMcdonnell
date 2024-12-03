<?php

// Enable error reporting for debugging purposes.
// Remove or comment out these lines once the script is stable.
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

// Retrieve Geonames username from the configuration file.
$username = GEONAMES_USERNAME;

// Get the ISO code from the request; default to null if not provided.
$country = isset($_REQUEST['isoCode']) ? $_REQUEST['isoCode'] : null;

// Validate input to ensure a country ISO code is provided.
if (!$country) {
    $output['status']['code'] = 400;
    $output['status']['name'] = "Failure - Invalid Input";
    $output['status']['description'] = "Country ISO code is missing or invalid.";
    $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
    $output['data'] = null;

    echo json_encode($output, JSON_NUMERIC_CHECK);
    exit;
}

// Construct the Geonames API URL to fetch city data for the given country.
$url = "http://api.geonames.org/searchJSON?formatted=true&country=" . $country . "&cities=cities1000&username=" . $username . "&style=full&maxRows=25";

// Initialize cURL for the API request.
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
    $output['status']['code'] = $cURLERROR;
    $output['status']['name'] = "Failure - cURL";
    $output['status']['description'] = curl_strerror($cURLERROR);
    $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
    $output['data'] = null;
} else {
    // Decode the JSON response.
    $cities = json_decode($result, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $output['status']['code'] = json_last_error();
        $output['status']['name'] = "Failure - JSON";
        $output['status']['description'] = json_last_error_msg();
        $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
        $output['data'] = null;
    } else {
        // Check for API-specific errors.
        if (isset($cities['error'])) {
            $output['status']['code'] = $cities['error']['code'];
            $output['status']['name'] = "Failure - Geonames API";
            $output['status']['description'] = $cities['error']['message'];
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            $output['data'] = null;
        } else {
            // Prepare the response data.
            $output['status']['code'] = 200;
            $output['status']['name'] = "Success";
            $output['status']['description'] = "Data retrieved successfully.";
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            $output['data'] = $cities['geonames'];
        }
    }
}

// Return the output as a JSON response.
echo json_encode($output, JSON_NUMERIC_CHECK);

?>
