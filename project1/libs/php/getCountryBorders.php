<?php

// Enable error reporting for debugging purposes.
ini_set("display_errors", "On");
error_reporting(E_ALL);

// Set return headers for JSON response.
header("Content-Type: application/json; charset=UTF-8");

// Record the script start time for performance monitoring.
$executionStartTime = microtime(true);

// Retrieve the ISO code from the request.
$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

// Check if the ISO code is provided.
if (!$isoCode) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Missing Parameter";
    $output["status"]["description"] = "ISO code is required.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Attempt to read the contents of the JSON file.
$json = file_get_contents("../js/countryBorders.geo.json");

// Check if the file was successfully read.
if ($json === false) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - File Read";
    $output["status"]["description"] = "Error reading the countryBorders.geo.json file.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Decode the JSON string into an associative array.
$countryBorders = json_decode($json, true);

// Handle potential JSON decoding errors.
if (json_last_error() !== JSON_ERROR_NONE) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - JSON Decode";
    $output["status"]["description"] = json_last_error_msg();
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Check if the decoded JSON contains the "features" key.
if (!isset($countryBorders["features"])) {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - Data Missing";
    $output["status"]["description"] = "No 'features' key found in the decoded JSON.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Initialize variables.
$found = false;

// Search for the country with the matching ISO code.
foreach ($countryBorders["features"] as $countryBorder) {
    if ($countryBorder["properties"]["iso_a2"] === $isoCode) {
        $output["data"] = $countryBorder["geometry"]["coordinates"];
        $found = true;
        break;
    }
}

// Return the appropriate response based on the result of the search.
if ($found) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Country border data retrieved successfully.";
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - Not Found";
    $output["status"]["description"] = "No country data found for the given ISO code.";
    $output["data"] = null;
}

// Include the script execution time in the response.
$output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);

// Output the response as JSON.
echo json_encode($output);

?>
