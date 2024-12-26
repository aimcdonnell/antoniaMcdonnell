<?php
// Enable error reporting for development (remove for production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Track execution time
$executionStartTime = microtime(true);

// Where the login details are stored
include("config.php");

// Tell the script to start sending the content as JSON
header('Content-Type: application/json; charset=UTF-8');

// Connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// If there's an error with the connection
if (mysqli_connect_errno()) {
    // The error structure as shown in the network tab of the browser
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];

    // Close the connection
    mysqli_close($conn);

    // Display the error
    echo json_encode($output);

    // Exit the script and avoid executing the rest of the code
    exit;
}

// First query - SQL statement accepts parameters and so is prepared to avoid SQL injection
$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');

// Bind parameters for markers
$query->bind_param("sii", $_REQUEST['departmentName'], $_REQUEST['locationID'], $_REQUEST['id']);

// Execute the query
$query->execute();

// If there's an error with the query
if (false === $query) {
    // The error structure as shown in the network tab of the browser
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    // Close the connection
    mysqli_close($conn);

    // Display the error
    echo json_encode($output);

    // Exit the script and avoid executing the rest of the code
    exit;
}

// Retrieve the updated department data
$updatedDepartmentQuery = $conn->prepare('SELECT d.name AS departmentName, l.name AS locationName 
    FROM department d
    JOIN location l ON d.locationID = l.id
    WHERE d.id = ?');

// Bind the department id parameter (it is an integer)
$updatedDepartmentQuery->bind_param("i", $_REQUEST['id']);

// Execute the query
$updatedDepartmentQuery->execute();

// Get the result from the query
$updatedDepartmentResult = $updatedDepartmentQuery->get_result();

// Check if the query returns any rows
if ($updatedDepartmentResult->num_rows > 0) {
    $department = [];

    // Fetch the updated department and its location
    while ($row = $updatedDepartmentResult->fetch_assoc()) {
        $department[] = [
            'departmentName' => $row['departmentName'],
            'locationName' => $row['locationName']
        ];
    }

    // Prepare the response with updated data
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $department;
} else {
    // If no rows were returned, handle the error
    $output['status']['code'] = "404";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "department not found";
    $output['data'] = [];
}

// Close the connection
mysqli_close($conn);

// Display the data
echo json_encode($output);

?>
