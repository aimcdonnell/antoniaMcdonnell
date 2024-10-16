<?php

	// remove for production

	//initiating comprehensive error reporting so that the routine (a sequence of code that is intended to be used repeatedly during the execution of a programme) runs in the browser
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//initiating the execution time of the routine so that it can be measured
	$executionStartTime = microtime(true);

	//concatenates the URL for the API call with the required parameters passed from the data section of the AJAX call in the script.js files
    $url= 'http://api.geonames.org/timezoneJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=amcdonnell';
	//initiates the cURL object and sets some parameters
	$ch = curl_init();
	//CURLOPT_SSL_VERIFYPEER is a boolean value that determines whether the cURL object should verify the peer's certificate. The peer's certificate is the certificate that the server presents to the client during the SSL handshake
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	//CURLOPT_RETURNTRANSFER is a boolean value that determines whether the cURL object should return the result of the API call
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	//CURLOPT_URL is a string that contains the URL for the API call
	curl_setopt($ch, CURLOPT_URL,$url);
 
	//executes the cURL object and returns the result
	$result=curl_exec($ch);

	//closes the cURL object so that it can be used again
	curl_close($ch);

	//This particular API returns data as JSON and so we need to encode and decode the JSON string as an associative array because it is not in the correct format. The correct format is the associative array ("geonames": [{ "continent": EU, capital: "London", "languages": "en-GB, cy-GB, gd", etc.}]).
	//decodes/ converts the JSON string returned by the API call and stores it in the $decode variable. Decode means to convert a string from one format to another.
	$decode = json_decode($result,true);	
	//stores the decoded JSON string in the $output variable
	//$output is an associative array that contains the data returned by the API call
	$output['status']['code'] = "200";
	//$output['status']['name'] is a string that contains the name of the status of the API call
	$output['status']['name'] = "ok";
	//$output['status']['description'] is a string that contains the description of the status of the API call
	$output['status']['description'] = "success";
	//$output['status']['returnedIn'] is a string that contains the time taken to execute the API call
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	//the "geonames" property from the serialised JSON is stored into the "data" property of the $output variable
	//the $decode["geonames"] in the code below returns the "geonames" property from the serialised JSON
	$output['data'] = $decode['geonames'];
	
	//header is a function that sets the HTTP headers for the response
	header('Content-Type: application/json; charset=UTF-8');
	//echo json_encode($output) is a function that converts the $output variable to a JSON string and sends it to the client
	echo json_encode($output);
?>
