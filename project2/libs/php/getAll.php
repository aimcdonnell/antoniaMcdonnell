<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//where the login details are stored
	include("config.php");

	//telling the script that the output is in JSON format and should be treated as JSON data
	header('Content-Type: application/json; charset=UTF-8');

	//credentials used to connect to the database (taken from config.php file)
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	//if unsuccessful, output error message
	if (mysqli_connect_errno()) {
		
		//the error structure as shown in the network tab of the browser
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		//close the connection
		mysqli_close($conn);

		//output the error message
		echo json_encode($output);

		//exit the script and avoid executing the rest of the code
		exit;

	}	
	// SQL does not accept parameters and so is not prepared
	//The query simply selects data, joins tables, and orders the data by last name, first name, department name, and location name, which is why preparation is not strictly necessary
	//Selecting columns from the personnel table, joining the department table on the departmentID column, and joining the location table on the locationID column. The ORDER BY clause orders the results by last name, first name, department name, and location name
	//LEFT JOIN department d ON (d.id = p.departmentID) joins the department table to the personnel table using the departmentId column in the personnel table and the d.id column in the department table
	//LEFT JOIN location l ON (l.id = d.locationID) joins the location table to the department table using the l.id column in the location table and the d.locationID column in the department table
	$query = 'SELECT p.id AS personnelId, p.lastName, p.firstName, p.jobTitle, p.email, d.id AS departmentId, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name';

	//executing the query
	$result = $conn->query($query);
	
	//if the query doesn't return a result
	if (!$result) {

		//the error structure as shown in the network tab of the browser
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		//close the connection
		mysqli_close($conn);

		//output the error message
		echo json_encode($output); 
		//exit the script and avoid executing the rest of the code
		exit;

	}
	
	//creates an array of associative arrays, where each associative array represents a row in the result set (key-value pair array)
   	$data = [];

	//fetches the next row from the result set and stores it in the $row variable
	while ($row = mysqli_fetch_assoc($result)) {
		//adds the associative array to the $data array
		array_push($data, $row);

	}

	//the success structure as shown in the network tab of the browser
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	//close the connection
	mysqli_close($conn);

	//output the success message
	echo json_encode($output); 

?>