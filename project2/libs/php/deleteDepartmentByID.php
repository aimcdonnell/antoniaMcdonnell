<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

	// remove next two lines for production

	//delete a department by id if a department is no longer operational or relevant, duplicate or incorrect
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//track execution time
	$executionStartTime = microtime(true);

	//where the login details are stored
	include("config.php");

	//telling the script that the output is in JSON format and should be treated as JSON data
	header('Content-Type: application/json; charset=UTF-8');


	//connectng to the MySQL database server
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	//if there's an error with the connection, stop the script and display the error
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
	
	//check if any employees are assigned to the department before deleting
	$departmentID = $_REQUEST['id'];
	$query = $conn->prepare('
	SELECT
		(SELECT name FROM department WHERE id = ?) AS departmentName,
		COUNT(*) as count 
		FROM personnel 
		WHERE departmentID = ?
		');
	$personnelDepartmentID = $departmentID;
	$query->bind_param("ii", $departmentID, $personnelDepartmentID);
	$query->execute();
	$checkResult = $query->get_result()->fetch_assoc();

	if ($checkResult['count'] > 0) {
		$output['status']['code'] = "403";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Cannot delete department with assigned personnel";
		$output['data']['count'] = $checkResult['count'];
		$output['data']['departmentName'] = $checkResult['departmentName'];
		//Return the output
		echo json_encode($output);
		exit;
	}
	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	//including the ? placeholder ensures that the query is safe from SQL injection
	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	
	//specifying the data type of the parameter (i = integer)
	//$_REQUEST['id'] retrieves the id of the department to be deleted
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