<?php

// Track execution time
$executionStartTime = microtime(true);

// Include the database connection
include("config.php");

// Tell the script that the output is in JSON format and should be treated as JSON data
header("Content-Type: application/json; charset=UTF-8");

// Create a connection to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check connection
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

//get the location id from the GET request
$locationId = $_GET["id"];

// Prepare the SQL statement to get the location details
$query = $conn->prepare("SELECT l.id as locationId, l.name as locationName, COUNT(d.id) as departmentCount FROM location l LEFT JOIN department d ON d.locationID = l.id WHERE l.id = ?");
$query->bind_param("i", $locationId);

// Execute the query
$query->execute();
$result = $query->get_result();

// If the location exists, return its details
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = $row;
} else {
    $output["status"]["code"] = "404";
    $output["status"]["name"] = "not found";
    $output["status"]["description"] = "location not found";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
}

// Close the database connection
mysqli_close($conn);

// Return the output as JSON
echo json_encode($output);

?>