<?php
	//header is a function that sets the HTTP headers for the response
	header('Content-Type: application/json; charset=UTF-8');

	//initiating comprehensive error reporting so that the routine runs in the browser
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//initiating the execution time of the routine so that it can be measured
	$executionStartTime = microtime(true);

	// Ensure lat and lng are set in the request
	if (isset($_REQUEST['lat']) && isset($_REQUEST['lng'])) {
	    $lat = $_REQUEST['lat'];
	    $lng = $_REQUEST['lng'];
	} else {
	    // If lat or lng are not present, return an error response
	    $output['status']['code'] = "400";
	    $output['status']['name'] = "error";
	    $output['status']['description'] = "Missing latitude or longitude";
	    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	    echo json_encode($output);
	    exit();
	}

	// Concatenates the URL for the API call with the required parameters
    $url = 'http://api.geonames.org/timezoneJSON?formatted=true&lat=' . $lat . '&lng=' . $lng . '&username=amcdonnell&style=full';

	// Initiates the cURL object and sets some parameters
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);  // Disable SSL certificate verification
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // Return the API response as a string
	curl_setopt($ch, CURLOPT_URL, $url);  // Set the API URL

	// Executes the cURL object and returns the result
	$result = curl_exec($ch);

	// Closes the cURL object so that it can be used again
	curl_close($ch);

	// Decodes the JSON string returned by the API call and stores it in the $decode variable
	$decode = json_decode($result, true);

	// Check if the API response contains valid data
	if (isset($decode['lat']) && isset($decode['lng'])) {
	    // Stores the decoded JSON string in the $output variable
	    $output['status']['code'] = "200";
	    $output['status']['name'] = "ok";
	    $output['status']['description'] = "success";
	    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	    $output['data'] = $decode;
	} else {
	    // If the API call failed or returned an unexpected response, return an error
	    $output['status']['code'] = "500";
	    $output['status']['name'] = "error";
	    $output['status']['description'] = "Failed to retrieve data from the API";
	    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	}

	// Echo json_encode($output) is a function that converts the $output variable to a JSON string and sends it to the client
	echo json_encode($output);
?>