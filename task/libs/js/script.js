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
				lat: $('#latInput').val(),
				lng: $('#lngInput').val(),
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
>>>>>>> 4351f18 (Adding Timezone code to index.html and script.js button function)
=======

	//set up an event handler for the click button
	//when the button is clicked,
	$('#findNearbyWeatherSubmitBtn').on('click', function() {
		//run the ajax request to the PHP routine "getCountryInfo.php"
		$.ajax({
			//set the expected format of whatever returns to JSON
			url: "/libs/php/getNearbyWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				//pass the values of the two dropdowns as the parameters lat and lang
				lat: $('#latInput2').val(),
				lng: $('#lngInput2').val(),
			},
			//in the success part of the call, any output from the PHP routine will be stored in the result variable
			success: function(result) {

				console.log(JSON.stringify(result));
				//if the status is ok, then display the data
				if (result.status.name == "ok") {
					//display the sunrise, sunset and time values
					//the data held in results is written into the appropriate html elements
					$('#txtStationLocation').html(result['data'][0]['stationName']);
                  	$('#txtTemperature').html(result['data'][0]['temperature']);
					$('#txtDateTime').html(result['data'][0]['datetime']);
					$('txtClouds').html(result['data'][0]['clouds']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});
>>>>>>> 50bfabd (Adding Get Nearby Weather code to application)
