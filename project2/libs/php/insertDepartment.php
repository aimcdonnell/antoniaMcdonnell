<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	//where the login details are stored	
	include("config.php");

	// tell the script to start sending the content as JSON
	header('Content-Type: application/json; charset=UTF-8');

	// connect to database
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	// if there's an error with the connection
	if (mysqli_connect_errno()) {
		
		/// the error structure as shown in the network tab of the browser
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		// close the connection
		mysqli_close($conn);

		// display the error
		echo json_encode($output);

		// exit the script and avoid executing the rest of the code
		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	// insert department
	$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?,?)');
	// bind parameters for markers, where (s = string, i = integer)
	//$_REQUEST["name"] is expected to be a string and $_REQUEST["locationID"] an integer
	$query->bind_param("si", $_REQUEST['name'], $_REQUEST['locationID']);

	// execute query
	$query->execute();
	
	//if the query failed
	if (false === $query) {

		//the error structure as shown in the network tab of the browser
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		// close the connection
		mysqli_close($conn);

		// display the error
		echo json_encode($output); 

		// exit the script and avoid executing the rest of the code
		exit;

	}

	// the success structure as shown in the network tab of the browser
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	// close the connection
	mysqli_close($conn);

	// display the data
	echo json_encode($output); 

?>