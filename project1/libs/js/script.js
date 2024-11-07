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

  // Info button to open a modal
  var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
    $("#country-info-modal").modal("show");
  });

  var cloudBtn = L.easyButton("fa-cloud fa-xl", function (btn, map) {
    $("#").modal("show");
  });

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
  //$(function () { means
  $(function () {
    map = L.map("map", {
      layers: [streets]
    });

    // Add a layer group for the border
    let borderLayer = L.layerGroup().addTo(map);

    // Add the layer control to the map
    layerControl = L.control.layers(basemaps).addTo(map);

    // Add the buttons to the map
    infoBtn.addTo(map);
    cloudBtn.addTo(map);
    currencyBtn.addTo(map);
    wikipediaBtn.addTo(map);
    newspaperBtn.addTo(map);
    

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
          }
        },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(`Error: ${textStatus} - ${errorThrown}`);
      }
    });

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
        const result = JSON.parse(response);
        //console.log(JSON.stringify(result.data[0].components["ISO_3166-1_alpha-2"]));
        if (result.data && result.data.length > 0) {
          //console.log("Response results:", response)
          const userCountry = result.data[0].components["ISO_3166-1_alpha-2"];
          //console.log(`User country: ${userCountry}`);

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
      var selectedISOCode = $(this).val();

      if (!selectedISOCode) {
        console.warn("No ISO code selected.");
        return;
      }

      // AJAX request to get country border data
      $.ajax({
        url: "libs/php/getCountryBorders.php",
        method: "GET",
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
  });
});
