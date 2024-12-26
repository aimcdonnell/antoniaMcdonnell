<?php

// Enable error reporting for development (remove for production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Track execution time
$executionStartTime = microtime(true);

// Where the login details are stored
include("config.php");

// Tell the script that the output is in JSON format and should be treated as JSON data
header('Content-Type: application/json; charset=UTF-8');

// Connect to the MySQL database server
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// If there's an error with the connection, stop the script and display the error
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

// Get the department ID from the request
$departmentID = $_REQUEST['id'];

// Query to fetch department name and location name
$query = $conn->prepare('
    SELECT d.name AS departmentName, l.name AS locationName, COUNT(p.departmentID) as count 
    FROM department d
    JOIN location l ON d.locationID = l.id
    LEFT JOIN personnel p ON d.id = p.departmentID
    WHERE d.id = ?
    GROUP BY d.id, l.name
');
$query->bind_param("i", $departmentID);
$query->execute();

// Fetch the result
$checkResult = $query->get_result()->fetch_assoc();

// If the department is assigned personnel, return an error
if ($checkResult['count'] > 0) {
    $output['status']['code'] = "403";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Cannot delete department with assigned personnel";
    $output['data']['count'] = $checkResult['count'];
    $output['data']['departmentName'] = $checkResult['departmentName'];
    $output['data']['locationName'] = $checkResult['locationName'];

    echo json_encode($output);
    exit;
}

// SQL query to delete the department if no personnel are assigned
$query = $conn->prepare('DELETE FROM department WHERE id = ?');
$query->bind_param("i", $_REQUEST['id']);
$query->execute();

// If the delete query fails, return an error
if (false === $query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// If query was successful, return success
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [
	'departmentName' => $checkResult['departmentName'],
	'departmentLocation' => $checkResult['locationName']
];

mysqli_close($conn);
echo json_encode($output);

?>
