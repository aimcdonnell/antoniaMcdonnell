<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//Set return headers for JSON response.
header("Content-Type: application/json; charset=UTF-8");

$executionStartTime = microtime(true);

$countryIsoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;


// Check if the ISO code is provided.
if (!$countryIsoCode) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Missing iso code from getRenewableEnergy.php";
    $output["status"]["description"] = "ISO code is required";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$json = file_get_contents("../js/renewableEnergyData.json");

// Check if the file was successfully read.
if ($json === false) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - File Read of getRenewableEnergyData.json";
    $output["status"]["description"] = "Error reading the countryBorders.geo.json file.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$renewableSources = json_decode($json, true);

// Handle potential JSON decoding errors.
if (json_last_error() !== JSON_ERROR_NONE) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - JSON Decode from getRenewableEnergyData.php";
    $output["status"]["description"] = json_last_error_msg();
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$found = false;

foreach ($renewableSources as $renewableSource) {
    if ($renewableSource["iso_code"] === $countryIsoCode) {
        $output["data"] = $renewableSource;
        $found = true;
        break;
    }
}

// Return the appropriate response based on the result of the search.
if ($found) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Renewable energy data retrieved successfully.";
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - Not Found";
    $output["status"]["description"] = "No renewable energy data found for the given ISO code.";
    $output["data"] = null;
}

// Include the script execution time in the response.
$output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);

// Output the response as JSON.
echo json_encode($output);

?>