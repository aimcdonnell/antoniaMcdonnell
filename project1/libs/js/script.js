<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// Preloader handling
$(window).on("load", function () {
<<<<<<< HEAD
<<<<<<< HEAD
  if ($("#preloader").length) {
    $("#preloader").delay(1500).fadeOut("slow", function () {
=======
  if ($("#preloader").length) {
<<<<<<< HEAD
    $("#preloader").delay(1000).fadeOut("slow", function () {
>>>>>>> 68b9fc1 (Amending getCountries.php and script.js so that they use the PHP routine correctly)
=======
    $("#preloader").delay(1500).fadeOut("slow", function () {
>>>>>>> 3d3d168 (Adding wikipedia articles to the wiki modal, updating countryBorders.geo.json file and saving renewable energy percentages)
      $(this).remove();
    });
  }

  // ---------------------------------------------------------
  // GLOBAL DECLARATIONS
  // ---------------------------------------------------------
<<<<<<< HEAD

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
  }

  // ---------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------

  // Initialise map with streets as the default layer
  //$(function () {} means run the code only after the DOM is fully loaded
  $(function () {
    map = L.map("map", {
      layers: [streets]
    });

    let overlays;

    // Add a layer group for the border
    let borderLayer = L.layerGroup().addTo(map);

    // Add the layer control to the map
    //layerControl = L.control.layers(basemaps, overlays).addTo(map);
    
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
          //console.log(response);
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
    
    let cityMarkersGroup = L.markerClusterGroup().addTo(map);
    let poiMarkersGroup = L.markerClusterGroup().addTo(map);

    function fetchNearbyPOIs(lat, lng) {
      poiMarkersGroup.clearLayers();
          $.ajax({
              url: "libs/php/getNearbyPointsOfInterest.php",
              type: "GET",
              dataType: "json",
              data: { lat, lng },
              success: function (response) {
                //console.log(response);
                if (response && response.status && response.status.name === "ok" && Array.isArray(response.data) && response.data.length > 0) {
                      response.data.forEach(poi => {
                        let markerIcon;
                      if (markerIcon) {}
                        if (poi.typeClass === "building"){
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-building",
                            markerColor: "red",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "attraction") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-star",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "tourism") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-camera",
                            markerColor: "purple",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "natural") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-tree",
                            markerColor: "green",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "amenity") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-shop",
                            markerColor: "orange",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "shop") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-store",
                            markerColor: "orange-dark",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "highway") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-road",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "food") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-utensils",
                            markerColor: "white",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "leisure") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-umbrella-beach",
                            markerColor: "pink",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "transport") {
                         markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-bus",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "education") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-graduation-cap",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })

                        } else if (poi.typeClass === "healthcare") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-briefcase-medical",
                            markerColor: "red",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })
                        } else if (poi.typeClass === "railway") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-train",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })
                        } else if (poi.typeClass === "man_made") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-factory",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          }) 
                        } else if (poi.typeClass === "office") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-building",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })
                        } else if (poi.typeClass === "place_of_worship") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-church",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })
                        } else if (poi.typeClass === "power") {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-plug",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })
                        } else {
                          markerIcon = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-map-marker",
                            markerColor: "blue",
                            shape: "circle",
                            prefix: "fa",
                            iconColor: "white",
                            extraClasses: "fa-2x",
                          })
                        }
                        if (markerIcon) {
                          L.marker([poi.lat, poi.lng], { icon: markerIcon })
                          .addTo(poiMarkersGroup)
                          .bindPopup(`${poi.name || "Unnamed " + poi.typeClass + " marker"} `);
                        } else {
                          console.warn(`No icon available for POI type: ${poi.typeClass}`);
                        }
                      });
                  } else {
                      console.log("No POIs found near the given coordinates.");
                  }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                  console.error(`Error fetching POIs: ${textStatus} - ${errorThrown}`);
              }
          });
  }

    function addCityMarkers() {
        cityMarkersGroup.clearLayers();
    
        const countryIsoCode = $("#countrySelect").val();
        $.ajax({
            url: "libs/php/getCities.php",
            type: "GET",
            dataType: "json",
            data: { isoCode: countryIsoCode },
            success: function (response) {
              //console.log(response);
                if (response.status.name === "ok" && response.data.length > 0) {
                    response.data.forEach(city => {
                      //console.log("Coordinates:", city.lat, city.lng);
                        const cityMarker = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-city",
                            markerColor: "black",
                            shape: "circle",
                            prefix: "fa"
                        });
                        if (cityMarker) {
                        L.marker([city.lat, city.lng], { icon: cityMarker })
                            .addTo(cityMarkersGroup)
                            .bindPopup(`${city.name}`);
                            fetchNearbyPOIs(city.lat, city.lng);
                        }
                    });
                } else {
                    console.log("No cities found for the selected country.");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }

        });
    }
        $("#countrySelect").on("change", function () {
        addCityMarkers();
    });

    overlays = {
        "Points of Interest": poiMarkersGroup,
        "Cities": cityMarkersGroup
    };

    layerControl = L.control.layers(basemaps, overlays).addTo(map);

  });
});
=======
=======
=======
// Preloader handling
>>>>>>> 1e671ea (Understanding the map code and adding polygons instead of using setView)
$(window).on('load', function () {
=======
>>>>>>> da455e7 (Rewriting code to follow the correct method, using PHP routines rather than multiple AJAX calls)
  if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut("slow", function () {
      $(this).remove();
    });
  }
<<<<<<< HEAD
<<<<<<< HEAD
});
    

