<?php

// Track execution time
$executionStartTime = microtime(true);

//Where the login details are stored
include("config.php");

// Tell the script that the output is in JSON format and should be treated as JSON data
header("Content-Type: application/json; charset=UTF-8");

// Connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// If there's an error with the connection
if (mysqli_connect_errno()) {
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Prepare the SQL statement to insert new location data
$query = $conn->prepare("INSERT INTO location (name, id) VALUES (?, ?)");

// Bind the location name and ID
$query->bind_param("si", $_POST["locationName"], $_POST["locationID"]);

// Execute the query
$query->execute();

// Check if the query was successful
if ($query->affected_rows > 0) {
    // Get the last inserted location"s ID
    $lastInsertId = $conn->insert_id;

    // Fetch the location information
    $selectQuery = $conn->prepare("SELECT id, name FROM location WHERE id = ?");
    $selectQuery->bind_param("i", $lastInsertId);
    $selectQuery->execute();
    $result = $selectQuery->get_result();

    // Fetch the result as an associative array
    if ($row = $result->fetch_assoc()) {
        $location = $row;

        // Prepare the output data
        $output["status"]["code"] = "200";
        $output["status"]["name"] = "ok";
        $output["status"]["description"] = "success";
        $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output["data"] =["message" => "Location added successfully", "location" => $location];
    } else {
        // If no location found, set the output status to "not found"
        $output["status"]["code"] = "500";
        $output["status"]["name"] = "error";
        $output["status"]["description"] = "Location not found";
        $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output["data"] = [];
    }
} else {
    // No rows were affected, so the location was not added
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "query failed";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
}

// Output the JSON data
echo json_encode($output);

// Close the database connection
mysqli_close($conn);
?>