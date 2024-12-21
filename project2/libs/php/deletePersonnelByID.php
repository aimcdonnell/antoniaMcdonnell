<?php


    // delete a perrsonnel by id if a personnel is no longer at the company, a duplicate or incorrectly added
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    //track execution time
    $executionStartTime = microtime(true);

    //where the login details are stored
    include("config.php");

    //telling the script that the output is in JSON format and should be treated as JSON data
    header('Content-Type: application/json; charset=UTF-8');

    //credentials used to connect to the database (taken from config.php file)
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    //if unsuccessful, output error message
    if (mysqli_connect_errno()) {

        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        //close the connection
        mysqli_close($conn);

        //display the error
        echo json_encode($output);

        //exit the script and avoid executing the rest of the code
        exit;

    }

    // SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
    $query = $conn->prepare('DELETE FROM personnel WHERE id = ?');

    //specifying the data type of the parameter (i = integer)
    //$_REQUEST['id'] retrieves the id of the personnel to be deleted
    $query->bind_param("i", $_REQUEST['id']);

    //runs the prepared statement with the bound parameter ("i")
	//execute() returns true on success or false on failure
	$query->execute();

    //if the query fails, output error
	if (false === $query) {

		//provides the error message structure
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];
		
		//close connection to database
		mysqli_close($conn);

		//output error
		echo json_encode($output); 

		//exit the script and avoid executing the rest of the code
		exit;

	}

    //if query was successful
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	//close connection to database
	mysqli_close($conn);

	//output the data
	echo json_encode($output); 


?>