<<<<<<< HEAD
>>>>>>> 874f67c (Added preloader code to index.css and script.js files)
=======
// ---------------------------------------------------------
>>>>>>> 1175bce (Amending script.js, index.css and index.html to try and get map to work)
=======
=======

>>>>>>> da455e7 (Rewriting code to follow the correct method, using PHP routines rather than multiple AJAX calls)
  // ---------------------------------------------------------
>>>>>>> 1e671ea (Understanding the map code and adding polygons instead of using setView)
// GLOBAL DECLARATIONS
// ---------------------------------------------------------
=======
>>>>>>> aa2580b (Added borders to all the countries on the map)

  // Store the leaflet map instance
  var map;

  // Store the tile layer interface to change map layers
  var layerControl;

  var countryData = [];


  // Street map layer
  var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
<<<<<<< HEAD
  }
);

//satellite map layer
var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

//layers are stored in basemaps variable to facilitate easy switching
var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

// buttons
//fa-info icon (Font Awesome) info button in a larger size (fa-xl), which opens a modal with the ID "exampleModal" when clicked
var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#exampleModal").modal("show");
});

// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

// initialise map with streets as the default layer once DOM is ready

$(function () {
  
  map = L.map("map", {
    layers: [streets]
  }).setView([54.5, -4], 6);
  
  // setView is not required in your application as you will be
  // deploying map.fitBounds() on the country border polygon

  //adds the layer control to the map allowing the user to toggle between streets and satellite layers
  layerControl = L.control.layers(basemaps).addTo(map);

  //adds the info button to the map
  infoBtn.addTo(map);

  //checks if the user has geolocation enabled
  //if not, displays an alert
  //otherwise, it calls the getPosition function, which gets the user's location
  if(!navigator.geolocation) {
    alert("Your browser does not support geolocation");
  } else {
    navigator.geolocation.watchPosition(getPosition);
  }

  //getPosition fetches latitude, longitude and accuracy from the position object
  //and logs them to the console
  function getPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    //var accuracy = position.coords.accuracy;
    //console.log("latitude: ", lat, "longitude: ", lng, "accuracy: ", accuracy);
    //TO AMEND: set the map view to the user's location using .fitBounds()
    //currently centres the map on the user's location at a zoom level of 6
    //map.setView([lat, lng], 6);

  }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
//the function will be called when the user's location is successfully retrieved
function success(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  if (marker) {
    map.removeLayer(marker);
    map.removeLayer(circle);
  }

  marker = L.marker([lat, lng]).addTo(map);
  circle = L.circle([lat, lng], {radius: accuracy}).addTo(map);
  
  //if the map is not zoomed in, zoom in to the circle's bounds
  if (!zoomed) {
    //the map will not zoom in again when the user zooms out
    zoomed = map.fitBounds(circle.getBounds());
  }
  

}

function error(err) {
  //checking if the error code is 1, which means the user has denied access to their location
if(err.code == 1) {
  alert("You need to allow geolocation access for this to work");
  //otherwise, it is probably a technical error
} else {
    alert("Error occurred. Error code: " + err.code);
  }
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  $.ajax({
    url: "/project1/libs/php/getCountries.php",
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data.features && Array.isArray(data.features)) {
        data.features.forEach(function (feature) {
          var isoCode = feature.properties.iso_a2;
          var countryName = feature.properties.name;
  
          // Append each country as an option to the select box
          $('#countrySelect').append(
            $('<option>', { value: isoCode, text: countryName })
          );
        });
      } else {
        console.error("Invalid data format:", data);
      }
    },
    error: function () {
      alert("Error: Could not load the country data.");
    }
  });
