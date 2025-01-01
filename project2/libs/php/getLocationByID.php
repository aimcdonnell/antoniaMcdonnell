<?php

// Track execution time
$executionStartTime = microtime(true);

// Where the login details are stored
include("config.php");
// Tell the script to start sending the content as JSON
header("Content-Type: application/json; charset=UTF-8");

// Connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// If there's an error with the connection
if (mysqli_connect_errno()) {
    // The error structure as shown in the network tab of the browser
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) * 1000 . " ms";
    $output["data"] = [];

    // Close the connection
    mysqli_close($conn);

    // Display the error
    echo json_encode($output);

    // Exit the script and avoid executing the rest of the code
    exit;
}

//first query
$query = $conn->prepare("SELECT id AS locationID, name AS locationName FROM location WHERE id = ?");

//execute the query
$query->bind_param("i", $_POST["locationId"]);

//execute the query
$query->execute();

// If there's an error with the query
if (false === $query) {
    // The error structure as shown in the network tab of the browser
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "executed";
    $output["status"]["description"] = "query failed";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) * 1000 . " ms";
    $output["data"] = [];

    //display the error
    echo json_encode($output);

    // Close the connection
    mysqli_close($conn);

    //exit the script and avoid executing the rest of the code
    exit;
}

// Get the result from the query
$result = $query->get_result();

//store the result in an array
$locations = [];

// Loop through the result and add each row to the array
while ($row = mysqli_fetch_assoc($result)) {
    array_push($locations, $row);
}

// Output the data if successful
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) * 1000 . " ms";
$output["data"] = $locations;

// Display the output
echo json_encode($output);

// Close the connection
mysqli_close($conn);

?>