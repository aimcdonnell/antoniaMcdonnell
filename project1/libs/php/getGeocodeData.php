<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$api_key = "0d315a3d7ebc4c95983e51902d24a8a1";
$lat = $_REQUEST["lat"];
$lng = $_REQUEST["lng"];

$url = "https://api.opencagedata.com/geocode/v1/json?q=" . $lat . ',' . $lng . '&key=' . $apiKey;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>