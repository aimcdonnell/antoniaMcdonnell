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
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
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

  // sending async request to get the geojson data to specified URL
$.ajax({
  url: "libs/js/countryBorders.geo.json",
  dataType: "json",
  //specifying the response type as JSON so that it's automatically parsed by jQuery
  //before the success call
  //if successful, the JSON data is retrieved from the server/ countryBorders.geo.json file
  success: function(data) {
  //taking the geoJSON data and adding it to the map
  const countryLayer = L.geoJSON(data).addTo(map);
  //map.fitBounds adjusts the map's view and zoom level to fit within the geographic bounds of the country borders
  //countryLayer.getBounds() ensure the map centers and zooms appropriately to show the entire country border polygons
  map.fitBounds(countryLayer.getBounds());
  },
  //runs if there is an error with the AJAX request
  error: function(jqXHR, textStatus, errorThrown) {
    //logs an error message to the console
    console.log("Error loading GeoJSON data:", textStatus, errorThrown);
  }
})

})

//ADD CODE THAT CONNECTS THE COUNTRIES TO THE DROPDOWN MENU
        
});
