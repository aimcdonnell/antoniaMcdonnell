<?php

// Enable error reporting for debugging purposes.
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Set return headers for JSON response and cross-origin access.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Record the script start time for performance monitoring.
$executionStartTime = microtime(true);

// Define country mappings for shortened country names.
$countryMappings = [
    "Bosnia and Herz." => "Bosnia and Herzegovina",
    "Central African Rep." => "Central African Republic",
    "Czech Rep." => "Czech Republic",
    "Czechia" => "Czech Republic",
    "Dem. Rep. Congo" => "Democratic Republic of the Congo",
    "Dem. Rep. Korea" => "Democratic Republic of Korea",
    "Dominican Rep." => "Dominican Republic",
    "Eq. Guinea" => "Equatorial Guinea",
    "Falkland Is." => "Falkland Islands",
    "Solomon Is." => "Solomon Islands",
    "S. Sudan" => "South Sudan",
];

// Load configuration and check for the required Geonames username.
define('SECURE_ACCESS', true);
$config = require './config.php';

$username = GEONAMES_USERNAME;

if (empty($username)) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - Configuration";
    $output["status"]["description"] = "Geonames username is missing in the configuration.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Validate required `isoCode` and `country` parameters.
if (empty($_REQUEST["isoCode"]) || empty($_REQUEST["country"])) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Missing Parameters";
    $output["status"]["description"] = "Both ISO code and country name are required.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$isoCode = $_REQUEST["isoCode"];
$searchedCountry = $_REQUEST["country"];

// Use mapping if available, otherwise use the original country name.
$fullCountryName = $countryMappings[$searchedCountry] ?? $searchedCountry;

// URL-encode the final country name for safe usage in the URL.
$encodedCountry = urlencode($fullCountryName);

// Construct the Geonames API request URL.
$url = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" . $encodedCountry .
    "&maxRows=5&username=" . $username . "&style=full&country=" . $isoCode . "&title=" . $encodedCountry;

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
$decodedResponse = json_decode($result, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    $output["status"]["code"] = json_last_error();
    $output["status"]["name"] = "Failure - JSON Decode";
    $output["status"]["description"] = json_last_error_msg();
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Check for valid results in the API response.
if (isset($decodedResponse["geonames"]) && is_array($decodedResponse["geonames"])) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decodedResponse["geonames"];
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - No Data";
    $output["status"]["description"] = "No Geonames results found for the given country.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
}

// Output the response as JSON.
echo json_encode($output);

?>
