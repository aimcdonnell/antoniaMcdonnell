<?php

// Track execution time
$executionStartTime = microtime(true);

// Include database configuration
include("config.php");

// Set the content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    // Database connection error
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    // Close the connection and exit
    echo json_encode($output);
    exit;
}

// Check if "txt" is set in the POST request
$searchTerm = "%"; // Default value to fetch all records
if (isset($_POST["txt"]) && !empty($_POST["txt"])) {
    $searchTerm = "%" . $_POST["txt"] . "%"; // Use search term if provided
}

// Initialize the output array
$output = [];

// Query for searching personnel
$personnelQuery = $conn->prepare("
    SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as departmentName, l.name as locationName
    FROM personnel p
    LEFT JOIN department d ON p.departmentID = d.id
    LEFT JOIN location l ON d.locationID = l.id
    WHERE p.lastName LIKE ? OR p.firstName LIKE ? OR p.jobTitle LIKE ? OR p.email LIKE ?
    ORDER BY p.lastName, p.firstName, d.name, l.name
");
$personnelQuery->bind_param("ssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$personnelQuery->execute();
$personnelResult = $personnelQuery->get_result();

// Fetch all personnel
$personnel = [];
while ($row = $personnelResult->fetch_assoc()) {
    $personnel[] = $row;
}

// Query for searching departments
$departmentQuery = $conn->prepare("
    SELECT d.id, d.name as departmentName, l.name as locationName
    FROM department d
    LEFT JOIN location l ON d.locationID = l.id
    WHERE d.name LIKE ? OR l.name LIKE ?
    ORDER BY d.name, l.name
");
$departmentQuery->bind_param("ss", $searchTerm, $searchTerm);
$departmentQuery->execute();
$departmentResult = $departmentQuery->get_result();

// Fetch all departments
$departments = [];
while ($row = $departmentResult->fetch_assoc()) {
    $departments[] = $row;
}

// Query for searching locations
$locationQuery = $conn->prepare("
    SELECT id, name as locationName
    FROM location
    WHERE name LIKE ?
    ORDER BY name
");
$locationQuery->bind_param("s", $searchTerm);
$locationQuery->execute();
$locationResult = $locationQuery->get_result();

// Fetch all locations
$locations = [];
while ($row = $locationResult->fetch_assoc()) {
    $locations[] = $row;
}

// Prepare the final output
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output["data"]["personnel"] = $personnel;
$output["data"]["departments"] = $departments;
$output["data"]["locations"] = $locations;

// Output the data as JSON
echo json_encode($output);

// Close the connection
$conn->close();

?>
