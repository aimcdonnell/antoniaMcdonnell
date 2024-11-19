<?php
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$username = "amcdonnell";
$lat = isset($_REQUEST["lat"]) ? $_REQUEST["lat"] : null;
$lng = isset($_REQUEST["lng"]) ? $_REQUEST["lng"] : null;

if (!$lat || !$lng) {
    echo json_encode(["error" => "Latitude or Longitude not provided"]);
    exit;
}

$url = "http://api.geonames.org/findNearbyPOIsOSMJSON?lat=" . $lat . "&lng=" . $lng . "&username=" . $username;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode["poi"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode["geonames"];
    echo json_encode($output);
} else {
    echo json_encode(["error" => "No points of interest data results found"]);
}

?>
