<?php

// Add department to database

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Track execution time
$executionStartTime = microtime(true);

// Where the login details are stored
include("config.php");

// Tell the script that the output is in JSON format and should be treated as JSON data
header('Content-Type: application/json; charset=UTF-8');

// Connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// If there's an error with the connection
if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Prepare the SQL statement to insert new department name and location name data
$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES (?, ?)');

// Bind the department name and location ID
$query->bind_param("ss", $_REQUEST['departmentName'], $_REQUEST['locationID']);

// Execute the query
$query->execute();

// Check if the query was successful
if ($query->affected_rows > 0) {
    // Get the last inserted department's ID
    $lastInsertId = $conn->insert_id;

    // Fetch the department and location information using a JOIN query
    $selectQuery = $conn->prepare('
        SELECT d.id, d.name AS departmentName, l.name AS locationName 
        FROM department d
        JOIN location l ON d.locationID = l.id
        WHERE d.id = ?
    ');
    $selectQuery->bind_param('i', $lastInsertId);
    $selectQuery->execute();
    $result = $selectQuery->get_result();

    // Fetch the added department and location
    if ($row = $result->fetch_assoc()) {
        $department = $row;

        // Prepare the response with the added department and location data
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = ['message' => 'Department added successfully', 'department' => $department];
    } else {
        // If the department and location were not found, return an error
        $output['status']['code'] = "500";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Department and location not found after insertion";
        $output['data'] = [];
    }
} else {
    // No rows were affected, meaning the department was not added
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
}

// Display the data
echo json_encode($output);

// Close the connection
mysqli_close($conn);

?>
