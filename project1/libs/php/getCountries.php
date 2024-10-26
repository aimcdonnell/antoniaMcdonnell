<?php

header('Content-Type: application/json');

// Enable error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$url = "https://app.box.com/s/z3rc88qc295us9ec7u9ih1sllh17zir4";

//Initiate cURL
$ch = curl_init();
//set to true to return the transfer as a string instead of outputting it directly. We can then store the result in a variable if we want.
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//follows any location. Header that the server sends as part of the HTTP response. This will follow any redirects and cURL will automatically go to the final destination.
//It will retrieve data from the correct location.
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

//Execute the request and get the response
$result = curl_exec($ch);
if($result === false) {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL Error: ' . curl_error($ch);
    echo json_encode($output);
    exit();
};

//Close cURL session
curl_close($ch);

//Output the JSON data
echo $result;