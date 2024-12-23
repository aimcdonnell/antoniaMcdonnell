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
$locationName = trim($_POST['location'] ?? '');

// Validate input data
if (empty($departmentName) || empty($locationName)) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Invalid input data: departmentName and location cannot be empty.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    $conn->close();
    exit;
}

// Check for duplicate department with location
$query = $conn->prepare('SELECT d.id 
    FROM department d
    INNER JOIN location l ON d.locationID = l.id 
    WHERE d.name = ? AND l.name = ?');
$query->bind_param('ss', $departmentName, $locationName);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    // Duplicate found
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Duplicate department at this location found.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['exists' => true];
    echo json_encode($output);
    $conn->close();
    exit;
}

// Get location ID for the location name
$locationQuery = $conn->prepare('SELECT id FROM location WHERE name = ?');
$locationQuery->bind_param('s', $locationName);
$locationQuery->execute();
$locationResult = $locationQuery->get_result();

if ($locationResult->num_rows === 0) {
    // Location not found
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Location not found.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    $conn->close();
    exit;
}

// Fetch the location ID
$locationRow = $locationResult->fetch_assoc();
$locationId = $locationRow['id'];

// Insert new department
$insertQuery = $conn->prepare('INSERT INTO department (name, locationID) VALUES (?, ?)');
$insertQuery->bind_param('si', $departmentName, $locationId);

if ($insertQuery->execute()) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Duplicate department found";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['exists' => true];
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "No duplicate department found";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['exists' => false];
}

echo json_encode($output);

// Close the connection
$conn->close();

?>
