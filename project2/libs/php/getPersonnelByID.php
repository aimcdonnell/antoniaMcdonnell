<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getPersonnelByID.php?id=<id>

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

	//if thhere's an error with the connection
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

	// first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	//get personnel by id
	$query = $conn->prepare('SELECT `id`, `firstName`, `lastName`, `email`, `jobTitle`, `departmentID` FROM `personnel` WHERE `id` = ?');

	// bind parameters for markers, where (i = integer)
	$query->bind_param("i", $_REQUEST['id']);

	// execute query
	$query->execute();
	
	// if there's an error with the query
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
    
	/// get the result from the query
	$result = $query->get_result();

	// create an array for personnel data
   	$personnel = [];

	//loop through the data and add it to the associative array
	while ($row = mysqli_fetch_assoc($result)) {
		//add the data from each row into the associative array
		array_push($personnel, $row);

	}

	// second query - does not accept parameters and so is not prepared
	$query = 'SELECT id, name from department ORDER BY name';

	//get the result from the query
	$result = $conn->query($query);
	
	//if there's an error with the query
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
	
	//create an array for department data
   	$department = [];

	//loop through the data and add it to the associative array
	while ($row = mysqli_fetch_assoc($result)) {

		//add the data for each row to the associative array
		array_push($department, $row);

	}

	//the success structure as shown in the network tab of the browser
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['personnel'] = $personnel;
	$output['data']['department'] = $department;
	
	//close the connection
	mysqli_close($conn);

	//display the data
	echo json_encode($output); 

?>