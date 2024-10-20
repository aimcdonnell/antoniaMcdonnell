<<<<<<< HEAD
=======
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
        $(this).remove();
        });
    }
});
    	//set up an event handler for the click button
	//when the button is clicked,
	$('#timezoneSubmitBtn').on('click', function() {
		//run the ajax request to the PHP routine "getCountryInfo.php"
		$.ajax({
			//set the expected format of whatever returns to JSON
			url: "/libs/php/getTimezoneInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				//pass the values of the two dropdowns as the parameters lat and lang
				lat: $('#timezoneLatInput').val(),
				lng: $('#timezoneLngInput').val(),
			},
			//in the success part of the call, any output from the PHP routine will be stored in the result variable
			success: function(result) {

				console.log(JSON.stringify(result));
				//if the status is ok, then display the data
				if (result.status.name == "ok") {
					//display the sunrise, sunset and time values
					//the data held in results is written into the appropriate html elements
					$('#txtCountryName').html(result.data.countryName);
                  	$('#txtSunrise').html(result.data.sunrise);
					$('#txtSunset').html(result.data.sunset);
					$('#txtTime').html(result.data.time);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 4351f18 (Adding Timezone code to index.html and script.js button function)
=======

	//set up an event handler for the click button
=======
    //set up an event handler for the click button
>>>>>>> 8ce53cf (Amended input ids in html code and script.js code. Also amended PHP file to successfully retrieve and display data on the frront-end)
	//when the button is clicked,
	$('#findNearbyWeatherSubmitBtn').on('click', function() {
    	const lat = $('#nearbyWeatherLatInput').val(); // Get latitude value
    	const lng = $('#nearbyWeatherLngInput').val(); // Get longitude value
      	
      	// Log lat and lng to the console
    	console.log('Nearby Weather Request - Latitude:', lat);
    	console.log('Nearby Weather Request - Longitude:', lng);

    	if (!lat || !lng) {
        alert("Please enter both latitude and longitude values.");
        return;
        }
      	
		//run the ajax request to the PHP routine "getNearbyWeather.php"
		$.ajax({
			//set the expected format of whatever returns to JSON
			url: "/libs/php/getNearbyWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				//pass the values of the two dropdowns as the parameters lat and lang
				lat: lat,
				lng: lng,
			},
			//in the success part of the call, any output from the PHP routine will be stored in the result variable
			success: function(result) {

				console.log(JSON.stringify(result));
				//if the status is ok, then display the data
				if (result.status.name == "ok") {
					//display the station location, temperature, datetime and Clouds information and time values
					//the data held in results is written into the appropriate html elements
					$('#txtStationLocation').html(result.data.stationName);
                  	$('#txtTemperature').html(result.data.temperature);
					$('#txtDateTime').html(result.data.datetime);
					$('#txtClouds').html(result.data.clouds);
				} else {
        		console.error("Error:", result.status.description); // Log any errors
    			}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});
>>>>>>> 50bfabd (Adding Get Nearby Weather code to application)
