<?php

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

// Enable error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$url = "https://app.box.com/s/z3rc88qc295us9ec7u9ih1sllh17zir4";

//Initiate cURL
$ch = curl_init();
//set to true to return the transfer as a string instead of outputting it directly. We can then store the result in a variable if we want.
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//follows any location. Header that the server sends as part of the HTTP response. This will follow any redirects and cURL will automatically go to the final destination.
//It will retrieve data from the correct location.
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

//Execute the request and get the response
$result = curl_exec($ch);
if($result === false) {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL Error: ' . curl_error($ch);
    echo json_encode($output);
    exit();
};

//Close cURL session
curl_close($ch);

//Output the JSON data
echo $result;
>>>>>>> d1b5d3b (Adding countries to drop-down above map)
