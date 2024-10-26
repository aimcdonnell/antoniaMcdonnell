<?php

header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache"); // For HTTP/1.0 compatibility

// Enable error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Change the path to your locally saved file
$filePath = "project1/libs/js/countryBorders.geo.json";

// Check if the file exists and output its content
if (file_exists($filePath)) {
    $jsonData = file_get_contents($filePath);
    header('Content-Type: application/json');
    echo $jsonData;
} else {
    echo json_encode(["error" => "File not found."]);
}