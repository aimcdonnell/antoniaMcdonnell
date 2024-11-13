<?php
//Getting news data from the News API
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

<<<<<<< HEAD
define('SECURE_ACCESS', true);
require_once './config.php';

=======
>>>>>>> fc006f9 (Adding getNewsData.php file)
$isoCode = isset($_REQUEST["isoCode"]) ? $_REQUEST["isoCode"] : null;

if (!$isoCode) {
    echo json_encode(["error" => "ISO code not provided"]);
    exit;
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> eb2b536 (Added NewsData API to app)
// Validate ISO code (2-letter code)
if (!preg_match("/^[A-Z]{2}$/", $isoCode)) {
    echo json_encode(["error" => "Invalid ISO code format"]);
    exit;
}

<<<<<<< HEAD
$apiKey = NEWS_DATA_API_KEY;
=======
=======
>>>>>>> eb2b536 (Added NewsData API to app)
$apiKey = "pub_589596ff54fa50004cfd22c7a69da957ccedc";
>>>>>>> fc006f9 (Adding getNewsData.php file)

$url = "https://newsdata.io/api/1/news?apikey=" . $apiKey . "&country=" . $isoCode . "&language=en";

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode["results"])) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3d3d168 (Adding wikipedia articles to the wiki modal, updating countryBorders.geo.json file and saving renewable energy percentages)
    
    // Limit the results to the first 5 articles
    $limitedResults = array_slice($decode["results"], 0, 5);

<<<<<<< HEAD
=======
>>>>>>> fc006f9 (Adding getNewsData.php file)
=======
>>>>>>> 3d3d168 (Adding wikipedia articles to the wiki modal, updating countryBorders.geo.json file and saving renewable energy percentages)
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3d3d168 (Adding wikipedia articles to the wiki modal, updating countryBorders.geo.json file and saving renewable energy percentages)
    $output["data"]["results"] = $limitedResults;

    echo json_encode($output);
} else {
    echo json_encode(["error" => "No results found"]);
=======
    $output["data"] = $decode;

    echo json_encode($output);
} else {
<<<<<<< HEAD
    echo "No results found";
>>>>>>> fc006f9 (Adding getNewsData.php file)
=======
    echo json_encode(["error" => "No results found"]);
>>>>>>> cda1cca (Adding Wikipedia PHP and jQuery AJAX request)
}

?>