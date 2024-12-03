<?php

// Enable error reporting for debugging purposes.
ini_set("display_errors", "On");
error_reporting(E_ALL);

// Set return headers for JSON response.
header("Content-Type: application/json; charset=UTF-8");

// Record the script start time for performance monitoring.
$executionStartTime = microtime(true);

//Read the contents of the JSON file
$json = file_get_contents("../js/countryBorders.geo.json");

if ($json === false) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - File Read";
    $output["status"]["description"] = "Error reading the countryBorders.geo.json file.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

//Decode the JSON string
$decode = json_decode($json, true);

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
if (!isset($decode["features"])) {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - Data Missing";
    $output["status"]["description"] = "No 'features' key found in the decoded JSON.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Iterate over the "features" array to extract country data.
$countryData = [];
foreach ($decode["features"] as $country) {
    $countryData[] = [
        "iso_a2" => $country["properties"]["iso_a2"],
        "name" => $country["properties"]["name"]
    ];
}

// Return the successful response with the country data.
$output["status"]["code"] = 200;
$output["status"]["name"] = "ok";
$output["status"]["description"] = "Data retrieved successfully.";
$output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
$output["data"] = $countryData;

echo json_encode($output);

?>