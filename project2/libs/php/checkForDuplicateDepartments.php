<?php 

// Remove the next two lines for production
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
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Validate input
$departmentName = trim($_REQUEST['departmentName'] ?? '');
$locationName = trim($_REQUEST['location'] ?? '');

if (empty($departmentName) || empty($locationName)) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "invalid input data";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    $conn->close();
    exit;
}

// Check for duplicate departments with the same name at the same location
$query = $conn->prepare('SELECT d.id 
    FROM department d
    INNER JOIN location l ON d.locationID = l.id 
    WHERE d.name = ? AND l.name = ?');
// Bind parameters and execute the query
$query->bind_param('ss', $departmentName, $locationName);
// Bind parameters and execute the query
$query->execute();
// Get the result
$result = $query->get_result();

// Check if duplicate found
if ($result->num_rows > 0) {
    // Duplicate found
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "duplicate department at this location found";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    // Close the connection
    echo json_encode($output);
    // Close the connection
    $conn->close();
    // Exit the script
    exit;
}

// Get location ID for the location name
$locationQuery = $conn->prepare('SELECT id FROM location WHERE name = ?');
// Bind parameters and execute the query
$locationQuery->bind_param('s', $locationName);
$locationQuery->execute();
// Get the result
$locationResult = $locationQuery->get_result();

// Check if location found
if ($locationResult->num_rows > 0) {
    // Location found
    $locationRow = $locationResult->fetch_assoc();
    // Get location ID
    $locationId = $locationRow['id'];
} else {
    // Location not found
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "location not found";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    $conn->close();
    exit;
}

// Insert new department if no duplicate found
$insertQuery = $conn->prepare('INSERT INTO department (name, location) VALUES (?, ?)');
// Bind parameters and execute the query
$insertQuery->bind_param('ss', $departmentName, $locationName);  // bind the location ID as integer

// Execute the query
if ($insertQuery->execute()) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "new department added";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['exists' => false];
} else {
    // Error inserting department
    $output['status']['code'] = "500";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "error inserting department";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['exists' => false];
}

// Close the connection
$conn->close();

// Output the result
echo json_encode($output);

?>
