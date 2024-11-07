<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$apiKey = "0d315a3d7ebc4c95983e51902d24a8a1";

if (isset($_REQUEST["lat"]) && isset($_REQUEST["lng"])) {
    $lat = $_REQUEST["lat"];
    $lng = $_REQUEST["lng"];
} else {
    // Handle missing parameters, e.g., return an error response or set default values
    echo "Latitude and longitude are required.";
    exit;
}

$url = "https://api.opencagedata.com/geocode/v1/json?q=" . $lat . "," . $lng . "&key=" . $apiKey;

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
    echo "No results found";
}
?>