// Preloader handling
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1500)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }

  // ---------------------------------------------------------
  // GLOBAL DECLARATIONS
  // ---------------------------------------------------------

  // Store the leaflet map instance
  var map;

  // Street map layer
  var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    }
  );

  // Satellite map layer
  var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );

  // Layers are stored in basemaps variable to facilitate easy switching
  var basemaps = {
    Streets: streets,
    Satellite: satellite,
  };

  // Store the tile layer interface to change map layers
  var layerControl;

  var cityMarkersGroup = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });

  var poiMarkersGroup = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });

  var overlays = {
    "Points of Interest": poiMarkersGroup,
    Cities: cityMarkersGroup,
  };

  var buildingIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-building",
    markerColor: "red",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var attractionIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-star",
    markerColor: "blue",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });

  var tourismIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-camera",
    markerColor: "purple",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var natureIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-tree",
    markerColor: "green",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var amenityIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-shop",
    markerColor: "orange",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var shopIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-store",
    markerColor: "orange-dark",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var highwayIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-road",
    markerColor: "blue",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var restaurantIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-utensils",
    markerColor: "white",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var leisureIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-umbrella-beach",
    markerColor: "pink",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var transportIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-bus",
    markerColor: "purple",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var educationIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-graduation-cap",
    markerColor: "green-light",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var healthcareIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-briefcase-medical",
    markerColor: "red",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var railwayIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-train",
    markerColor: "blue",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var manMadeIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-industry",
    markerColor: "white",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });

  var officeIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-building",
    markerColor: "blue",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var placesOfWorshipIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-church",
    markerColor: "pink",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var powerFacilitiesIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-plug",
    markerColor: "yellow",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });
  var otherIcon = L.ExtraMarkers.icon({
    icon: "fa-solid fa-map-marker",
    markerColor: "green-dark",
    shape: "circle",
    prefix: "fa",
    iconColor: "white",
    extraClasses: "fa-2x",
  });

  var countryData = [];

  // ---------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------

  // Initialise map with streets as the default layer
  //$(function () {} means run the code only after the DOM is fully loaded
  $(function () {


    map = L.map("map", {
      layers: [streets],
    });

    cityMarkersGroup.addTo(map);
    poiMarkersGroup.addTo(map);

  

  layerControl = L.control.layers(basemaps, overlays).addTo(map);

    // Add a layer group for the border
    let borderLayer = L.layerGroup().addTo(map);

    // AJAX request to get countries
    $.ajax({
      url: "libs/php/getCountries.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          result.data.forEach((country) => {
            countryData.push({
              code: country["iso_a2"],
              name: country["name"],
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
        showToast("Failed to append country names to the dropdown", 4000, false);
      },
    });
    // Info button to open the info modal
    var infoBtn = L.easyButton(
      '<i class="fa-solid fa-info fa-xl modalBtn infoBtn"></i>',
      function (btn, map) {
        var selectedISOCode = $("#countrySelect").val();

        if (!selectedISOCode) {
          showToast("No ISO code selected for the country info modal", 4000, false);
        }
        //AMEND TO INCORPORATE PHP
        //Handles the information button window data
        $.ajax({
          url: "libs/php/getCountryInformation.php",
          type: "POST",
          dataType: "json",
          //retrieving the iso code value from the countrySelect dropdown
          data: { isoCode: selectedISOCode },
          success: function (result) {
            //checking the response format
            //adding the data to the modal
            if (result.status.name === "ok") {
              $("#country-name").html(result.data.name.common);
              $("#country-capital").html(result.data.capital[0]);
              $("#country-flag").html(
                `<img src="${result.data.flags.svg}" class="img-thumbnail" alt="flag">`
              );
              $("#country-population").html(
                result.data.population.toLocaleString()
              );
              $("#country-languages").html(
                Object.values(result.data.languages).join(", ")
              );

              // Display the modal when the data is loaded
              $("#country-info-modal").modal("show");
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            showToast("Error fetching country information", 4000, false);
          },
        });
      }
    );

    // Add the info button to the map
    infoBtn.addTo(map);

    // Check if the user has geolocation enabled
    if (!navigator.geolocation) {
      showToast("Your browser does not support geolocation.", 4000, false);
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
          lng: lng,
        },
        success: function (response) {
          //decodes the response from the php script
          //const result = JSON.parse(response);
          if (response.data && response.data.length > 0) {
            const userCountry = response.data[0].components["ISO_3166-1_alpha-2"];
            //trigger the change event to select the user's country location
            $("#countrySelect").val(userCountry).trigger("change");
          } else {
            showToast("No geocode data found for the user's given location.", 4000, false);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          showToast("Reverse geocoding failed", 4000, false);
        },
      });
    }

    // Handles dropdown country selection changes
    $("#countrySelect").on("change", function () {
      // Get the selected country's ISO code
      var selectedISOCode = $(this).val();

      if (!selectedISOCode) {
        showToast("No ISO code selected to get the country borders", 4000, false);
        return;
      }

      // AJAX request to get country border data
      $.ajax({
        url: "libs/php/getCountryBorders.php",
        type: "GET",
        //send the ISO code from the dropdown to the php script
        data: { isoCode: selectedISOCode },
        dataType: "json",
        success: function (response) {
          if (borderLayer) {
            borderLayer.clearLayers();
          }

          const borderCoordinates = response.data; // Access the coordinates
          // Determine whether the structure is MultiPolygon or Polygon
          const isMultiPolygon =
            Array.isArray(borderCoordinates[0][0]) &&
            Array.isArray(borderCoordinates[0][0][0]);
          const geoJsonData = {
            type: "Feature",
            geometry: {
              type: isMultiPolygon ? "MultiPolygon" : "Polygon",
              coordinates: borderCoordinates,
            },
            properties: {},
          };

          try {
            // Log the structure of geoJsonData to check format

            let geoJsonLayer = L.geoJSON(geoJsonData, {
              style: {
                color: "#ff1234",
                weight: 3,
                opacity: 1,
                fillColor: "#ff1234",
                fillOpacity: 0.2,
              },
            }).addTo(borderLayer); // Add to the borderLayer

            // Fit bounds of the map to the geoJSON layer
            let bounds = geoJsonLayer.getBounds();
            map.fitBounds(bounds);
          } catch (error) {
            showToast("Error fetching country border layer", 4000, false);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          showToast("Error fetching country border data:", 4000, false);
        },
      });
    });

    var weatherBtn = L.easyButton(
      '<i class="fa-solid fa-umbrella fa-xl modalBtn weatherBtn"></i>',
      function (btn, map) {
        // 1st AJAX request to geocode to get latitude and longitude values
        var chosenIsoCode = $("#countrySelect").val();
        var chosenCountry = $("#countrySelect option:selected").text();
        if (!chosenIsoCode) {
          showToast("No ISO code selected for the weather modal", 4000, false);
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
              const capitalName = response.data.capital[0];
              $.ajax({
                url: "libs/php/getGeocodeData.php",
                type: "GET",
                data: { capital: capitalName }, 
                success: function (geocodeResponse) {
                  if (geocodeResponse.status.name === "ok") {
                    const lat = geocodeResponse.data[0].geometry.lat;
                    const lng = geocodeResponse.data[0].geometry.lng;
                    //pass the capital city lat and lng values from openCage data to the openWeather API
                    $.ajax({
                      url: "libs/php/getDailyWeatherData.php",
                      type: "GET",
                      dataType: "json",
                      data: {
                        lat: lat,
                        lng: lng,
                      },
                      success: function (weatherResult) {
                        if (weatherResult.status.name === "ok") {
                          // Display current weather for capital city
                          $("#weather-modal-title").html(`${capitalName}, ${chosenCountry}`);
                          // Loop through 5 day forecast
                        // Group forecast data by date
                      const dailyForecasts = {};
                      weatherResult.data.list.forEach((entry) => {
                        const date = new Date(entry.dt_txt).toISOString().split("T")[0];
                        if (!dailyForecasts[date]) {
                          dailyForecasts[date] = [];
                        }
                        dailyForecasts[date].push(entry);
            });

            // Get today's date and calculate dates for tomorrow and the day after
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const dayAfterTomorrow = new Date(today);
            dayAfterTomorrow.setDate(today.getDate() + 2);

            //Take a date object as input and format it into a string in the YYYY-MM-DD format
            //Split the ISO string at character T (1st part (0) is the date portion and the 2nd part (1) is the time portion)
            //extracting DD-MM-YYYY
            const formatDate = (date) => date.toISOString().split("T")[0];

            const todayData = dailyForecasts[formatDate(today)];
            const tomorrowData = dailyForecasts[formatDate(tomorrow)];
            const dayAfterData = dailyForecasts[formatDate(dayAfterTomorrow)];

            // Function to calculate min, max temperatures and description
            const processForecastData = (forecastData) => {
              if (!forecastData) return null;
              const minTemp = Math.min(...forecastData.map((entry) => entry.main.temp_min));
              const maxTemp = Math.max(...forecastData.map((entry) => entry.main.temp_max));
              const description = forecastData[0].weather[0].description; // Using the first entry's description
              const icon = forecastData[0].weather[0].icon; // Using the first entry's icon
              return { minTemp, maxTemp, description, icon };
            };

            // Process data for today
            const todayForecast = processForecastData(todayData);
            if (todayForecast) {
              $("#day0Date").text(
                `${today.toLocaleString("en-GB", { weekday: "short" })} ${getOrdinal(
                  today.getDate()
                )} ${today.toLocaleString("en-GB", { month: "short" })}`
              );
              $("#weather-temp-min-0").text(`${numeral(todayForecast.minTemp).format('0')}°C`);
              $("#weather-temp-max-0").text(`${numeral(todayForecast.maxTemp).format('0')}°C`);
              $("#weather-description-0").text(todayForecast.description);
              $("#weather-icon-0").attr(
                "src",
                `https://openweathermap.org/img/w/${todayForecast.icon}.png`
              );
            }

            // Process data for tomorrow
            const tomorrowForecast = processForecastData(tomorrowData);
            if (tomorrowForecast) {
              $("#day1Date").text(
                `${tomorrow.toLocaleString("en-GB", { weekday: "short" })} ${getOrdinal(
                  tomorrow.getDate()
                )} ${tomorrow.toLocaleString("en-GB", { month: "short" })}`
              );
              $("#weather-temp-min-1").text(`${numeral(tomorrowForecast.minTemp).format('0')}°C`);
              $("#weather-temp-max-1").text(`${numeral(tomorrowForecast.maxTemp).format('0')}°C`);
              $("#weather-icon-1").attr(
                "src",
                `https://openweathermap.org/img/w/${tomorrowForecast.icon}.png`
              );
            }

            // Process data for the day after tomorrow
            const dayAfterForecast = processForecastData(dayAfterData);
            if (dayAfterForecast) {
              $("#day2Date").text(
                `${dayAfterTomorrow.toLocaleString("en-GB", { weekday: "short" })} ${getOrdinal(
                  dayAfterTomorrow.getDate()
                )} ${dayAfterTomorrow.toLocaleString("en-GB", { month: "short" })}`
              );
              $("#weather-temp-min-2").text(`${numeral(dayAfterForecast.minTemp).format('0')}°C`);
              $("#weather-temp-max-2").text(`${numeral(dayAfterForecast.maxTemp).format('0')}°C`);
              $("#weather-icon-2").attr(
                "src",
                `https://openweathermap.org/img/w/${dayAfterForecast.icon}.png`
              );
            }
                    //Show the weather modal
                    $("#weather-info-modal").modal("show");
                  }
                  //Handling errors
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  showToast("Error fetching weather data", 4000, false);
                },
              });
                  }
                }, 
                error: function (jqXHR, textStatus, errorThrown) {
                  showToast("Error fetching geocode data for weather modal", 4000, false);
                }           
              })
              // Function to get the ordinal suffix
              function getOrdinal(num) {
                const suffixes = ["th", "st", "nd", "rd"];
                const mod = num % 100;
                return num + (suffixes[(mod - 20) % 10] || suffixes[mod] || suffixes[0]);
              }
            }
          },
        });
      }
    );
    weatherBtn.addTo(map);

    var currencyBtn = L.easyButton(
      '<i class="fa-solid fa-dollar-sign fa-xl modalBtn currencyBtn"></i>',
      function (btn, map) {
        // AJAX request to get country information
        $("#currency-modal-rates").empty();
        $("#currency-modal-code").empty();
        $("#currency-input").empty();
        var currencyISOCode = $("#countrySelect").val();

        //if no ISO code selected, return
        if (!currencyISOCode) {
          showToast("No iso code selected for the currency modal", 4000, false);
          return;
        }

        $.ajax({
          url: "libs/php/getCountryInformation.php",
          type: "GET",
          dataType: "json",
          data: { isoCode: currencyISOCode },
          success: function (response) {
            if (response.status.name === "ok") {
              var currencies = response.data.currencies;
              var currencyCode = Object.keys(currencies)[0];
              console.log(currencyCode);
              var currencyNames = currencies[currencyCode].name;
              console.log(currencyNames);
              // AJAX request to get currency exchange rates
              $.ajax({
                url: "libs/php/getCurrencyData.php",
                type: "GET",
                dataType: "json",
                data: { currency: currencyCode },
                success: function (currencyResult) {
                  if (currencyResult.status.name === "ok") {
                    //loop through exchange rates, compare them to the currencyCode, and add them to the modal

                    const exchangeRates = currencyResult.data.rates;
                    
                    $("#exchangeRate").empty();

                    for (const [code, rate] of Object.entries(exchangeRates)) {
                      $("#exchangeRate").append(
                        `<option value="${rate}">${currencyNames}</option>`
                      )
                    }
                    function calcResult() {
   
                    $("#toAmount").val(numeral($("#fromAmount").val() * $("#exchangeRate").val()).format("0,0.00"));
                      
                    }
                    
                    $("#fromAmount").on("keyup", function () {
                    
                      calcResult();
                    
                    })
                    
                    $("#fromAmount").on("change", function () {
                    
                      calcResult();
                    
                    })
                    
                    $("#exchangeRate").on("change", function () {
                    
                      calcResult();
                    
                    })
                    
                    $("#currency-modal").on("show.bs.modal", function () {
                    
                      calcResult();
                    
                    })
                    
                    $("#currency-modal").on("hidden.bs.modal", function () {
                    
                      $("#fromAmount").val(1);
                    
                    })
                    $("#currency-modal").modal("show");
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  showToast("Error fetching currency data", 4000, false);
                },
              });
            }
          },
        });
      }
    );
    currencyBtn.addTo(map);

    var newsBtn = L.easyButton(
      '<i class="fa-solid fa-newspaper fa-xl modalBtn newsBtn"></i>',
      function (btn, map) {
        // Clear the modal body before appending new stories
        $("#news-modal-body").empty();
        var newsISOCode = $("#countrySelect").val();
        if (!newsISOCode) {
          showToast("No iso code selected for the news modal", 4000, false);
          return;
        }

          // AJAX request to get news articles
          $.ajax({
            url: "libs/php/getNewsData.php",
            type: "GET",
            dataType: "json",
            data: { isoCode: newsISOCode }, // You might need to pass the page number if the API supports pagination
            success: function (response) { 
    
              if (response.status.name === "ok" && response.data.results.length > 0) {
                // Process the news articles
                Object.entries(response.data.results).forEach(([key, value]) => {
                    // Append the article
                    $("#news-modal-body").append(`
                      <tr>
                        <td rowspan="2" width="50%" class="news-icon-container">
                          <i class="fa-solid fa-newspaper img-fluid news-icon"></i> 
                        </td>
                        <td>
                          <a href="${value.link}" class="fw-bold fs-6 text-black" target="_blank">${value.title}</a>
                        </td>
                      </tr>
                      <tr class="bottom-table-border">
                        <td class="align-bottom pb-0">
                          <p class="fw-light fs-6 mb-2">${value.source_name}</p>
                        </td>
                      </tr>
                    `);

                  $("#news-modal").modal("show");
                });
              } else {
                $("#news-modal-body").append(`
                  <tr>
                    <td colspan="2">No news available from the selected country</td>
                  </tr>
                `);
                $("#news-modal").modal("show");
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              showToast("Error fetching news articles", 4000, false);
            },
          });
      }
    );
    newsBtn.addTo(map);    
    

    var wikipediaBtn = L.easyButton(
      '<i class="fa-brands fa-wikipedia-w fa-xl modalBtn wikipediaBtn"></i>',
      function (btn, map) {
        $("#wikipedia-modal-body").empty();
        var wikipediaCountryName = $("#countrySelect option:selected").text();
        var wikipediaISOCode = $("#countrySelect").val();

        $.ajax({
          url: "libs/php/getWikipediaData.php",
          type: "GET",
          dataType: "json",
          data: {
            country: wikipediaCountryName,
            isoCode: wikipediaISOCode,
          },
          success: function (response) {
            if (response.status.name === "ok" && response.data.length > 0) {
              response.data.forEach(function (article) {
                $("#wikipedia-modal-body").append(`
                  <tr>
                    <td colspan="3">
                      <div class="wikipedia-article-container">
                        <span class="fw-bold">${article.title}</span>
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
          },
          error: function (jqXHR, textStatus, errorThrown) {
            showToast("Error fetching Wikipedia data", 4000, false);
          },
        });
      }
    );
    wikipediaBtn.addTo(map);

   var energyBtn = L.easyButton(
      '<i class="fa-solid fa-bolt fa-xl modalBtn energyBtn"></i>',
      function (btn, map) {
        // 1st AJAX request to geocode to get latitude and longitude values
        var energyIsoCode = $("#countrySelect").val();
        if (!energyIsoCode) {
          showToast("No ISO code selected for the energy modal", 4000, false);
          return;
        }

        $.ajax({
          url: "libs/php/getRenewableEnergyData.php",
          type: "GET",
          dataType: "json",
          data: {
            isoCode: energyIsoCode,
          },
          success: function (response) {
            if (response.status.name === "ok") {
              $("#renewable-energy-country").html(response.data.country);
              $("#renewable-energy-generation").html(
                response.data.generation_GWh + " GWh"
              );
              $("#renewable-energy-percentage").html(
                response.data.renewable_percentage + "%"
              );
              $("#renewable-hydro-percentage").html(response.data.hydro + "%");
              $("#renewable-wind-percentage").html(response.data.wind + "%");
              $("#renewable-solar-percentage").html(response.data.solar + "%");
              $("#renewable-biomass-percentage").html(
                response.data.bioenergy + "%"
              );
              $("#renewable-geothermal-percentage").html(
                response.data.geothermal + "%"
              );
              $("#renewable-energy-modal").modal("show");
            } else {
              $("#modal-body").append(`
              <tr>
                <td colspan="2">No renewable energy data available for the selected country</td>
              </tr>
            `);
              $("#renewable-energy-modal").modal("show");
            }
          },
        });
      }
    );
    energyBtn.addTo(map);

    var naturalDisasterBtn = L.easyButton(
      '<i class="fa-solid fa-triangle-exclamation fa-xl modalBtn naturalDisasterBtn"></i>',
      function (btn, map) {
        $("#natural-disaster-modal-body").empty();
        var naturalDisasterCountry = $("#countrySelect option:selected").text();
        if (!naturalDisasterCountry) {
          showToast("No country selected for the natural disaster modal", 4000, false);
          return;
        }

        $.ajax({
          url: "libs/php/getNaturalDisasterData.php",
          type: "GET",
          dataType: "json",
          data: {
            country: naturalDisasterCountry,
          },
          success: function (response) {
            if (response.status.name === "ok" && response.data.length > 0) {
              response.data.forEach(function (event) {
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
                  const month = date.toLocaleString("default", {
                    month: "long",
                  });
                  const year = date.getFullYear();
                  return `${month} ${year}`;
                }

                var countryName = getCountryName(
                  naturalDisasterCountry,
                  event.fields.country
                );
                $("#natural-disaster-modal-body").append(`
                <tr>
                  <td>
                    <div style="display: flex; flex-direction: column;">
                      <span><strong>Country:</strong> ${countryName}</span>
                      <span><strong>Natural Disaster:</strong> ${
                        event.fields.type[0].name
                      }</span>
                      <span><strong>Date:</strong> ${formatDate(
                        event.fields.date.created
                      )}</span>
                      <span><strong>Status:</strong> ${capitalizeFirstLetter(
                        event.fields.status
                      )}</span>
                      <span><a href="${
                        event.fields.url
                      }" target="_blank">Learn more</a></span>
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
          },
          error: function (jqXHR, textStatus, errorThrown) {
            showToast("Error fetching natural disaster data", 4000, false);
          },
        });
      }
    );

    naturalDisasterBtn.addTo(map);

    let countryPoisAvailable = false;

    function fetchNearbyPOIs(lat, lng) {
      poiMarkersGroup.clearLayers();
      $.ajax({
        url: "libs/php/getNearbyPointsOfInterest.php",
        type: "GET",
        dataType: "json",
        data: { lat, lng },
        success: function (response) {
          countryPoisAvailable = false; // Reset the flag before checking POIs
        
          // Check if the response is valid and contains POIs
          if (
            response &&
            response.status &&
            response.status.name === "ok" &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            countryPoisAvailable = true; // Set the flag if POIs are found
            const poiTypes = {
              building: buildingIcon,
              attraction: attractionIcon,
              tourism: tourismIcon,
              natural: natureIcon,
              amenity: amenityIcon,
              shop: shopIcon,
              highway: highwayIcon,
              food: restaurantIcon,
              leisure: leisureIcon,
              transport: transportIcon,
              education: educationIcon,
              healthcare: healthcareIcon,
              railway: railwayIcon,
              man_made: manMadeIcon,
              office: officeIcon,
              place_of_worship: placesOfWorshipIcon,
              power: powerFacilitiesIcon,
            };
            
            // Loop through the POIs and add them to the map
            response.data.forEach((poi) => {
              const icon = poiTypes[poi.typeClass] || otherIcon; // Default to `otherIcon` if no match is found
              L.marker([poi.lat, poi.lng], { icon })
                .addTo(poiMarkersGroup)
                .bindPopup(`${poi.name || "Unnamed " + poi.typeClass + " marker"}`);
            });
          } else {
            // If no POIs are found, don't show error and keep the flag false
            countryPoisAvailable = false;
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // Only show an error if the request itself failed, not for missing POIs
          if (!countryPoisAvailable) {
            showToast("Error fetching POIs", 4000, false);
          }
        },
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
          if (response.status.name === "ok" && response.data.length > 0) {
            response.data.forEach((city) => {
              const cityMarker = L.ExtraMarkers.icon({
                icon: "fa-solid fa-city",
                markerColor: "black",
                shape: "circle",
                prefix: "fa",
              });
              if (cityMarker) {
                L.marker([city.lat, city.lng], { icon: cityMarker })
                  .addTo(cityMarkersGroup)
                  .bindPopup(`${city.name}`);
                fetchNearbyPOIs(city.lat, city.lng);
              }
            });
          } else {
            showToast("No cities found for the selected country", 4000, false);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          showToast("Error fetching cities", 4000, false);
        },
      });
    }
    $("#countrySelect").on("change", function () {
      addCityMarkers();
    });
  });

  function showToast(message, duration, close) {
  
    Toastify({
      text: message,
      duration: duration,
      newWindow: true,
      close: close,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ffff"
      },
      className: "toastify-center",
      onClick: function () {} // Callback after click
    }).showToast();
    
  }
});
