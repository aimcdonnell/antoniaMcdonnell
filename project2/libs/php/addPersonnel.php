<?php 
//add personnel

// remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

//track execution time
$executionStartTime = microtime(true);

//where the login details are stored
include("config.php");

//tell the script that the output is in JSON format and should be treated as JSON data
header('Content-Type: application/json; charset=UTF-8');

//connect to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

//if there's an error with the connection

if (mysqli_connect_errno()) {
    //the error structure as shown in the network tab of the browser
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $outputput['data'] = [];

    //close the connection
    mysqli_close($conn);

    //display the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

//first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
// $_REQUEST used for development / debugging. Remember to change to $_POST for production
$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?, ?, ?, ?, ?)');

//bind the parameters to the query and execute the query
$query->bind_param("ssssi", $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['jobTitle'], $_REQUEST['email'], $_REQUEST['departmentID']);

//execute the query
$query->execute();

//if there's an error with the query
if (false === $query) {

    //provides the error message structure
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    //close connection
    mysqli_close($conn);

    //output the error
    echo json_encode($output);

    //exit the script and avoid executing the rest of the code
    exit;
}

//if the query was successful

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

//close connection
mysqli_close($conn);

//output the data
echo json_encode($output);


?>