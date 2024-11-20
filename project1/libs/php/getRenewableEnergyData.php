<?php
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryIsoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;


if (!$countryIsoCode) {
    echo json_encode(["error" => "ISO code is required"]);
    exit;
}

$json = file_get_contents("../js/renewableEnergyData.json");

$renewableSources = json_decode($json, true);

$found = false;

foreach ($renewableSources as $renewableSource) {
    if ($renewableSource["iso_code"] === $countryIsoCode) {
        $output["data"] = $renewableSource;
        $found = true;
        break;
    }
}

if (isset($output["data"])) {
    $output["status"]["code"] = "200";
    //text status = ok
    $output["status"]["name"] = "ok";
    //description = a success message
    $output["status"]["description"] = "success";
    //the execution time calculated by subtracting the start time by the current time
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    echo json_encode($output);
} else {
    echo json_encode(["error" => "No renewable energy results found"]);
}
?>