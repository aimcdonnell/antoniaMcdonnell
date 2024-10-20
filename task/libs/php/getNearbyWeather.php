<?php
<<<<<<< HEAD
<<<<<<< HEAD
// Set header for JSON response
header('Content-Type: application/json; charset=UTF-8');

// Enable error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Start execution time tracking
$executionStartTime = microtime(true);

// Ensure lat and lng are set
if (isset($_REQUEST['lat']) && isset($_REQUEST['lng'])) {
    $lat = $_REQUEST['lat'];
    $lng = $_REQUEST['lng'];
} else {
    // Return error if lat/lng not provided
    $output['status']['code'] = '400';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Missing latitude or longitude';
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    echo json_encode($output);
    exit();
}

// Concatenate API URL
$url = 'https://api.geonames.org/findNearByWeatherJSON?formatted=true&lat=' . trim($lat) . '&lng=' . trim($lng) . '&username=amcdonnell&style=full';

// Log the correct API URL
//echo 'API URL: ' . $url;

// Initiate cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Execute cURL and handle errors
$result = curl_exec($ch);
if ($result === false) {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL Error: ' . curl_error($ch);
    echo json_encode($output);
    exit();
}
curl_close($ch);

// Decode API response
$decode = json_decode($result, true);
if ($decode === null) {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Invalid JSON returned from API';
    echo json_encode($output);
    exit();
}

// Check for valid data and output
if (isset($decode['weatherObservation'])) {
    $output['status']['code'] = '200';
    $output['status']['name'] = 'ok';
    $output['status']['description'] = 'success';
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    $output['data'] = $decode['weatherObservation'];
} else {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Failed to retrieve data from the API';
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
}

echo json_encode($output);
=======
	//header is a function that sets the HTTP headers for the response
	header('Content-Type: application/json; charset=UTF-8');
=======
// Set header for JSON response
header('Content-Type: application/json; charset=UTF-8');
>>>>>>> 8ce53cf (Amended input ids in html code and script.js code. Also amended PHP file to successfully retrieve and display data on the frront-end)

// Enable error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Start execution time tracking
$executionStartTime = microtime(true);

// Ensure lat and lng are set
if (isset($_REQUEST['lat']) && isset($_REQUEST['lng'])) {
    $lat = $_REQUEST['lat'];
    $lng = $_REQUEST['lng'];
} else {
    // Return error if lat/lng not provided
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Missing latitude or longitude";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    echo json_encode($output);
    exit();
}

// Concatenate API URL
$url = 'http://api.geonames.org/findNearByWeatherJSON?formatted=true&lat=' . trim($lat) . '&lng=' . trim($lng) . '&username=amcdonnell&style=full';

// Log the correct API URL
//echo "API URL: " . $url;

// Initiate cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Execute cURL and handle errors
$result = curl_exec($ch);
if ($result === false) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = 'cURL Error: ' . curl_error($ch);
    echo json_encode($output);
    exit();
}
curl_close($ch);

// Decode API response
$decode = json_decode($result, true);
if ($decode === null) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Invalid JSON returned from API";
    echo json_encode($output);
    exit();
}

// Check for valid data and output
if (isset($decode['weatherObservation'])) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode['weatherObservation'];
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Failed to retrieve data from the API";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
}

<<<<<<< HEAD
	// Echo json_encode($output) is a function that converts the $output variable to a JSON string and sends it to the client
	echo json_encode($output);
>>>>>>> 50bfabd (Adding Get Nearby Weather code to application)
=======
echo json_encode($output);
>>>>>>> 8ce53cf (Amended input ids in html code and script.js code. Also amended PHP file to successfully retrieve and display data on the frront-end)
?>