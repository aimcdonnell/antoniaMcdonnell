<?php

//header is needed to set the content type of the response to JSON
header("Content-Type: application/json; charset=UTF-8;");

//enable error reporting for debugging
ini_set("display_errors", "On");
error_reporting(E_ALL);

//measuring the script"s execution time
$executionStartTime = microtime(true);

<<<<<<< HEAD
//request comes from script.js (i.e. the client)
$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

=======
//get the iso code from the request
$isoCode = isset($_REQUEST["iso_code"]) ? $_REQUEST["iso_code"] : null;
>>>>>>> 3f9b70b (Amendin code to try to add borders to the countries)

//if iso code is not provided, return an error message
if(!$isoCode) {
    echo json_encode(["error" => "ISO code is required"]);
    exit;
}

<<<<<<< HEAD

=======
>>>>>>> 3f9b70b (Amendin code to try to add borders to the countries)
//Read the contents of the JSON file
$json = file_get_contents("../js/countryBorders.geo.json");

//if the file fails to load or is not found, display an error message
if (!$json) {
    echo json_encode(["error" => "Failed to load JSON file"]);
    exit;
}

//Decode the JSON string into countryBorderData
$countryBorders = json_decode($json, true);


//set found to false
$found = false;

//for each countryBorder in countryBorders["features"]
foreach ($countryBorders["features"] as $countryBorder) {
<<<<<<< HEAD
    //if the countryBorder's properties["iso_a2"] from countryBorders.geo.json is equal to the iso code from script.js/the request ($isoCode)
=======
    //if the countryBorder's properties["iso_a2"] is equal to the iso code from the request
>>>>>>> 3f9b70b (Amendin code to try to add borders to the countries)
    if ($countryBorder["properties"]["iso_a2"] === $isoCode) {
        //set the output array to the coordinates of the countryBorder
        $output["data"] = $countryBorder["geometry"]["coordinates"];
        //set found to true
        $found = true;
        //break out of the loop
        break;
    }

}

<<<<<<< HEAD
if (isset($countryBorders["features"])) {
    //if the countryBorder was found then return json
    //status details - 200 = success
    $output["status"]["code"] = "200";
    //text status = ok
    $output["status"]["name"] = "ok";
    //description = a success message
    $output["status"]["description"] = "success";
    //the execution time calculated by subtracting the start time by the current time
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    //encodes the entire output array as JSON and sends it as the response
    //automatically converts the entire output array into JSON
    echo json_encode($output);
} else {
    echo json_encode(["error" => "No country border data results found"]);
}

=======
//if the countryBorder was found then return json

//status details - 200 = success
$output["status"]["code"] = "200";
//text status = ok
$output["status"]["name"] = "ok";
//description = a success message
$output["status"]["description"] = "success";
//the execution time calculated by subtracting the start time by the current time
$output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

//encodes the entire output array as JSON and sends it as the response
//automatically converts the entire output array into JSON
echo json_encode($output);
>>>>>>> 3f9b70b (Amendin code to try to add borders to the countries)
?>