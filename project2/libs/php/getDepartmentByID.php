<?php

	//track execution time
	$executionStartTime = microtime(true);

	//where the login details are stored
	include("config.php");
	//telling the script that the output is in JSON format and should be treated as JSON data
	header("Content-Type: application/json; charset=UTF-8");

	// Connect to database
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	// if there's an error with the connection
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

	// first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
	//including the ? placeholder ensures that the query is safe from SQL injection
	$query = $conn->prepare("SELECT id AS departmentID, name as departmentName, locationID FROM department WHERE id =  ?");

	//specifying the data type of the parameter (i = integer)
	$query->bind_param("i", $_POST["departmentID"]);

	//execute the query
	$query->execute();
	
	//if the query fails, stop the script and display the error
	if (false === $query) {

		//the error structure as shown in the network tab of the browser
		$output["status"]["code"] = "400";
		$output["status"]["name"] = "executed";
		$output["status"]["description"] = "query failed";	
		$output["data"] = [];

		//display the error
		echo json_encode($output); 
		
		//stop the script
		mysqli_close($conn);

		//exit the script and avoid executing the rest of the code
		exit;

	}

	//get the result from the query
	$result = $query->get_result();

	//store the result in an array
   	$department = [];

	//loop through the data and add it to the associative array
	while ($row = mysqli_fetch_assoc($result)) {

		//add the row to the data array
		array_push($department, $row);

	}

	//second query - get all locations (no parameters needed)
	$query = "SELECT id AS locationID, name AS locationName FROM location ORDER BY name";

	//get the result from the query
	$result = $conn->query($query);

	//if there's an error with the query
	if (!$result) {

		//the error structure as shown in the network tab of the browser
		$output["status"]["code"] = "400";
		$output["status"]["name"] = "executed";
		$output["status"]["description"] = "query failed";
		$output["data"] = [];

		//close the connection
		mysqli_close($conn);

		//display the error
		echo json_encode($output);

		//exit the script and avoid executing the rest of the code
		exit;
	}

	$locations = [];

	//loop through the location data and add it to the associative array
	while ($row = mysqli_fetch_assoc($result)) {
		//add the row to the location array
		array_push($locations, $row);
	}

	//the success structure as shown in the network tab of the browser
	$output["status"]["code"] = "200";
	$output["status"]["name"] = "ok";
	$output["status"]["description"] = "success";
	$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output["data"]["department"] = $department;
	$output["data"]["locations"] = $locations;

	//display the data
	echo json_encode($output);

	//close the connection
	mysqli_close($conn);

?>