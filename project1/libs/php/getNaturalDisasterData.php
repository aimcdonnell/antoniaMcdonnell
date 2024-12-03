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

// Validate the required `country` parameter.
if (!isset($_REQUEST["country"])) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Missing Parameters";
    $output["status"]["description"] = "Natural disaster country is required.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$selectedDisasterCountry = $_REQUEST["country"];
$fullCountryName = $countryMappings[$selectedDisasterCountry] ?? $selectedDisasterCountry;
$encodedCountry = urlencode($fullCountryName);

// Construct the ReliefWeb API request URL.
$url = "https://api.reliefweb.int/v1/disasters?appname=rwint-user-0&profile=list&preset=latest&slim=1&country=" . $encodedCountry . "&limit=100";

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
$naturalDisasters = json_decode($result, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    $output["status"]["code"] = json_last_error();
    $output["status"]["name"] = "Failure - JSON Decode";
    $output["status"]["description"] = json_last_error_msg();
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Filter the data for matching disasters.
$filteredData = [];

if (isset($naturalDisasters["data"]) && is_array($naturalDisasters["data"])) {
    foreach ($naturalDisasters["data"] as $naturalDisaster) {
        if (isset($naturalDisaster["fields"]["country"]) && is_array($naturalDisaster["fields"]["country"])) {
            foreach ($naturalDisaster["fields"]["country"] as $country) {
                if (isset($country["name"]) && $country["name"] === urldecode($encodedCountry)) {
                    $filteredData[] = $naturalDisaster;
                    break;
                }
            }
        }
    }
}

// Prepare and output the final response.
if (!empty($filteredData)) {
    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $filteredData;
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - No Data";
    $output["status"]["description"] = "No extreme weather events found.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
}

echo json_encode($output);

?>
