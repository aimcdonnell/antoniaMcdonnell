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
			url: "libs/php/getTimezoneInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				//pass the values of the two dropdowns as the parameters country and lang
				lat: $('#latInput').val(),
				long: $('#longInput').val()
			},
			//in the success part of the call, any output from the PHP routine will be stored in the result variable
			success: function(result) {

				console.log(JSON.stringify(result));
				//if the status is ok, then display the data
				if (result.status.name == "ok") {
					//display the continent, capital, languages, population and area
					//the data held in results is written into the appropriate html elements
					$('#txtContinent').html(result['data'][0]['continent']);
					$('#txtCapital').html(result['data'][0]['capital']);
					$('#txtLanguages').html(result['data'][0]['languages']);
					$('#txtPopulation').html(result['data'][0]['population']);
					$('#txtArea').html(result['data'][0]['areaInSqKm']);

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});
>>>>>>> 4351f18 (Adding Timezone code to index.html and script.js button function)
