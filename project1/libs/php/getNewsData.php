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
// Validate ISO code (2-letter code)
if (!preg_match("/^[A-Z]{2}$/", $isoCode)) {
    echo json_encode(["error" => "Invalid ISO code format"]);
    exit;
}

$apiKey = NEWS_DATA_API_KEY;
=======
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
    
    // Limit the results to the first 5 articles
    $limitedResults = array_slice($decode["results"], 0, 5);

=======
>>>>>>> fc006f9 (Adding getNewsData.php file)
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
<<<<<<< HEAD
    $output["data"]["results"] = $limitedResults;

    echo json_encode($output);
} else {
    echo json_encode(["error" => "No results found"]);
=======
    $output["data"] = $decode;

    echo json_encode($output);
} else {
    echo "No results found";
>>>>>>> fc006f9 (Adding getNewsData.php file)
}

?>