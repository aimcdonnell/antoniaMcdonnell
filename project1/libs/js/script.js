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

//store the leaflet map instance
var map;

// store the tile layer interface to change map layers
var layerControl;

var countryData = [];



//street map layer
var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
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

  //sends a request to getCountries.php to get a list of countries, expecting a JSON response
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
  });

  // Handle country selection change to fetch border information
  $("#countrySelect").on("change", function() {
    var selectedISOCode = $(this).val();
    //console.log(selectedISOCode);

    if (!selectedISOCode) {
      console.warn("No ISO code selected.");
      return;
    }

    // Perform AJAX request to fetch country borders
    $.ajax({
      url: 'libs/php/getCountryBorders.php', // Adjust the path as needed
      method: 'GET',
      data: { isoCode: selectedISOCode }, // Pass the ISO code as a parameter. The ISO code is taken from the dropdown menu and uses the PHP script to fetch the border data
      dataType: 'json',
            success: function(response) {
              if (response.status.name !== "ok") {
                console.error(response.status.description);
                return;
              }

              // Access the border coordinates from the response data
              const borderCoordinates = response.data[0];
              console.log("Border coordinates:", borderCoordinates);

        
              // Clear any existing map layers
              var borderLayer;
        
              if (borderLayer) {
                map.removeLayer(borderLayer);
              }


              // Create a new Leaflet GeoJSON layer for the border
              borderLayer = L.geoJSON(borderCoordinates, {
               style: {
                color: "#ff1234",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
              }
              }).addTo(map);

              //Retrieve the geographical boundaries of a map layer, view, or shape
              var bounds = borderLayer.getBounds();
              if (bounds.isValid()) {
                //map.fitBounds(bounds) automatically adjusts the map view to show the entire country's borders
                map.fitBounds(bounds);
              }
   
            }, 
            error: function(xhr, status, error) { 
              console.error("Error fetching country borders:", error);
      }
    });
  });

});
});