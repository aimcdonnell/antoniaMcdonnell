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

// Get the personnel ID from the GET request
$personnelId = $_GET["id"];

// Prepare the SQL statement to get the first and last name of the personnel
$query = $conn->prepare("SELECT firstName, lastName FROM personnel WHERE id = ?");
$query->bind_param("i", $personnelId);

// Execute the query
$query->execute();
$result = $query->get_result();

// If the personnel exists, return their details
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = $row;
} else {
    $output["status"]["code"] = "404";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "personnel not found";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
}

// Close the connection
mysqli_close($conn);

// Output the response
echo json_encode($output);

?>
