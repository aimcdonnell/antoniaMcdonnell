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

var map;

// tile layers
var layerControl;

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

  layerControl = L.control.layers(basemaps).addTo(map);

  infoBtn.addTo(map);





  // Load countries into select box on page load
  $.ajax({
    url: "libs/php/getCountries.php",
    type: "GET",
    dataType: "json",
    success: function(result) {
  console.log(result);
  //if the request is successful
      if (result.status.name == "ok") {
        //create an empty options variable
        let options = "";
        //for each country in the result
        result.data.forEach(country => {
          //add an option to the options variable
          options += `<option value="${country.id}">${country.name}</option>`;
        });
        //set the options variable to the select box so that it is displayed on the page
        $("#countrySelect").html(options);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {

      console.log(`Error: ${textStatus} - ${errorThrown}`);
    }

  });

  // Handle select change event
  $("#countrySelect").on("change", function() {
    const selectedCountryId = $(this).val();
  });
});

});