<?php 

// Add personnel

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

// Prepare the SQL statement to insert new personnel data
$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?, ?, ?, ?, ?)');
$query->bind_param("ssssi", $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['jobTitle'], $_REQUEST['email'], $_REQUEST['departmentID']);

// Execute the query
$query->execute();

// Check if the query was successful
// Check if the query was successful
if ($query->affected_rows > 0) {
    // Successfully added the new personnel
    // Fetch the ID of the last inserted personnel
    $lastInsertedID = $conn->insert_id;

    // Query to get the firstName and lastName of the added personnel using the last inserted ID
    $selectQuery = $conn->prepare('SELECT firstName, lastName FROM personnel WHERE id = ?');
    $selectQuery->bind_param('i', $lastInsertedID);
    $selectQuery->execute();
    $result = $selectQuery->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Prepare the response with the added personnel details
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [
            'message' => 'Personnel added successfully',
            'firstName' => $row['firstName'], // Get firstName of added personnel
            'lastName' => $row['lastName']   // Get lastName of added personnel
        ];
    } else {
        // If the personnel details are not found
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "failed to retrieve personnel details";
        $output['data'] = [];
    }
} else {
    // No rows affected: no personnel added
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
}


// Display the data
echo json_encode($output);

// Close the connection
mysqli_close($conn);

?>