<<<<<<< HEAD
  

<<<<<<< HEAD
})
<<<<<<< HEAD
>>>>>>> 9133713 (Adding map code to index.html page and setting up project structure)
=======
    
>>>>>>> 1175bce (Amending script.js, index.css and index.html to try and get map to work)
=======
=======
>>>>>>> d8c65b7 (Working on the select box so that it displays all the countries in the dropdown box)
});
    
>>>>>>> 84f7ae0 (Adding select function to app, 2nd attempt)
=======
$.getJSON("libs/js/countryBorders.geo.json", function(result){
  result.features.forEach(function(feature){
    $('<option>').text(feature.properties.name).appendTo('#countrySelect');
  }); 
});
=======
=======
//indefinitely watch the user's location
navigator.geolocation.watchPosition(success, error);

>>>>>>> e1239ab (Working on the user location's marker code)
  // sending async request to get the geojson data to specified URL
  $.ajax({
    url: "libs/js/countryBorders.geo.json",
    dataType: "json",
  //specifying the response type as JSON so that it's automatically parsed by jQuery
  //before the success call
  //if successful, the JSON data is retrieved from the server/ countryBorders.geo.json file
  success: function(data) {
  //taking the geoJSON data and adding it to the map
  //TO DO: filter so that you only have polygon around country in which the user is located
    const countryLayer = L.geoJSON(data).addTo(map);
    //map.fitBounds adjusts the map's view and zoom level to fit within the geographic bounds of the country borders
    countryLayer.getBounds() //ensure the map centers and zooms appropriately to show the entire country border polygons
    map.fitBounds(countryLayer.getBounds());

    //connecting select box to the list of countries in the geoJSON data
  
    //loop through the geoJSON data and create an option for each country
    $.getJSON("libs/js/countryBorders.geo.json", function(data) {
      //loop through the geoJSON data
      $.each(data.features, function(index, feature) {
        //and create an option for each country
        const option = document.createElement("option");
        //set the value of the option to the country's ISO code
        option.value = feature.properties.iso_a2;
        //set the text of the option to the country's name
        option.text = feature.properties.name;
        //add the option to the select box
        $("#countrySelect").append(option);
      });
    });

    //when the user selects a country from the dropdown, the map will zoom to the country's location
    $("#countrySelect").on("change", function() {
      //get the selected country from the dropdown
      const selectedCountry = $("#countrySelect").val();
      //find the country in the geoJSON data that matches the selected country
      const country = data.features.find(feature => feature.properties.iso_a2 === selectedCountry);
      //if a country is found, zoom to its location
      if (country) {
        //get the bounds of the country's polygon
        const bounds = L.geoJSON(country).getBounds();
        //zoom to the bounds of the country
        map.fitBounds(bounds);
      }
    });
  },
  //runs if there is an error with the AJAX request
    error: function(jqXHR, textStatus, errorThrown) {
    //logs an error message to the console
    console.log("Error loading GeoJSON data:", textStatus, errorThrown);
  }
<<<<<<< HEAD
})
>>>>>>> 1e671ea (Understanding the map code and adding polygons instead of using setView)

})

