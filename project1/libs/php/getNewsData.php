<?php
//Getting news data from the News API
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

if (!$isoCode) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Missing iso code for getNewsData.php";
    $output["status"]["description"] = "ISO code is required for getNewsData.php file.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Validate the format of the ISO code (2-letter uppercase).
if (!preg_match("/^[A-Z]{2}$/", $isoCode)) {
    $output["status"]["code"] = 400;
    $output["status"]["name"] = "Failure - Invalid Parameters";
    $output["status"]["description"] = "Invalid ISO code format.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

// Load configuration and set the API key.
define('SECURE_ACCESS', true);
$config = require './config.php';
$apiKey = NEWS_DATA_API_KEY;

// Construct the NewsData API request URL.
$url = "https://newsdata.io/api/1/news?apikey=" . $apiKey . "&country=" . $isoCode . "&language=en";

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

// Check for valid results and limit to 5 articles.
if (isset($decodedResponse["results"]) && is_array($decodedResponse["results"])) {
    $limitedResults = array_slice($decodedResponse["results"], 0, 5);

    $output["status"]["code"] = 200;
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = ["results" => $limitedResults];
} else {
    $output["status"]["code"] = 404;
    $output["status"]["name"] = "Failure - No Data";
    $output["status"]["description"] = "No news articles found.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
}

// Output the response as JSON.
echo json_encode($output);

?>