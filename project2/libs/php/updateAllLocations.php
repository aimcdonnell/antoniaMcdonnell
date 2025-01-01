<?php

//track execution time
$executionStartTime = microtime(true);

//where the login details are stored
include("config.php");

//telling the script that the output is in JSON format and should be treated as JSON data
header("Content-Type: application/json; charset=UTF-8");

//credentials used to connect to the database (taken from config.php file)
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

//if unsuccessful, output error message
if (mysqli_connect_errno()) {
    // the error structure as shown in the network tab of the browser
    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    //close the connection  
    mysqli_close($conn);

    //exit the script and avoid executing the rest of the code
    exit;
}

// Update query for locations
$query = $conn->prepare("UPDATE location SET name = ? WHERE id = ?");
$query->bind_param("si", $_POST["name"], $_POST["id"]);
$query->execute();

if (false === $query) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "query failed";
    $output["data"] = [];
} else {
    //Fetch all locations 
    $selectQuery = $conn->prepare("SELECT id, name from location ORDER BY name");
    
    //execute the query
    $selectQuery->execute();

    //fetch the results
    $result = $selectQuery->get_result();

    //fetch the results as an associative array
    $allLocations = [];
    //loop through the results and add them to the array
    while ($row = mysqli_fetch_assoc($result)){
        array_push($allLocations, $row);
    }

    //Output the data if successful
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = $allLocations;

}

//Final output statement
echo json_encode($output);

//close the connection
mysqli_close($conn);

?>