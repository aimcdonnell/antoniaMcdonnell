// Preloader handling
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader").delay(1000).fadeOut("slow", function () {
      $(this).remove();
    });
  }

  // ---------------------------------------------------------
  // GLOBAL DECLARATIONS
  // ---------------------------------------------------------

  // Store the leaflet map instance
  var map;

  // Store the tile layer interface to change map layers
  var layerControl;

  var countryData = [];

  // Street map layer
  var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  });

  // Satellite map layer
  var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  });

  // Layers are stored in basemaps variable to facilitate easy switching
  var basemaps = {
    "Streets": streets,
    "Satellite": satellite
  };

  
  /*currencyBtn.addTo(map);
  wikipediaBtn.addTo(map);
  newspaperBtn.addTo(map);*/

  var currencyBtn = L.easyButton("fa-solid fa-dollar-sign fa-xl", function (btn, map) {
    $("#").modal("show");
  });

  var wikipediaBtn = L.easyButton("fa-brands fa-wikipedia-w fa-xl", function (btn, map) {
    $("#").modal("show");
  });

  var newspaperBtn = L.easyButton("fa-solid fa-newspaper fa-xl", function (btn, map) {
    $("#").modal("show");
  });

  // ---------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------

  // Initialise map with streets as the default layer
  //$(function () {} means run the code only after the DOM is fully loaded
  $(function () {
    map = L.map("map", {
      layers: [streets]
    });

    // Add a layer group for the border
    let borderLayer = L.layerGroup().addTo(map);

    // Add the layer control to the map
    layerControl = L.control.layers(basemaps).addTo(map);
    
    // AJAX request to get countries
    $.ajax({
      url: "libs/php/getCountries.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          result.data.forEach(country => {
            countryData.push({
              code: country["iso_a2"],
              name: country["name"]
            });

            $("<option>")
              .val(country["iso_a2"])
              .text(country["name"])
              .appendTo("#countrySelect");
          });
          
          //sorting the country names alphabetically
          var options = $("#countrySelect option").toArray();
          options.sort(function (a, b) {
            let aa = a.textContent;
            let bb = b.textContent;

            if (aa.toUpperCase() < bb.toUpperCase()) return -1;
            else if (aa.toUpperCase() > bb.toUpperCase()) return 1;
            else return 0;            
          });
          $("#countrySelect").empty().append(options);
          }
        },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(`Error: ${textStatus} - ${errorThrown}`);
      }
    });

          // Info button to open the info modal
          var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
            var selectedISOCode = $("#countrySelect").val();
      
          if (!selectedISOCode) {
            console.warn("No ISO code selected.");
          }

              //Handles the information button window data

          $.ajax({
            url: "libs/php/getCountryInformation.php",
            type: "POST",
            dataType: "json",
            //retrieving the iso code value from the countrySelect dropdown
            data: { isoCode: selectedISOCode },

            success: function(result) {
              //const response = JSON.parse(result);
              //checking the response format
              //console.log(JSON.stringify(result.data.name.common));

              //adding the data to the modal
              if (result.status.name === "ok") {
                $("#country-name").html(result.data.name.common);
                $("#country-capital").html(result.data.capital[0]);
                $("#country-flag").html(`<img src="${result.data.flags.svg}" class="img-thumbnail" alt="flag">`);
                $("#country-population").html(result.data.population.toLocaleString());
                $("#country-languages").html(Object.values(result.data.languages).join(", "));
                
                // Display the modal when the data is loaded
                $("#country-info-modal").modal("show");
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(`Error: ${textStatus} - ${errorThrown}`);
            }
          });
          
        });

        // Add the info button to the map
        infoBtn.addTo(map);

        

    // Check if the user has geolocation enabled

    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation");
    } else {
      navigator.geolocation.getCurrentPosition(getPosition);
    }

    // Get user's position
    function getPosition(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      // Set the map view to the user's location
      map.setView([lat, lng], 6);

    //Reverse geocoding to get the user country's ISO code
    $.ajax({
      url: "libs/php/getGeocodeData.php",
      type: "GET",
      data: {
        lat: lat,
        lng: lng
      },
      success: function (response) {
        //decodes the response from the php script
        //const result = JSON.parse(response);
        //console.log(JSON.stringify(result.data[0].components["ISO_3166-1_alpha-2"]));
        if (response.data && response.data.length > 0) {
          //console.log("Response results:", response)
          const userCountry = response.data[0].components["ISO_3166-1_alpha-2"];
          //console.log(`User country: ${userCountry}`);

          //trigger the change event to select the user's country location
          $("#countrySelect").val(userCountry).trigger("change");

        } else {
          console.warn("No country code found for the user's location");
        }
      }, error: function (jqXHR, textStatus, errorThrown) {
        console.error(`Reverse geocoding error: ${textStatus} - ${errorThrown}`);
      }
    });  
      }
      
   
      
    // Handles dropdown country selection changes
    $("#countrySelect").on("change", function () {
      // Get the selected country's ISO code
      var selectedISOCode = $(this).val();

      if (!selectedISOCode) {
        console.warn("No ISO code selected.");
        return;
      }

      // AJAX request to get country border data
      $.ajax({
        url: "libs/php/getCountryBorders.php",
        type: "GET",
        //send the ISO code from the dropdown to the php script
        data: { isoCode: selectedISOCode },
        dataType: 'json',
        success: function (response) {

          if (borderLayer) {
            borderLayer.clearLayers();
          }
          
          const borderCoordinates = response.data; // Access the coordinates

          // Determine whether the structure is MultiPolygon or Polygon
          const isMultiPolygon = Array.isArray(borderCoordinates[0][0]) && Array.isArray(borderCoordinates[0][0][0]);
          //console.log("isMultiPolygon: ", isMultiPolygon);

          const geoJsonData = {
            type: "Feature",
            geometry: {
              type: isMultiPolygon ? "MultiPolygon" : "Polygon",
              coordinates: borderCoordinates
            },
            properties: {}
          };
    

          try {
            // Log the structure of geoJsonData to check format
            //console.log("GeoJSON data structure:", JSON.stringify(geoJsonData, null, 2));

            let geoJsonLayer = L.geoJSON(geoJsonData, {
              style: {
                color: "#ff1234",
                weight: 3,
                opacity: 1,
                fillColor: "#ff1234",
                fillOpacity: 0.2
              }
            }).addTo(borderLayer); // Add to the borderLayer

            // Fit bounds of the map to the geoJSON layer
            let bounds = geoJsonLayer.getBounds();
            map.fitBounds(bounds);
          } catch (error) {
            console.error("Error adding GeoJSON layer:", error);
          }
        }, error: function (jqXHR, textStatus, errorThrown) {
          console.log(`Error: ${textStatus} - ${errorThrown}`);
        }
      });
    });

    var weatherBtn = L.easyButton("fa-solid fa-umbrella fa-xl", function (btn, map) {
      // 1st AJAX request to geocode to get latitude and longitude values
      var chosenIsoCode = $("#countrySelect").val();
      if (!chosenIsoCode) {
        console.warn("No ISO code selected.");
        return;
      }
      //get the lat and lng values for the capital city from geocodeData
      $.ajax({
        url: "libs/php/getCountryInformation.php",
        type: "GET",
        dataType: "json",
        data: { isoCode: chosenIsoCode },
        success: function (response) {
          if (response.status.name === "ok") {
            const capital = response.data.capitalInfo.latlng;
            //console.log("Capital city:", capital);

            //pass the capital city lat and lng values from openCage data to the openWeather API
            $.ajax({
              url: "libs/php/getDailyWeatherData.php",
              type: "GET",
              dataType: "json",
              data: { 
                lat: capital[0], 
                lng: capital[1]
              },
              success: function (weatherResult) {
                if (weatherResult.status.name === "ok") {
                  // Display current weather for capital city
                  $("#weather-capital").html(weatherResult.data.city.name);
                  
                  // Loop through 5 day forecast
                  weatherResult.data.list.forEach((day, index) => {
                    if (index % 8 === 0) {
                      const temp = Math.round(day.main.temp);
                      const humidity = day.main.humidity;
                      
                      // Add data to existing modal elements using day number
                      console.log("Icon URL:", `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`);
                      $(`#weather-icon-${index/8}`).html(`<img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="Weather Icon">`);
                      $(`#weather-description-${index/8}`).html(`${day.weather[0].description}`);
                      $(`#weather-temp-${index/8}`).html(`${temp}°C`);
                      $(`#weather-humidity-${index/8}`).html(`${humidity}`);
                      //console.log("Weather icon code:", day.weather[0].icon);
                    }
                  });

                  $("#weather-info-modal").modal("show");
                }
              }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error: ${textStatus} - ${errorThrown}`);
              }
            })
          }
        }
      });
    });
            
    weatherBtn.addTo(map);

      
  });
});
