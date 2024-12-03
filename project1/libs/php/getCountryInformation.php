<?php

// Enable error reporting for debugging purposes.
ini_set("display_errors", "On");
error_reporting(E_ALL);

// Set return headers for JSON response.
header("Content-Type: application/json; charset=UTF-8");


//initiating the execution time of the routine so that it can be measured
$executionStartTime = microtime(true);

$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

if (!$isoCode) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Missing iso code from getCountryInformation.php";
    $output["status"]["description"] = "ISO code is required for getCountryInformation.php file.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Read the contents of the JSON file.
$json = file_get_contents("../js/countryInformation.json");

// Check if the file was successfully read.
if ($json === false) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - File Read of countryBorders.geo.json in getCountryInformation.php";
    $output["status"]["description"] = "Error reading the file in getCountryInformation.php.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$countries = json_decode($json, true);

// Handle potential JSON decoding errors.
if (json_last_error() !== JSON_ERROR_NONE) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - JSON Decode from getCountryInformation.php";
    $output["status"]["description"] = json_last_error_msg();
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Check if the decoded JSON contains the "features" key.
if (!isset($countries)) {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - Data Missing from getCountryInformation.php";
    $output["status"]["description"] = "No 'features' key found in the decoded JSON.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Initialize variables
$found = false;

//amend this
foreach($countries as $country) {
    if ($country["cca2"] === $isoCode) {
        $output["data"] = $country;
        $found = true;
        break;
    }
}

// Return the appropriate response based on the result of the search.
if ($found) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Country information data retrieved successfully.";
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - Not Found";
    $output["status"]["description"] = "No country information data found for the given ISO code.";
    $output["data"] = null;
}

// Include the script execution time in the response.
$output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);

// Output the response as JSON.
echo json_encode($output);

?>