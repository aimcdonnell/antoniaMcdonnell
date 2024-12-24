<?php

// Enable error reporting for development (remove for production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Track execution time
$executionStartTime = microtime(true);

// Include necessary files and establish the database connection
include('config.php');
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection errors
if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database unavailable.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Get POST data and trim whitespace
$departmentName = trim($_POST['departmentName'] ?? '');
$locationID = trim($_POST['locationID'] ?? '');

// Validate input data
if (empty($departmentName) || empty($locationID)) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Invalid input data: departmentName and location cannot be empty.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    $conn->close();
    exit;
}

// Check for duplicate department with location
$query = $conn->prepare('SELECT d.id 
    FROM department d
    WHERE d.name = ? AND d.locationID = ?');
$query->bind_param('si', $departmentName, $locationID);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    // Duplicate found
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Duplicate department at this location found.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['exists' => true];
} else {
    // No duplicates found
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "No duplicate department found.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['exists' => false];
}

echo json_encode($output);

// Close the connection
$conn->close();

?>
