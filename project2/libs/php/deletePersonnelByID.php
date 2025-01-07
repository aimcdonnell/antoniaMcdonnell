<?php

// Track execution time
$executionStartTime = microtime(true);

// Where the login details are stored
include("config.php");

// Telling the script that the output is in JSON format and should be treated as JSON data
header("Content-Type: application/json; charset=UTF-8");

// Credentials used to connect to the database (taken from config.php file)
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// If unsuccessful, output error message
if (mysqli_connect_errno()) {
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    // Close the connection
    mysqli_close($conn);

    // Display the error
    echo json_encode($output);

    // Exit the script and avoid executing the rest of the code
    exit;
}

// Fetch the firstName and lastName of the personnel to be deleted
$selectQuery = $conn->prepare("SELECT firstName, lastName FROM personnel WHERE id = ?");
$selectQuery->bind_param("i", $_POST["id"]);
$selectQuery->execute();
$result = $selectQuery->get_result();

$deletedPersonnel = null;
if ($result->num_rows > 0) {
    // Store the personnel details before deletion
    $deletedPersonnel = $result->fetch_assoc();
} else {
    // If no personnel found with that ID
    $output["status"]["code"] = "404";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "personnel not found";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// SQL statement to delete personnel by id
$query = $conn->prepare("DELETE FROM personnel WHERE id = ?");
$query->bind_param("i", $_POST["id"]);
$query->execute();

// If the query fails, output error
if (false === $query) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "query failed";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    // Close connection to database
    mysqli_close($conn);

    // Output error
    echo json_encode($output);

    // Exit the script
    exit;
}

// Fetch the updated personnel list
$selectQuery = $conn->prepare("SELECT id, firstName, lastName, jobTitle, email, departmentID FROM personnel");
$selectQuery->execute();
$result = $selectQuery->get_result();

$personnel = [];
while ($row = $result->fetch_assoc()) {
    $personnel[] = $row;
}

// If query was successful, return the deleted personnel details and the updated personnel list
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output["data"] = [
    "deletedPersonnel" => $deletedPersonnel,  // Include deleted personnel's details
    "updatedPersonnelList" => $personnel      // Include the updated personnel list
];

// Close connection to the database
mysqli_close($conn);

// Output the data
echo json_encode($output);

?>
