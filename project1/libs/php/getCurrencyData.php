<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Set return headers for JSON response and cross-origin access.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$executionStartTime = microtime(true);

define('SECURE_ACCESS', true);
$config = require './config.php';

$currencyApiKey = CURRENCY_API_KEY;

if (empty($currencyApiKey)) {
    $output["status"]["code"] = 500;
    $output["status"]["name"] = "Failure - Configuration";
    $output["status"]["description"] = "Currency API key is missing in the configuration.";
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;

    echo json_encode($output);
    exit;
}

$url = "https://openexchangerates.org/api/latest.json?app_id=" . $currencyApiKey;

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

$cURLERROR = curl_errno($ch);
curl_close($ch);

if ($cURLERROR) {
    $output["status"]["code"] = $cURLERROR;
    $output["status"]["name"] = "Failure - cURL";
    $output["status"]["description"] = curl_strerror($cURLERROR);
    $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
    $output["data"] = null;
} else {
    $currencies = json_decode($result, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $output["status"]["code"] = json_last_error();
        $output["status"]["name"] = "Failure - JSON";
        $output["status"]["description"] = json_last_error_msg();
        $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
        $output["data"] = null;
    } else {
        if (isset($currencies["error"])) {
            $output["status"]["code"] = $currencies["error"]["code"];
            $output["status"]["name"] = "Failure - currency API";
            $output["status"]["description"] = $currencies["error"]["message"];
            $output["status"]["seconds"] = number_format((microtime(true) - $executionStartTime), 3);
        } else {
            $output["status"]["code"] = "200";
            $output["status"]["name"] = "ok";
            $output["status"]["description"] = "success";
            $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
            $output["data"] = $currencies;
        }
    }
}

// Return the output as a JSON response.
echo json_encode($output);
?>