//ADD CODE THAT CONNECTS THE COUNTRIES TO THE DROPDOWN MENU
        
<<<<<<< HEAD
        // Get the area of the country
        var bounds = geoJsonLayer.getBounds();
        var area = (bounds.getNorth() - bounds.getSouth()) * (bounds.getEast() - bounds.getWest());
        
        // Adjust zoom based on country size
        let zoomLevel = 5;
        if (area < 200) {  // For smaller countries like Norway
            zoomLevel = 7;
        }
        map.fitBounds(geoJsonLayer.getBounds());
      }
    });
  });
});
>>>>>>> b9ca338 (Added countries to the dropdown select box and linked them to the relevant countries, displaying their borders)
=======
});
>>>>>>> 1e671ea (Understanding the map code and adding polygons instead of using setView)
=======
  });
});
        
});
>>>>>>> ca9ca28 (Adding select box to application)
=======
});
>>>>>>> da455e7 (Rewriting code to follow the correct method, using PHP routines rather than multiple AJAX calls)
=======

  // Load countries into select box on page load
=======
  //sends a request to getCountries.php to get a list of countries, expecting a JSON response
>>>>>>> c011914 (Amending how the information is added to the <option> tag)
  $.ajax({
    url: "libs/php/getCountries.php",
    type: "GET",
    dataType: "json",
    //if successful, it logs the response to the console
    //and constructs options for a dropdown menu (countrySelect)
    //based on the returned data
    success: function(result) {
      //console.log(result);
      if (result.status.name == "ok") {
        //loop through the data and create an option for each country
        result.data.forEach(country => {

          countryData.push({
            code: country["iso_a2"],
            name: country["name"]
          })

          //console.log(country);
          $("<option>")
          //adds the country name as text to the dropdown menu
          //and country iso code as the value
          .val(country["iso_a2"])
          .text(country["name"])
          //appends the country name and iso code to the select element/ dropdown menu
          .appendTo("#countrySelect");
        });         
      }
    },
    //if an error occurs, logs the error information to the console
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(`Error: ${textStatus} - ${errorThrown}`);
      //console.log(jqXHR.responseText);
    }
=======
>>>>>>> aa2580b (Added borders to all the countries on the map)
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

  var cityMarkers;

  // ---------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------

  // Initialise map with streets as the default layer
  //$(function () {} means run the code only after the DOM is fully loaded
  $(function () {
    map = L.map("map", {
      layers: [streets]
    });

   /* let overlays = {
      Cities:  cityMarkers,
    };*/

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
          //console.log(response);
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
    
    let cityMarkersGroup = L.layerGroup().addTo(map);
    let poiMarkersGroup = L.layerGroup().addTo(map);
    
    function addCityMarkers() {
        cityMarkersGroup.clearLayers();
    
        const countryIsoCode = $("#countrySelect").val();
        $.ajax({
            url: "libs/php/getCities.php",
            type: "GET",
            dataType: "json",
            data: { isoCode: countryIsoCode },
            success: function (response) {
                if (response.status.name === "ok" && response.data.length > 0) {
                    response.data.forEach(city => {
                        const cityMarker = L.ExtraMarkers.icon({
                            icon: "fa-solid fa-city",
                            markerColor: "black",
                            shape: "circle",
                            prefix: "fa"
                        });
    
                        L.marker([city.lat, city.lng], { icon: cityMarker })
                            .addTo(cityMarkersGroup)
                            .bindPopup(`${city.name}`);

                    });
                } else {
                    console.log("No cities found for the selected country.");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }

        });
    }
        $("#countrySelect").on("change", function () {
        addCityMarkers();
    });
  });
});
<<<<<<< HEAD
<<<<<<< HEAD

});
>>>>>>> 68b9fc1 (Amending getCountries.php and script.js so that they use the PHP routine correctly)
=======
});
>>>>>>> 3f9b70b (Amendin code to try to add borders to the countries)
=======
>>>>>>> aa2580b (Added borders to all the countries on the map)
