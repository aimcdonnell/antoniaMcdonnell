<?php

header("Content-Type: application/json; charset=UTF-8;");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//initiating the execution time of the routine so that it can be measured
$executionStartTime = microtime(true);

<<<<<<< HEAD
<<<<<<< HEAD
$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;
error_log("Received ISO code: " . $isoCode);
=======
$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;
error_log("Received ISO code: " . $isoCode);

$json = file_get_contents("../js/countryInformation.json");

if (!$json) {
    echo json_encode(["error" => "Failed to load JSON file"]);
    exit;
}

$countries = json_decode($json, true);

foreach($countries as $country) {
    if ($country["cca2"] === $isoCode) {
        $output["data"] = $country;
        break;
    }
}

<<<<<<< HEAD
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
>>>>>>> 1e7eed2 (Added country information to info box and amended select box styling)

$json = file_get_contents("../js/countryInformation.json");

if (!$json) {
    echo json_encode(["error" => "Failed to load JSON file"]);
    exit;
}

$countries = json_decode($json, true);

foreach($countries as $country) {
    if ($country["cca2"] === $isoCode) {
        $output["data"] = $country;
        break;
    }
}

if (isset($output["data"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

=======
if (isset($output["data"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

>>>>>>> 2b5de68 (Unifying php status code if/else statements)
    echo json_encode($output);    
} else {
    echo json_encode(["error" => "Country information not found"]);
}
<<<<<<< HEAD
=======

>>>>>>> a24ea01 (Renaming country information php file and adding country data to JSON file)
=======
>>>>>>> 2b5de68 (Unifying php status code if/else statements)

?>