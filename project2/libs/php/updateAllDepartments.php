<?php

// Track execution time
$executionStartTime = microtime(true);

//where the login details are stored
include("config.php");

//telling the script that the output is in JSON format and should be treated as JSON data
header("Content-Type: application/json; charset=UTF-8");

//connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    //the error as shown in the network tab of the browser
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    //close the connection
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

// Update query for departments
$query = $conn->prepare("UPDATE department SET name = ?, locationID = ? WHERE id = ?");
$query->bind_param("sii", $_POST["name"], $_POST["locationID"], $_POST["id"]);
$query->execute();

if (false === $query) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "query failed";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];
} else {
    //Fetch all departments with their location names
    $selectQuery = $conn->prepare("
    SELECT d.id, d.name, l.name as location
    FROM department d
    LEFT JOIN location l ON d.locationID = l.id
    ORDER BY d.name, l.name
    ");

    // Execute the query
    $selectQuery->execute();
    // Get the result from the query
    $result = $selectQuery->get_result();

    // Fetch all departments with their location names
    $allDepartments = [];
    // Loop through the result and add each row to the $allDepartments array
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($allDepartments, $row);
    }

    // Output the data if successful
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = $allDepartments;
}

//Final output statement
echo json_encode($output);

//close the connection
$conn->close();

?>