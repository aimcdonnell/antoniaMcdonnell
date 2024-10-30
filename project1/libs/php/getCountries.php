<?php
 //use a php routine to return the ISO code and name for inclusion in the index.html <select> element

//initiating comprehensive error reporting so that the routine 
//(a sequence of code that is intended to be used repeatedly during 
//the execution of a programme) runs in the browser
ini_set("display_errors", "On");
error_reporting(E_ALL);

$executionStartTime = microtime(true);
//Read the file
$json = file_get_contents("libs/js/countryBorders.geo.json");

//Decode the JSON file
$decode = json_decode($result, true);

$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
//return the iso code and name in the code
$output["data"] = $decode["features"];

//check if the file was read successfully
if ($result === false) {
    die("Error reading file");
}

header("Content-Type: application/json; charset=UTF-8");

?>