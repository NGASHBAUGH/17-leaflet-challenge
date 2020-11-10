var qUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
let map
// gets url to grab data
d3.json(qUrl , function(data) {
    // configure data
    create(data.features)
});


function create(earthquakeData) {
    // console.log(earthquakeData.length)
    var len = earthquakeData.length
    var heatUP = [];
    for (var i = 0 ; i < len ; i ++){
        var location = earthquakeData[i].geometry.coordinates
        var latLng = new google.maps.LatLng(location[1], location[0])
        heatUP.push(latLng)
    }
    console.log(heatUP)

    function eachFeature (feature , layer ){
        layer.bindPopup("<h3>" + feature.propertes.place + 
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    };
    var earthquakes = L.geoJSON(earthquakeData , {
        eachFeature : eachFeature
    });

    generateMap(earthquakes);
};

function generateMap(earthquakes, heatUP) {
    console.log(earthquakes , heatUP)
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [37.7749, -122.4194],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });
  L.heatLayer(heatUP, {
    radius : 25,
    blur : 35
    }).addTo(myMap)
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
