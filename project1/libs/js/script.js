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
  }).setView([54.5, -4], 6);
  
  // setView is not required in your application as you will be
  // deploying map.fitBounds() on the country border polygon

  L.control.layers(basemaps).addTo(map);
  infoBtn.addTo(map);

    // Fetch country data and populate the select box
    $.getJSON("/libs/php/getCountries.php", function (data) {
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
    }).fail(function () {
      alert("Error: Could not load the country data.");
    });

})
    