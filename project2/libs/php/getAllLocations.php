<?php

//track execution time
$executionStartTime = microtime(true);

//where the login details are stored
include("config.php");

//telling the script that the output is in JSON format and should be treated as JSON data
header("Content-Type: application/json; charset=UTF-8");

// Connect to database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// if there's an error with the connection
if (mysqli_connect_errno()) {

    //the error as shown in the network tab of the browser
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    //close the connection
    mysqli_close($conn);

    //display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;

}

// SQL does not accept parameters and so is not prepared
$query = "SELECT id as locationID, name as locationName FROM location ORDER BY name";

// query database for all locations
$result = $conn->query($query);
// if there's an error with the query

if (!$result) {
    //the error as shown in the network tab of the browser
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "executed";
    $output["status"]["description"] = "query failed";

    //close the connection
    mysqli_close($conn);

    //display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

//create an array for the location data
$data = [];

//loop through the result set and add each row to the data array
while ($row = mysqli_fetch_assoc($result)) {

    array_push($data, $row);
}

//the success structure as shown in the network tab of the browser
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output["data"] = $data;

//close the connection
mysqli_close($conn);

//display the data
echo json_encode($output);

?>