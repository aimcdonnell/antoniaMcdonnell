<?php

header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

<<<<<<< HEAD
define('SECURE_ACCESS', true);
require_once './config.php';

$executionStartTime = microtime(true);

$apiKey = WEATHER_API_KEY;
=======
$executionStartTime = microtime(true);

$apiKey = "7f4a1ebae420da2cc92d2f9d2ac7cbf5";
>>>>>>> b32b2f7 (Adding weather info for each country's capital city)

if (isset($_REQUEST["lat"]) && isset($_REQUEST["lng"])) {
    $lat = $_REQUEST["lat"];
    $lng = $_REQUEST["lng"];
} else {
    echo "Latitude and longitude are required.";
    exit;
}

$url = "https://api.openweathermap.org/data/2.5/forecast?lat=" . $lat . "&lon=" . $lng . "&appid=" . $apiKey . "&units=metric";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode["list"][0])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode;

    echo json_encode($output);
} else {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    echo json_encode(["error" => "No weather results found"]);
=======
    echo "No results found";
>>>>>>> b32b2f7 (Adding weather info for each country's capital city)
=======
    echo json_encode(["error" => "No results found"]);
>>>>>>> cda1cca (Adding Wikipedia PHP and jQuery AJAX request)
=======
    echo json_encode(["error" => "No weather results found"]);
>>>>>>> 2b5de68 (Unifying php status code if/else statements)
}

?>