<?php

//filter departments by location

//remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

///track execution time
$executionStartTime = microtime(true);

///where the login details are stored
include("config.php");

//tell the script to start sending the content as JSON
header('Content-Type: application/json; charset=UTF-8');

// connect to database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

//if there's an error with the connection

if (mysqli_connect_errno()) {

    //the error structure as shown in the network tab of the browser
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    //close the connection
    mysqli_close($conn);

    ///display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

// Prepare the SQL query
$query = $conn->prepare('SELECT d.id, d.name, l.name AS location
                         FROM department d
                         LEFT JOIN location l ON l.id = d.locationID
                         WHERE l.name LIKE ?
                         ORDER BY d.name');

// Get the location parameter from the request
$location = isset($_REQUEST['location']) ? "%" . $_REQUEST['location'] . "%" : "";
// Bind parameters correctly
$query->bind_param("ss", $location, $location);

$query->execute();

//if there's an error with the query
if (false === $query) {
    //the error structure as shown in the network tab of the browser
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    //close the connection
    mysqli_close($conn);

    //display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

// Get the result from the query
$result = $query->get_result();

// Create an array for location data
$locations = [];

// Loop through the location data and add it to the array
while ($row = $result->fetch_assoc()) {
    array_push($locations, $row);
}

//the success structure as shown in the network tab of the browser
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['locations'] = $locations;

//close the connection
mysqli_close($conn);

//display the data
echo json_encode($output);

?>
