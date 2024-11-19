<?php

header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

<<<<<<< HEAD
define('SECURE_ACCESS', true);
require_once './config.php';

$executionStartTime = microtime(true);

// No country ISO code is needed anymore
$username = GEONAMES_USERNAME;
$country = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

// URL to fetch all cities globally from Geonames API
$url = "http://api.geonames.org/searchJSON?formatted=true&country=". $country . "&cities=cities1000&username=" . $username . "&style=full&maxRows=25";
=======
$executionStartTime = microtime(true);

// No country ISO code is needed anymore
$username = "amcdonnell";
$country = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

// URL to fetch all cities globally from Geonames API
<<<<<<< HEAD
$url = "http://api.geonames.org/searchJSON?formatted=true&country=". $country . "&cities=cities1000&username=" . $username . "&style=full&maxRows=50";
>>>>>>> 99d4a8a (Adding cities to the map)
=======
$url = "http://api.geonames.org/searchJSON?formatted=true&country=". $country . "&cities=cities1000&username=" . $username . "&style=full&maxRows=25";
>>>>>>> 5008a68 (Added city markers and starting to implement points of interest data)

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

// Check if we have valid data from the Geonames API
if (isset($decode["geonames"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode["geonames"];

    echo json_encode($output);
} else {
    echo json_encode(["error" => "No city data results found"]);
}

?>