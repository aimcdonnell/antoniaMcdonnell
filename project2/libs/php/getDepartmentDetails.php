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

//get the department id from the GET request
$departmentId = $_GET["id"];

// Prepare the SQL statement to get the department details
$query = $conn->prepare("SELECT d.id, d.name AS departmentName, d.locationID, l.name AS locationName, COUNT(p.departmentID) AS personnelCount FROM department d JOIN location l ON d.locationID = l.id LEFT JOIN personnel p ON d.id = p.departmentID WHERE d.id = ? GROUP BY d.id, l.name");
$query->bind_param("i", $departmentId);

// Execute the query
$query->execute();
$result = $query->get_result();

// If the department exists, return its details
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
    $output["status"]["description"] = "department not found";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
}

// Close the database connection
mysqli_close($conn);

// Return the output as JSON
echo json_encode($output);

?>