<?php

header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

define('SECURE_ACCESS', true);
require_once './config.php';

$executionStartTime = microtime(true);


$apiKey = OPENCAGE_API_KEY;

if (isset($_REQUEST["lat"]) && isset($_REQUEST["lng"])) {
    $lat = $_REQUEST["lat"];
    $lng = $_REQUEST["lng"];
    $url = "https://api.opencagedata.com/geocode/v1/json?q=" . $lat . "," . $lng . "&key=" . $apiKey;
} elseif (isset($_REQUEST["isoCode"])) {
    $country = urlencode($_REQUEST["isoCode"]);
    $url = "https://api.opencagedata.com/geocode/v1/json?q=" . $country . "&key=" . $apiKey;

} else {
    // Handle missing parameters, e.g., return an error response or set default values
    echo "Latitude and longitude or geocode country are required.";
    exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode["results"][0])) {

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode["results"];
    
    echo json_encode($output);
} else {
    echo json_encode(["error" => "No geocode data results found"]);
}
?>