$(window).on('load', function () {
  if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
      $(this).remove();
    })
  }
});
    

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

// initialise and add controls once DOM is ready

$(function () {
  
  map = L.map("map", {
    layers: [streets]
  }).locate({setView: true, maxZoom: 5});
  
  // setView is not required in your application as you will be
  // deploying map.fitBounds() on the country border polygon

  L.control.layers(basemaps).addTo(map);
  infoBtn.addTo(map);

$.getJSON("libs/js/countryBorders.geo.json", function(result){
  result.features.forEach(function(feature){
    $('<option>').text(feature.properties.name).appendTo('#countrySelect');
  }); 
});

});

$('#countrySelect').on('change', function() {
  var country = $('#countrySelect').val();
  $.getJSON("libs/js/countryBorders.geo.json", function(result){
    result.features.forEach(function(feature){
      if (feature.properties.name == country) {
        var geoJsonLayer = L.geoJSON(feature);
        
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