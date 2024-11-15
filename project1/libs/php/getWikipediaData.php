<?php

header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

<<<<<<< HEAD
define('SECURE_ACCESS', true);
require_once './config.php';

=======
>>>>>>> cda1cca (Adding Wikipedia PHP and jQuery AJAX request)
$countryMappings = [
    "Bosnia and Herz." => "Bosnia and Herzegovina",
    "Central African Rep." => "Central African Republic",
    "Czech Rep." => "Czech Republic",
<<<<<<< HEAD
    "Czech Rep." => "Czechia",
=======
>>>>>>> cda1cca (Adding Wikipedia PHP and jQuery AJAX request)
    "Dem. Rep. Congo" => "Democratic Republic of the Congo",
    "Dem. Rep. Korea" => "Democratic Republic of Korea",
    "Dominican Rep." => "Dominican Republic",
    "Eq. Guinea" => "Equatorial Guinea",
    "Falkland Is." => "Falkland Islands",
    "Solomon Is." => "Solomon Islands",
    "S. Sudan" => "South Sudan",

];

<<<<<<< HEAD
$username = WIKIPEDIA_USERNAME;
=======
$username="amcdonnell";
>>>>>>> cda1cca (Adding Wikipedia PHP and jQuery AJAX request)

//these parameters link to the parameters in the AJAX's data object
if (isset($_REQUEST["country"]) && isset($_REQUEST["isoCode"])) {
    $isoCode = $_REQUEST["isoCode"];
    $searchedCountry = $_REQUEST["country"];
} else {
    echo "Country and ISO code are required.";
    exit;
}

// Use mapping if available, otherwise use the original country name
$fullCountryName = array_key_exists($searchedCountry, $countryMappings) ? $countryMappings[$searchedCountry] : $searchedCountry;

// URL-encode the final country name for safe usage in the URL
$encodedCountry = urlencode($fullCountryName);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
$url = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" . $encodedCountry . "&maxRows=5&username=" . $username . "&style=full&country=" . $isoCode . "&title=" . $encodedCountry;
=======
$url = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" . $encodedCountry . "&maxRows=10&username=" . $username . "&style=full&country=" . $isoCode . "&title=" . $encodedCountry;
>>>>>>> cda1cca (Adding Wikipedia PHP and jQuery AJAX request)
=======
$url = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" . $encodedCountry . "&maxRows=5&username=" . $username . "&style=full&country=" . $isoCode . "&title=" . $encodedCountry;
>>>>>>> 3d3d168 (Adding wikipedia articles to the wiki modal, updating countryBorders.geo.json file and saving renewable energy percentages)
=======
$url = "https://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" . $encodedCountry . "&maxRows=5&username=" . $username . "&style=full&country=" . $isoCode . "&title=" . $encodedCountry;
>>>>>>> 1aef87f (Working on fixing uncentred icons)
=======
$url = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" . $encodedCountry . "&maxRows=5&username=" . $username . "&style=full&country=" . $isoCode . "&title=" . $encodedCountry;
>>>>>>> db384b4 (Fixing issue with Geonames Wiki api)

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode["geonames"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode["geonames"];

    echo  json_encode($output);
} else {
<<<<<<< HEAD
<<<<<<< HEAD
    echo json_encode(["error" => "No wiki geonames results found"]);
=======
    echo json_encode(["error" => "No results found"]);
>>>>>>> cda1cca (Adding Wikipedia PHP and jQuery AJAX request)
=======
    echo json_encode(["error" => "No wiki geonames results found"]);
>>>>>>> 2b5de68 (Unifying php status code if/else statements)
}
?>