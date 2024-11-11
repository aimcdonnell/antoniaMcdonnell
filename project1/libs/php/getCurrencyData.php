<?php
//Getting currency data from the Open Exchange Rates API
<<<<<<< HEAD
=======

>>>>>>> 032e89d (Adding currency converter to app)
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 'On');
error_reporting(E_ALL);

<<<<<<< HEAD
define('SECURE_ACCESS', true);
require_once './config.php';

$executionStartTime = microtime(true);

$apiKey = CURRENCY_API_KEY;
=======
$executionStartTime = microtime(true);

$apiKey = "ac1427d7ddbc49abb7374c7e40489199";
>>>>>>> 032e89d (Adding currency converter to app)

$url = "https://openexchangerates.org/api/latest.json?app_id=" . $apiKey;

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode["rates"])) {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output["data"] = $decode;

    echo json_encode($output);
} else {
<<<<<<< HEAD
    echo json_encode(["error" => "No currency data results found"]);
=======
    echo "No results found";
>>>>>>> 032e89d (Adding currency converter to app)
}

?>