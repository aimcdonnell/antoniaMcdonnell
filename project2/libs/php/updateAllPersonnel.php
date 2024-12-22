<?php

//remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

//track execution time
$executionStartTime = microtime(true);

//where the login details are stored
include("config.php");

//telling the script that the output is in JSON format and should be treated as JSON data
header('Content-Type: application/json; charset=UTF-8');

//connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    //the error as shown in the network tab of the browser
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];

    //close the connection
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

// Update query for personnel
$query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');
$query->bind_param("ssssii", $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['jobTitle'], $_REQUEST['email'], $_REQUEST['departmentID'], $_REQUEST['id']);
$query->execute();

if (false === $query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
} else {
    // Fetch all personnel with their department names
    $selectQuery = $conn->prepare('
        SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.id AS departmentId, d.name as departmentName, l.name as location
        FROM personnel p
        LEFT JOIN department d ON p.departmentID = d.id
        LEFT JOIN location l ON d.locationID = l.id
        ORDER BY p.lastName, p.firstName, d.name, l.name
    ');
    $selectQuery->execute();
    $result = $selectQuery->get_result();

    $allPersonnel = [];
    while ($row = $result->fetch_assoc()) {
        $allPersonnel[] = $row;
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms"; // Include execution time
    $output['data'] = $allPersonnel;
}
//Final output statement
echo json_encode($output);

//close the connection
$conn->close();
