<?php

// Track execution time
$executionStartTime = microtime(true);

// Include configuration
include("config.php");

// Set JSON header
header("Content-Type: application/json; charset=UTF-8");

// Connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for connection errors
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

// Validate and sanitize inputs
$department = isset($_POST["department"]) && is_numeric($_POST["department"]) ? (int) $_POST["department"] : 0;
$location = isset($_POST["location"]) && is_numeric($_POST["location"]) ? (int) $_POST["location"] : 0;

// Build the base query
$sql = "SELECT p.id, p.firstName, p.lastName, p.email, p.jobTitle, 
               d.id AS departmentID, d.name AS departmentName, l.name AS location
        FROM personnel p
        LEFT JOIN department d ON d.id = p.departmentID
        LEFT JOIN location l ON l.id = d.locationID
        WHERE 1=1"; // Ensure query is always valid

// Add conditions dynamically
$params = [];
$types = "";

if ($department !== 0) {
    $sql .= " AND d.id = ?";
    $types .= "i";
    $params[] = $department;
}

if ($location !== 0) {
    $sql .= " AND l.id = ?";
    $types .= "i";
    $params[] = $location;
}

// Add ordering clause
$sql .= " ORDER BY p.lastName, p.firstName";

// Prepare the query
$query = $conn->prepare($sql);

if ($query === false) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query preparation failed";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Bind parameters dynamically if any
if (!empty($params)) {
    $query->bind_param($types, ...$params); // "..." unpacks the array into individual arguments
}

// Execute the query
$query->execute();

// Check for execution errors
if (!$query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query execution failed";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Fetch the results
$result = $query->get_result();

// Process results into an array
$personnel = [];
while ($row = $result->fetch_assoc()) {
    $personnel[] = $row;
}

// Return a successful response
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $personnel;

// Close connection and output response
mysqli_close($conn);
echo json_encode($output);

?>
