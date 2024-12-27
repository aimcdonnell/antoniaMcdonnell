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
if (mysqli_connect_errno()){
    //The error structure as shown in the network tab of the browser
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

//First query - SQL statement accepts parameters and so is prepared to avoid SQL injection
$query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');

// Bind parameters for markers
$query->bind_param("si", $_REQUEST['locationName'], $_REQUEST['locationId']);

// Execute the query
$query->execute();

// If there's an error with the query
if (false === $query) {
    // The error structure as shown in the network tab of the browser
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    //Close the connection
    mysqli_close($conn);

    // Display the error
    echo json_encode($output);

    // Exit the script and avoid executing the rest of the code
    exit;
} else {

    // Retrieve the updated location data
$updatedLocationQuery = $conn->prepare('SELECT id, name FROM location WHERE id = ?');
// Bind the location id parameter
$updatedLocationQuery->bind_param("i", $_REQUEST['locationId']);

//Execute the query
$updatedLocationQuery->execute();

// Get the result from the query
$updatedLocationResult = $updatedLocationQuery->get_result();

//Check if the query returns any rows

$location = [];
//Fetch the updated location data
while ($row = $updatedLocationResult->fetch_assoc()) {
    $location[] = [
        'locationName' => $row['name'],
        'locationID' => $row['id']
    ];
}
    //Prepare the response with updated location data
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $location;

}

// Display the data
echo json_encode($output);

// Close the connection
mysqli_close($conn);

?>