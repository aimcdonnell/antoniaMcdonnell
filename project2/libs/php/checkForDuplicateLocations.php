<?php

// Track execution time
$executionStartTime = microtime(true);

// Include necessary files and establish the database connection
include("config.php");
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for database connection errors
if (mysqli_connect_errno()) {
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "Database unavailable.";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
    echo json_encode($output);
    exit;
}
// Get POST data and trim whitespace
$locationName = trim($_POST["locationName"] ?? "");

// Validate input data
if (empty($locationName)) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "Invalid input data: locationName cannot be empty.";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    $conn->close();
    exit;
}
// Check for duplicate locations with the same name
$query = $conn->prepare("SELECT name FROM location WHERE name = ?");
$query->bind_param("s", $locationName);
$query->execute();
$result = $query->get_result();

// Check if duplicates are found
if ($result->num_rows > 0) {
    $duplicates = [];

    //Fetch duplicate locations
    while ($row = $result->fetch_assoc()) {
        $duplicates[] = [
            "locationName" => $row["name"]
        ];
    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Duplicate locations found.";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = ["exists" => true, "duplicates" => $duplicates];
} else {
    //No duplicates found
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "No duplicate locations found.";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = ["exists" => false];

}

// Output the JSON response
echo json_encode($output);

// Close the database connection
$conn->close();
?>