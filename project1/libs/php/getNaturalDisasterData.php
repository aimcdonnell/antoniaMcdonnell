<?php

header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryMappings = [
    "Bosnia and Herz." => "Bosnia and Herzegovina",
    "Central African Rep." => "Central African Republic",
    "Czech Rep." => "Czech Republic",
    "Czech Rep." => "Czechia",
    "Dem. Rep. Congo" => "Democratic Republic of the Congo",
    "Dem. Rep. Korea" => "Democratic Republic of Korea",
    "Dominican Rep." => "Dominican Republic",
    "Eq. Guinea" => "Equatorial Guinea",
    "Falkland Is." => "Falkland Islands",
    "Solomon Is." => "Solomon Islands",
    "S. Sudan" => "South Sudan",

];


if (isset($_REQUEST["country"])) {
    $selectedDisasterCountry = $_REQUEST["country"];
} else {
    echo json_encode(["error" => "Natural disaster country is required"]);
    exit;
}

$fullCountryName = array_key_exists($selectedDisasterCountry, $countryMappings) ? $countryMappings[$selectedDisasterCountry] : $selectedDisasterCountry;


$encodedCountry = urlencode($fullCountryName);


$url = "https://api.reliefweb.int/v1/disasters?appname=rwint-user-0&profile=list&preset=latest&slim=1&country=" . $encodedCountry . "&limit=100";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$naturalDisasters = json_decode($result, true);


$filteredData = [];

//for each natural disaster, check if the country matches the selected country
foreach ($naturalDisasters["data"] as $naturalDisaster) {
    if (isset($naturalDisaster["fields"]["country"]) && is_array($naturalDisaster["fields"]["country"])) {
        foreach ($naturalDisaster["fields"]["country"] as $country) {
            if (isset($country["name"]) && $country["name"] === urldecode($encodedCountry)) {
                //allows multiple results to be returned, if applicable
                $filteredData[] = $naturalDisaster;
                break;
            }
        }
    }
}

if (isset($naturalDisasters["data"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $filteredData;

    echo json_encode($output);
} else {
    echo json_encode(["error" => "No extreme weather events found"]);
}

?>