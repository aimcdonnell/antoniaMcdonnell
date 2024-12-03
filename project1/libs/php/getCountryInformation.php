<?php

// Enable error reporting for debugging purposes.
ini_set("display_errors", "On");
error_reporting(E_ALL);

// Set return headers for JSON response.
header("Content-Type: application/json; charset=UTF-8");

// Initiating the execution time of the routine so that it can be measured
$executionStartTime = microtime(true);

// Get the isoCode, if available
$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

// Read the contents of the JSON file
$json = file_get_contents("../js/countryInformation.json");

// Check if the file was successfully read
if ($json === false) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - File Read Error";
    $output["status"]["description"] = "Error reading the file.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
    echo json_encode($output);
    exit;
}

$countries = json_decode($json, true);

// Handle potential JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - JSON Decode Error";
    $output["status"]["description"] = json_last_error_msg();
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
    echo json_encode($output);
    exit;
}

// If no ISO code is provided, return data for all countries
if (!$isoCode) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Returning data for all countries";
    $output["data"] = $countries; // Return all countries data
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    echo json_encode($output);
    exit;
}

// Initialize the flag for checking
$found = false;

// If isoCode is provided, find the corresponding country data
foreach ($countries as $country) {
    if ($country["cca2"] === $isoCode) {
        $output["data"] = $country;
        $found = true;
        break;
    }
}

// Return the appropriate response based on the result of the search
if ($found) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Country information retrieved successfully.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - Not Found";
    $output["status"]["description"] = "Country not found for the given ISO code.";
    $output["data"] = null;
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
}



// Output the response as JSON
echo json_encode($output);

?>
