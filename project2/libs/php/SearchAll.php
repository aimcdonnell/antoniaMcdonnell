<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/searchAll.php?txt=<txt>

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

	// first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	//prepare the SQL statement to search for all personnel, departments and locations
	$query = $conn->prepare('SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, `d`.`name` AS `departmentName`, `l`.`id` as `locationID`, `l`.`name` AS `locationName` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) WHERE `p`.`firstName` LIKE ? OR `p`.`lastName` LIKE ? OR `p`.`email` LIKE ? OR `p`.`jobTitle` LIKE ? OR `d`.`name` LIKE ? OR `l`.`name` LIKE ? ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`');

	//For example, if $_REQUEST['txt'] is "John", the resulting string will be %John%, which matches:
	//John, Johnny, Johnson, or anything containing "John"
  	$likeText = "%" . $_REQUEST['txt'] . "%";

	// bind parameters for markers, where (s = string)
	//Allowing the user to search for a term in all 6 columns
  	$query->bind_param("ssssss", $likeText, $likeText, $likeText, $likeText, $likeText, $likeText);

	// execute the prepared query
	$query->execute();
	
	//if the query fails
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
    
	// get the result from the executed statement
	$result = $query->get_result();

	//create an array to hold the results
  	$found = [];

	//loop through the result set
	while ($row = mysqli_fetch_assoc($result)) {
		//add the row to the associative array
		array_push($found, $row);

	}

	//the success structure as shown in the network tab of the browser
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['found'] = $found;
	
	//close the connection
	mysqli_close($conn);

	//display the data in JSON format
	echo json_encode($output); 

?>