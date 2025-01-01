<?php

// Track execution time
$executionStartTime = microtime(true);

// Where the login details are stored
include("config.php");

// Tell the script that the output is in JSON format and should be treated as JSON data
header("Content-Type: application/json; charset=UTF-8");

// Connect to the MySQL database server
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// If there"s an error with the connection, stop the script and display the error
if (mysqli_connect_errno()) {
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Get the location id from the request
$locationId = $_POST["id"];

// Query to fetch location name
$query = $conn->prepare("SELECT l.name as locationName, COUNT(d.locationID) as departmentCount 
    FROM location l
    LEFT JOIN department d ON d.locationID = l.id
    WHERE l.id = ?");

$query->bind_param("i", $locationId);
$query->execute();

//Fetch the result
$checkResult = $query->get_result()->fetch_assoc();

//If the location is assigned to a department, return an error
if ($checkResult["departmentCount"] > 0) {
    $output["status"]["code"] = "403";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "Cannot delete location assigned to a department";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"]["count"] = $checkResult["departmentCount"];
    $output["data"]["locationName"] = $checkResult["locationName"];

    echo json_encode($output);
    exit;
}

//SQL query to delete the location
$query = $conn->prepare("DELETE FROM location WHERE id = ?");
$query->bind_param("i", $locationId);
$query->execute();

//If the delete query fails, return an error
if (false === $query) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "executed";
    $output["status"]["description"] = "query failed";
    $output["data"] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

//If query was successful, return success
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output["data"] = [
    "locationName" => $checkResult["locationName"],
    "departmentCount" => $checkResult["departmentCount"]
];

mysqli_close($conn);
echo json_encode($output);

?>