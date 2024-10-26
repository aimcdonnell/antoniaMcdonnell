<?php

header('Content-Type: application/json');

// Enable error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Use Box's direct download link
$url = "https://app.box.com/s/z3rc88qc295us9ec7u9ih1sllh17zir4?raw=1";

// Initiate cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Execute the request and get the response
$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($result === false || $httpCode != 200) {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL Error: ' . curl_error($ch);
    echo json_encode($output);
    exit();
}

// Close cURL session
curl_close($ch);

// Output the JSON data
echo $result;
