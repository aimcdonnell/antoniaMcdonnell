// Preloader handling
$(window).on('load', function () {
  if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
      $(this).remove();
    });
  }
  // ---------------------------------------------------------
// GLOBAL DECLARATIONS
// ---------------------------------------------------------

var map;

// tile layers

var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

// buttons

var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#exampleModal").modal("show");
});

// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

$(function () {
  // initialise map with the street layer
  map = L.map("map", {
    layers: [streets]
  });
  
// create a layer control which makes it easier to switch between the layers/ different maps
//these different layers are defined in the basemaps variable above
L.control.layers(basemaps).addTo(map);

//adding an info button to the map
infoBtn.addTo(map);

//indefinitely watch the user's location
navigator.geolocation.watchPosition(success, error);

//create variables in the global scope
let marker, circle, zoomed;


//the function will be called when the user's location is successfully retrieved
function success(position) {
  //get the latitude and longitude of the user's location
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  
//ensuring that we don't have multiple markers and circles on the map if the user moves around
//if there is already a marker and circle on the map, remove them
if (marker) {
    map.removeLayer(marker);
    map.removeLayer(circle);
  }
  //else, create a marker and a circle to show the user's location
  marker = L.marker([lat, lng]).addTo(map);
  circle = L.circle([lat, lng], {radius: accuracy}).addTo(map);
  
  //1st time the function runs, no value is assigned to zoomed
  //once the function is run, a value is assigned to zoomed so it won't zoom in again
  //if the map is not zoomed in
  if(!zoomed) {
  //set the map to the bounds of the circle
  //and save this as the zoomed variable
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
  });
});
        
});