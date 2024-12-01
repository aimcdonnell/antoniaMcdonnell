<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$executionStartTime = microtime(true);

define('SECURE_ACCESS', true);
$config = require './config.php';

// No country ISO code is needed anymore
$username = GEONAMES_USERNAME;
$country = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

// Check if $country is set before making the request
if (!$country) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Failure - Invalid Input";
    $output['status']['description'] = "Country ISO code is missing or invalid.";
    $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
    $output['data'] = null;

    echo json_encode($output, JSON_NUMERIC_CHECK);
    exit; // Terminate execution early
}

// URL to fetch all cities globally from Geonames API
$url = "http://api.geonames.org/searchJSON?formatted=true&country=". $country . "&cities=cities1000&username=" . $username . "&style=full&maxRows=25";

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

$cURLERROR = curl_errno($ch);

curl_close($ch);

if ($cURLERROR) {
    $output['status']['code'] = $cURLERROR;
    $output['status']['name'] = "Failure - cURL";
    $output['status']['description'] = curl_strerror($cURLERROR);
	$output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
	$output['data'] = null;
} else {
    $cities = json_decode($result, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $output['status']['code'] = json_last_error();
        $output['status']['name'] = "Failure - JSON";
        $output['status']['description'] = json_last_error_msg();
        $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
        $output['data'] = null;
    } else {
        if (isset($cities['error'])) {
            $output['status']['code'] = $cities['error']['code'];
            $output['status']['name'] = "Failure - Geonames";
            $output['status']['description'] = $cities['error']['message'];
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            $output['data'] = null;
        } else {
            $output['status']['code'] = "200";
            $output['status']['name'] = "ok";
            $output['status']['description'] = "all ok";
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            $output['data'] = $cities['geonames'];
        }
    }
}

echo json_encode($output, JSON_NUMERIC_CHECK);
?>