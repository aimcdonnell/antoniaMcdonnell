<?php
<<<<<<< HEAD
 //use a php routine to return the ISO code and name for inclusion in the index.html <select> element

<<<<<<< HEAD
<<<<<<< HEAD
header("Content-Type: application/json; charset=UTF-8");

//enable error reporting for debugging
ini_set("display_errors", "On");
error_reporting(E_ALL);

//measuring the script"s execution time
$executionStartTime = microtime(true);
//Read the contents of the JSON file
$json = file_get_contents("../js/countryBorders.geo.json");

//if the file fails to load or is not found, display an error message
if ($json === false) {
    die("Error reading file");
}

//Decode the JSON string
$decode = json_decode($json, true);

//iterate over the $decode["features"] array of objects
foreach ($decode["features"] as $country) {
    $countryData[] = [
        //each country in the loop is an associative array with a properties key
        //the properties key contains data on iso_a2 and name
        //each array apends a new array entry to countryData, so that countryData
        //becomes an array of country entries in the following format:
        //["iso_a2 => "US", "name" => "United States"]
        "iso_a2" => $country["properties"]["iso_a2"],
        "name" => $country["properties"]["name"]
    ];
}

if (isset($decode["features"])) {
    //status details - 200 = success
    $output["status"]["code"] = "200";
    //text status = ok
    $output["status"]["name"] = "ok";
    //description = a success message
    $output["status"]["description"] = "success";
    // the execution time calculated by subtracting the start time by the current time
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    //structuring the response in a well organized way (status, name, description, execution time, and data)
    //in one structured array
    $output["data"] = $countryData;

    //encodes the entire output array as JSON and sends it as the response
    //automatically converts the entire utput array into JSON
    echo json_encode($output);
} else {
    echo json_encode(["error" => "No country data results found"]);
}

?>
=======
header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache"); // For HTTP/1.0 compatibility

// Enable error reporting
ini_set('display_errors', 'On');
=======
//initiating comprehensive error reporting so that the routine 
//(a sequence of code that is intended to be used repeatedly during 
//the execution of a programme) runs in the browser
ini_set("display_errors", "On");
>>>>>>> da455e7 (Rewriting code to follow the correct method, using PHP routines rather than multiple AJAX calls)
error_reporting(E_ALL);

$executionStartTime = microtime(true);
//Read the file
$json = file_get_contents("libs/js/countryBorders.geo.json");

<<<<<<< HEAD
<<<<<<< HEAD
// Initiate cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Execute the request and get the response
$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($result === false || $httpCode != 200) {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL Error: ' . curl_error($ch);
    echo json_encode($output);
    exit();
}

// Close cURL session
curl_close($ch);

<<<<<<< HEAD
//Output the JSON data
echo $result;
>>>>>>> d1b5d3b (Adding countries to drop-down above map)
=======
// Output the JSON data
echo $result;
>>>>>>> 84f7ae0 (Adding select function to app, 2nd attempt)
=======
// Check if the file exists and output its content
if (file_exists($filePath)) {
    $jsonData = file_get_contents($filePath);
    header('Content-Type: application/json');
    echo $jsonData;
} else {
    echo json_encode(["error" => "File not found."]);
<<<<<<< HEAD
}
>>>>>>> d8c65b7 (Working on the select box so that it displays all the countries in the dropdown box)
=======
    echo $jsonData;
};
>>>>>>> b9ca338 (Added countries to the dropdown select box and linked them to the relevant countries, displaying their borders)
=======
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
>>>>>>> da455e7 (Rewriting code to follow the correct method, using PHP routines rather than multiple AJAX calls)
=======

header("Content-Type: application/json; charset=UTF-8");

//enable error reporting for debugging
ini_set("display_errors", "On");
error_reporting(E_ALL);

//measuring the script"s execution time
$executionStartTime = microtime(true);
//Read the contents of the JSON file
$json = file_get_contents("../js/countryBorders.geo.json");

//if the file fails to load or is not found, display an error message
if ($json === false) {
    die("Error reading file");
}

//Decode the JSON string
$decode = json_decode($json, true);

//iterate over the $decode["features"] array of objects
foreach ($decode["features"] as $country) {
    $countryData[] = [
        //each country in the loop is an associative array with a properties key
        //the properties key contains data on iso_a2 and name
        //each array apends a new array entry to countryData, so that countryData
        //becomes an array of country entries in the following format:
        //["iso_a2 => "US", "name" => "United States"]
        "iso_a2" => $country["properties"]["iso_a2"],
        "name" => $country["properties"]["name"]
    ];
}

//status details - 200 = success
$output["status"]["code"] = "200";
//text status = ok
$output["status"]["name"] = "ok";
//description = a success message
$output["status"]["description"] = "success";
// the execution time calculated by subtracting the start time by the current time
$output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

//structuring the response in a well organized way (status, name, description, execution time, and data)
//in one structured array
$output["data"] = $countryData;

//encodes the entire output array as JSON and sends it as the response
//automatically converts the entire utput array into JSON
echo json_encode($output);

?>
>>>>>>> 68b9fc1 (Amending getCountries.php and script.js so that they use the PHP routine correctly)
