<?php
//header is needed to set the content type of the response to JSON
header("Content-Type: application/json; charset=UTF-8");

//enable error reporting for debugging
ini_set("display_errors", "On");
error_reporting(E_ALL);

//measuring the script"s execution time
$executionStartTime = microtime(true);
//Read the contents of the JSON file


$apiKey = "0d315a3d7ebc4c95983e51902d24a8a1";
$countryIdentifier = $_REQUEST["iso_a2"];
//concatenates the URL for the API call with the required country code
$url = "https://api.opencagedata.com/geocode/v1/json?q=" . $countryIdentifier . "&key=" . $apiKey;

//initiates a new cURL session
$ch = curl_init();
//CURLOPT_SSL_VERIFYPEER is a boolean value that determines whether the cURL object should verify the peer's certificate. The peer's certificate is the certificate that the server presents to the client during the SSL handshake
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//CURLOPT_RETURNTRANSFER is a boolean value that determines whether the cURL object should return the transfer as a string from the called function instead of outputting it directly
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//CURLOPT_URL is a string that specifies the URL to which the cURL object should be sent
curl_setopt($ch, CURLOPT_URL, $url);

//executes the cURL object and returns the result
$result=curl_exec($ch);

//closes the cURL object so that it can be used again
curl_close($ch);

//converts the JSON string returned by the API call and stores it in the $decode variable. Decode means to convert a string from one format to another.
$decode = json_decode($result,true);
//stores the decoded JSON string in the $output variable
//$output is an associative array that contains the data returned by the API call
$output["status"]["code"] = "200";
//$output['status']['name'] is a string that contains the name of the status of the API call
$output["status"]["name"] = "ok";
//$output['status']['description'] is a string that contains the description of the status of the API call
$output["status"]["description"] = "success";
//$output['status']['returnedIn'] is a string that contains the time taken to execute the API call
$output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
//the $decode["results"] in the code below returns the "results" property from the JSON string returned by the API call
$output["data"] = $decode["results"];

//echo json_encode($output) is a function that converts the $output variable to a JSON string and sends it to the client
echo json_encode($output);
?>