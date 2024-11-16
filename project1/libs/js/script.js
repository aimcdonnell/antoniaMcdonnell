// Preloader handling
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader").delay(1500).fadeOut("slow", function () {
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
          var infoBtn = L.easyButton('<i class="fa-solid fa-info fa-xl modalBtn infoBtn"></i>', function (btn, map) {
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

    var weatherBtn = L.easyButton('<i class="fa-solid fa-umbrella fa-xl modalBtn weatherBtn"></i>', function (btn, map) {
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
                      //console.log("Icon URL:", `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`);
                      $(`#weather-icon-${index/8}`).html(`<img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="Weather Icon">`);
                      $(`#weather-description-${index/8}`).html(`${day.weather[0].description}`);
                      $(`#weather-temp-${index/8}`).html(`${temp}°C`);
                      $(`#weather-humidity-${index/8}`).html(`${humidity}`);
                      //console.log("Weather icon code:", day.weather[0].icon);
                    }
                  });
                  //Show the weather modal
                  $("#weather-info-modal").modal("show");
                }
                //Handling errors
              }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error: ${textStatus} - ${errorThrown}`);
              }
            })
          }
        }
      });
    });
            
    weatherBtn.addTo(map);

    var currencyBtn = L.easyButton('<i class="fa-solid fa-dollar-sign fa-xl modalBtn currencyBtn"></i>', function (btn, map) {
      // AJAX request to get country information
      $("#currency-modal-rates").empty();
      $("#currency-modal-code").empty();
      $("#currency-input").empty();
      var currencyISOCode = $("#countrySelect").val();

      //if no ISO code selected, return
      if (!currencyISOCode) {
        console.warn("No ISO code selected for the weather modal.");
        return;
      }

      $.ajax({
        url: "libs/php/getCountryInformation.php",
        type: "GET",
        dataType: "json",
        data: { isoCode: currencyISOCode },
        success: function (response) {
          //console.log(JSON.stringify("GetCountryInformationResponse", response));
          if (response.status.name === "ok") {
            var currency = response.data.currencies;
            var currencyCode = Object.keys(currency)[0];
            //console.log("Currency ISO code", currencyCode);

            // AJAX request to get currency exchange rates
            $.ajax({
              url: "libs/php/getCurrencyData.php",
              type: "GET",
              dataType: "json",
              data: { currency: currencyCode },
              success: function (currencyResult) {
                if (currencyResult.status.name === "ok") {
                  // Display currency exchange rates
                  //loop through the rates in currencyResult.data.rates and display them in the modal

                  Object.entries(currencyResult.data.rates).forEach(([code, rate]) => {
                    if (code === currencyCode) {

                      $("#currency-modal-code").append(`${code}`)
                        $("#currency-modal-rates").append(`${rate}`)
                    }
                  })

                  // Function to calculate and display result
                  function calculateCurrencyConversion() {
                    var inputAmount = $("#currency-input").val();
                    var currencyRate = parseFloat($("#currency-modal-rates").text()) || 0;
                    
                    /// Check if input is a valid number
                    if (isNaN(inputAmount)) {
                      alert("Please enter a valid number.");
                      $("#currency-input").val("");
                      $("#currency-modal-results").html("0.00");
                      return;
                    }

                    // Calculate the result
                    var result = inputAmount * currencyRate;
                    
                    // Display the result in the designated area
                    $("#currency-modal-results").html(result.toFixed(2)); // Adjust decimal places as needed
                  }

                  // Attach change event handlers
                  $("#currency-input").on("input", calculateCurrencyConversion);
                  $("#currency-modal-rates").on("input", calculateCurrencyConversion);

                  // Trigger calculation on modal show to ensure it initializes with the current values
                  $("#currency-modal").on("show.bs.modal", calculateCurrencyConversion);

                  // Clear input value on modal hide
                  $("#currency-modal").on("hide.bs.modal", function () {
                    $("#currency-input").val(""); // Clear the input value
                  });

                  $("#currency-modal-base").html(currencyResult.data.base);
                  $("#currency-modal").modal("show");
                }
              }, 
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(`Error: ${textStatus} - ${errorThrown}`);
              }
            })
          }
        }   
    });
    });

    currencyBtn.addTo(map);
   
    var newsBtn = L.easyButton('<i class="fa-solid fa-newspaper fa-xl modalBtn newsBtn"></i>', function (btn, map) {

        // Get the selected country's ISO code
        $("#news-modal-body").empty();

        var newsISOCode = $("#countrySelect").val();
  
        if (!newsISOCode) {
          console.warn("No ISO code selected for the currency modal.");
          return;
        }

        // AJAX request to get news articles
        $.ajax({
          url: "libs/php/getNewsData.php",
          type: "GET",
          dataType: "json",
          data: { isoCode: newsISOCode },
          success: function (response) {
            if (response.status.name === "ok" && response.data.results.length > 0) {
              //console.log("News data response", response.data.results[0]);

              //display news articles matching the selected country's ISO code
              // Helper function to format date
              // Helper function to format date
              function formatDate(dateString) {
                const date = new Date(dateString);
                const day = date.getDate();
                const daySuffix = getDaySuffix(day);
                const month = date.toLocaleString("default", { month: "long" });
                const year = date.getFullYear();

                // Format the time component
                let hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12;  // Convert to 12-hour format

                return `${day}${daySuffix} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
              }

              function getDaySuffix(day) {
                if (day >= 11 && day <= 13) return "th";
                switch (day % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
              }
              Object.entries(response.data.results).forEach(([key, value]) => {
                let formattedDate = formatDate(value.pubDate);
                $("#news-modal-body").append(`
                  <tr>
                    <td colspan="3" </td>
                      <div style="display: flex; flex-direction: column;">
                        <span class="font-weight-bold">${value.title}</span>
                        <span>${formattedDate}</span>
                        <a href="${value.link}" target="_blank">Read more...</a>
                      </div>
                    </td>
                  </tr>
                `);
              });

              $("#news-modal").modal("show");

            } else {
              $("#news-modal-body").append(`
                <tr>
                    <td colspan="2">No news available from the selected country</td>
                </tr>
            `);
              $("#news-modal").modal("show");
            }
          }, error: function (jqXHR, textStatus, errorThrown) {
            console.log(`Error: ${textStatus} - ${errorThrown}`);
          }
        })
    });
    
    newsBtn.addTo(map);

    var wikipediaBtn = L.easyButton('<i class="fa-brands fa-wikipedia-w fa-xl modalBtn wikipediaBtn"></i>', function (btn, map) {
      $("#wikipedia-modal-body").empty();
      var wikipediaCountryName = $("#countrySelect option:selected").text();
      var wikipediaISOCode = $("#countrySelect").val();
      

      $.ajax({
        url: "libs/php/getWikipediaData.php",
        type: "GET",
        dataType: "json",
        data: { 
          country: wikipediaCountryName,
          isoCode: wikipediaISOCode
        },
        success: function (response) {
          console.log(response);
          if (response.status.name === "ok" && response.data.length > 0) {
            response.data.forEach(function (article) {
              $("#wikipedia-modal-body").append(`
                  <tr>
                    <td colspan="3">
                      <div style="display: flex; flex-direction: column;">
                        <span class="font-weight-bold">${article.title}</span>
                        <span>${article.summary}</span>
                        <a href="https://${article.wikipediaUrl}" target="_blank"> Read more...</a>
                      </div>
                    </td>
                </tr>
              `);
              
              $("#wikipedia-modal").modal("show");
            });
          } else {
            $("#wikipedia-modal-body").append(`
                <tr>
                    <td colspan="2">No Wikipedia articles available for the selected country</td>
                </tr>
            `);
            $("#wikipedia-modal").modal("show");
          }
        }, error: function (jqXHR, textStatus, errorThrown) {
          console.log(`Error: ${textStatus} - ${errorThrown}`);
        }
      })

    });

     wikipediaBtn.addTo(map);

     var energyBtn = L.easyButton('<i class="fa-solid fa-bolt fa-xl modalBtn energyBtn"></i>', function (btn, map) {
      

      // 1st AJAX request to geocode to get latitude and longitude values
      var energyIsoCode = $("#countrySelect").val();
      if (!energyIsoCode) {
        console.warn("No ISO code selected for the energy modal.");
        return;
      }
      
      $.ajax({
        url: "libs/php/getRenewableEnergyData.php",
        type: "GET",
        dataType: "json",
        data: {
          isoCode: energyIsoCode
        }, 
        success: function (response) {
          //console.log(response.data);

          if (response.status.name === "ok") {
            //console.log(response.data);
            $("#renewable-energy-country").html(response.data.country);
            $("#renewable-energy-generation").html(response.data.generation_GWh + " GWh");
            $("#renewable-energy-percentage").html(response.data.renewable_percentage + "%");
            $("#renewable-hydro-percentage").html(response.data.hydro + "%");
            $("#renewable-wind-percentage").html(response.data.wind + "%");
            $("#renewable-solar-percentage").html(response.data.solar + "%");
            $("#renewable-biomass-percentage").html(response.data.bioenergy + "%");
            $("#renewable-geothermal-percentage").html(response.data.geothermal + "%");
            
            $("#renewable-energy-modal").modal("show");


          } else {
            $("#modal-body").append(`
                <tr>
                    <td colspan="2">No renewable energy data available for the selected country</td>
                </tr>
            `);
            $("#renewable-energy-modal").modal("show");
          }
        }
      })
      
    });
    energyBtn.addTo(map);

    var naturalDisasterBtn = L.easyButton('<i class="fa-solid fa-triangle-exclamation fa-xl modalBtn naturalDisasterBtn"></i>', function(btn, map){
      
      $("#natural-disaster-modal-body").empty();

      var naturalDisasterCountry = $("#countrySelect option:selected").text();

      if (!naturalDisasterCountry) {
        console.warn("No country selected for the natural disaster modal.");
        return;
      }

      $.ajax({
        url: "libs/php/getNaturalDisasterData.php",
        type: "GET",
        dataType: "json",
        data: {
          country: naturalDisasterCountry
        },
        success: function (response) {
          console.log(response);
          if (response.status.name === "ok" && response.data.length > 0) {
            response.data.forEach(function (event){
              
              function getCountryName(naturalDisasterCountry, countries) {
                // Check if the country name matches the expected country name in the response data
                if (Array.isArray(countries)) {
                  for (let i = 0; i < countries.length; i++) {
                    if (countries[i].name === naturalDisasterCountry) {
                      return naturalDisasterCountry; // Return country name if match is found
                    }
                  }
                } else if (countries === naturalDisasterCountry) {
                  // Single country match
                  return naturalDisasterCountry;
                }
                return "Unknown Country"; // Fallback if no match is found
              }

              function capitalizeFirstLetter(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
              }

              function formatDate(dateString) {
                const date = new Date(dateString);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'long' });
                const year = date.getFullYear();
                return `${month} ${year}`;
              }

              var countryName = getCountryName(naturalDisasterCountry, event.fields.country);

              $("#natural-disaster-modal-body").append(`
                <tr>
                  <td>
                    <div style="display: flex; flex-direction: column;">
                      <span><strong>Country:</strong> ${countryName}</span>
                      <span><strong>Natural Disaster:</strong> ${event.fields.type[0].name}</span>
                      <span><strong>Date:</strong> ${formatDate(event.fields.date.created)}</span>
                      <span><strong>Status:</strong> ${capitalizeFirstLetter(event.fields.status)}</span>
                      <span><a href="${event.fields.url}" target="_blank">Learn more</a></span>
                    </div>
                  </td>
                </tr>
              `);
              $("#natural-disaster-modal").modal("show");
            });
          } else {
            $("#natural-disaster-modal-body").append(`
                <tr>
                    <td colspan="2">No natural disaster data available for the selected country</td>
                </tr>
            `);
            $("#natural-disaster-modal").modal("show");
          }
        }, error: function (jqXHR, textStatus, errorThrown) {
          console.log(`Error: ${textStatus} - ${errorThrown}`);
        }
      })
    });

    naturalDisasterBtn.addTo(map);
  });
});
