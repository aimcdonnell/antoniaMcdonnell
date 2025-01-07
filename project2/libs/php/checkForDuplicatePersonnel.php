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
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
    echo json_encode($output);
    exit;
}

// Validate input (change to POST before production)
$firstName = trim($_POST["firstName"] ?? "");
$lastName = trim($_POST["lastName"] ?? "");
$email = trim($_POST["email"] ?? "");

if (empty($firstName) || empty($lastName) || empty($email)) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "invalid input data";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
    echo json_encode($output);
    $conn->close();
    exit;
}

// Check for duplicate personnel
$query = $conn->prepare("SELECT id, firstName, lastName, jobTitle, email, departmentID FROM personnel WHERE firstName = ? AND lastName = ? AND email = ?");
$query->bind_param("sss", $firstName, $lastName, $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    // Duplicate found
    $row = $result->fetch_assoc();
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "Duplicate personnel found";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [
        "firstName" => $row["firstName"], 
        "lastName" =>$row["lastName"], 
        "exists" => true
    ];
} else {
    // No duplicates found
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "No duplicate personnel found";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = ["exists" => false];
}

// Close the connection
$conn->close();

// Output the response
echo json_encode($output);

?>
