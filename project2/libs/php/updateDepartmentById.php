<?php
// Enable error reporting for development (remove for production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

//track execution time
$executionStartTime = microtime(true);

//where the login details are stored
include("config.php");

//tell the script to start sending the content as JSON
header('Content-Type: application/json; charset=UTF-8');

//connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

//if there's an error with the connection
if (mysqli_connect_errno()) {
    
    //the error structure as shown in the network tab of the browser
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];

    //close the connection
    mysqli_close($conn);

    //display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

// First query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');

// Bind parameters for markers
$query->bind_param("sii", $_REQUEST['departmentName'], $_REQUEST['locationID'], $_REQUEST['id']);

// Execute the query
$query->execute();

// If there's an error with the query
if (false === $query) {

    //the error structure as shown in the network tab of the browser
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    // Close the connection
    mysqli_close($conn);

    // Display the error
    echo json_encode($output);

    //Exit the script and avoid executing the rest of the code
    exit;
}

//Retrieve the updated department data
$updatedDepartmentQuery = $conn->prepare('SELECT * FROM department WHERE id = ?');
//bind the parameter
$updatedDepartmentQuery->bind_param("i", $_REQUEST['id']);
// Execute the query
$updatedDepartmentQuery->execute();
// Get the result from the query
$updatedDepartmentResult = $updatedDepartmentQuery->get_result();

// Fetch the updated department data
$updatedDepartment = $updatedDepartmentResult->fetch_assoc();

// Prepare the response with updated data
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $updatedDepartment;

//Close the connection
mysqli_close($conn);

// Display the data
echo json_encode($output);
?>