<?php

//add department to database

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

// Prepare the SQL statement to insert new department data
$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?, ?)');

$query->bind_param("si", $_REQUEST['name'], $_REQUEST['locationID']);

// Execute the query
$query->execute();

// Check if the query was successful
if ($query->affected_rows > 0) {
    //Successfully added the new department
    // Fetch the updated department list to reflect the changes
    $selectQuery = $conn->prepare('SELECT * FROM department');
    $selectQuery->execute();
    $result = $selectQuery->get_result();

    $department = [];
    while ($row = $result->fetch_assoc()) {
        $department[] = $row;
    }

    // Prepare the response with updated department data
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ['message' => 'Department added successfully', 'department' => $department];
} else {
    //No rows were affected, meaning the department was not added
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
}

//Display the data
echo json_encode($output);

//Close the connection
mysqli_close($conn);

?>