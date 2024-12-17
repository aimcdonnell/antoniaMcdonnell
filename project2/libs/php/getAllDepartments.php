<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAllDepartments.php

	// remove next two lines for production	
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//where the login details are stored
	include("config.php");

	//telling the script that the output is in JSON format and should be treated as JSON data
	header('Content-Type: application/json; charset=UTF-8');

	// Connect to database
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	// if there's an error with the connection
	if (mysqli_connect_errno()) {
		
		//the error structure as shown in the network tab of the browser
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

	// SQL does not accept parameters and so is not prepared
	$query = 'SELECT id, name, locationID FROM department';

	// query database for all departments
	$result = $conn->query($query);
	
	// if there's an error with the query
	if (!$result) {
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
	//create an array for the department data
  	$data = [];

	//loop through the data and add it to the array
	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	//the successs structure as shown in the network tab of the browser
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	//close the connection
	mysqli_close($conn);

	//display the data
	echo json_encode($output); 

?>