<?php
//Getting currency data from the Open Exchange Rates API
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

define('SECURE_ACCESS', true);
require_once './config.php';

$executionStartTime = microtime(true);

$apiKey = CURRENCY_API_KEY;

$url = "https://openexchangerates.org/api/latest.json?app_id=" . $apiKey;

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode["rates"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode;

    echo json_encode($output);
} else {
    echo json_encode(["error" => "No currency data results found"]);
}

?>