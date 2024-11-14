
<?php

header('Content-Type: application/json; charset=UTF-8');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


<<<<<<< HEAD
<<<<<<< HEAD
$url = 'https://api.geonames.org/streetNameLookupJSON?formatted=true&q=' . $_REQUEST['q'] . '&username=amcdonnell';
=======
$url = 'http://api.geonames.org/streetNameLookupJSON?formatted=true&q=' . $_REQUEST['q'] . '&username=amcdonnell';
>>>>>>> 103574d (Added API request for Geonames streetNameLookup API and amended double quotation marks to single quotation marks for consistency)
=======
$url = 'https://api.geonames.org/streetNameLookupJSON?formatted=true&q=' . $_REQUEST['q'] . '&username=amcdonnell';
>>>>>>> 1aef87f (Working on fixing uncentred icons)

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = '200';
$output['status']['name'] = 'ok';
$output['status']['description'] = 'success';
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . 'ms';
$output['data'] = $decode['address'];

echo json_encode($output);
?>