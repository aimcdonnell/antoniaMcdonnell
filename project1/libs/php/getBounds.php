<?php

//header is needed to set the content type of the response to JSON
header("Content-Type: application/json; charset=UTF-8;");

//enable error reporting for debugging
ini_set("display_errors", "On");
error_reporting(E_ALL);

//measuring the script"s execution time
$executionStartTime = microtime(true);
//Read the contents of the JSON file
$json = file_get_contents("../js/countryBorders.geo.json");

//if the file fails to load or is not found, display an error message
if ($json === false) {
    die("Error reading file");
}

//Decode the JSON string
$decode = json_decode($json, true);

//parse the JSON object to get the country code
foreach ($decode["features"] as $data) {
    $boundsData[] = [
        "iso_a2" => $data["properties"]["iso_a2"],
        "coordinates" => $data["geometry"]["coordinates"]
    ];

}
//status details - 200 = success
$output["status"]["code"] = "200";
//text status = ok
$output["status"]["name"] = "ok";
//description = a success message
$output["status"]["description"] = "success";
//the execution time calculated by subtracting the start time by the current time
$output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
//structuring the response in a well organized way (status, name, description, execution time, and data)
$output["data"] = $boundsData;

//encodes the entire output array as JSON and sends it as the response
//automatically converts the entire output array into JSON
echo json_encode($output);
?>