<?php

//track execution time
$executionStartTime = microtime(true);

//where the login details are stored
include("config.php");

//tell the script to start sending the content as JSON
header("Content-Type: application/json; charset=UTF-8");

// connect to database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

//if there's an error with the connection

if (mysqli_connect_errno()) {

    //the error structure as shown in the network tab of the browser
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    //close the connection
    mysqli_close($conn);

    //display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

// Prepare the SQL query
$query = $conn->prepare("SELECT p.id, p.firstName, p.lastName, p.email, p.jobTitle, 
                         d.id AS departmentID, d.name AS departmentName, l.name AS location
                         FROM personnel p
                         LEFT JOIN department d ON d.id = p.departmentID
                         LEFT JOIN location l ON l.id = d.locationID
                         WHERE (d.name LIKE ? OR ? = '') AND (l.name LIKE ? OR ? = '')
                         ORDER BY p.lastName, p.firstName");

// Get department and location from the request
$department = isset($_POST["department"]) ? "%" . $_POST["department"] . "%" : "";
$location = isset($_POST["location"]) ? "%" . $_POST["location"] . "%" : "";

// Bind parameters correctly
$query->bind_param("ssss", $department, $department, $location, $location);

$query->execute();

//if there's an error with the query
if (false === $query) {

    //the error structure as shown in the network tab of the browser
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    //close the connection
    mysqli_close($conn);

    //display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

//get the result from the query
$result = $query->get_result();

//create an array for personnel data
$personnel = [];

//loop through the personnel data and add it to the array

while ($row = mysqli_fetch_assoc($result)) {
    //add the row to the personnel array
    array_push($personnel, $row);
}

//the success structure as shown in the network tab of the browser
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $personnel;
//close the connection
mysqli_close($conn);

//display the data
echo json_encode($output);

?>