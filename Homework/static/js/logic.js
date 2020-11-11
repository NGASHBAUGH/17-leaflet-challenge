// Url to grab
var qUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
let map

// Loads steet map map 
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});
// Creates map for layers to be placed on. 
var myMap = L.map("mapid", {
  center: [37.7749, -122.4194],
  zoom: 5
  // layers: [darkmap, earthquakes]
});
// Add the steet map to the map as a layer
streetmap.addTo(myMap)

// gets url to grab data
d3.json(qUrl , function(data) {
    // configure data
    create(data.features)
});

// function to add layers 
function create(earthquakeData) {
  // Use array to hold depth values to find max and mininum depths
  var maximum = [];
  for(var i = 0 ; i < earthquakeData.length ; i ++) {
    maximum.push(earthquakeData[i].geometry.coordinates[2])
  }
  // Create pop up when the user places mouse over the bubbles 
    function eachFeature (feature , layer ){
        layer.bindPopup("<h3>" + feature.properties.place + 
            "</h3><hr><p>" + new Date(feature.properties.time) +"<br> Magnatude: " 
            + feature.properties.mag + "<br>Depth of the Earthquake: " + feature.geometry.coordinates[2] +"</p>");
    };
    // bubbles indicating where the earthquakes happened 
    function markerz (feature){
       return {
         radius : feature.properties.mag *4, 
         fillColor : getColor(feature.geometry.coordinates[2]),
         weight: 2, 
         opacity: 1,
         color : 'black', 
         dashArray : "3",
         fillOpacity : 0.7
       }
    }
    // Creation of the circle markers 
    function pTL (feature , latlng) {
      return L.circleMarker(latlng)
    }; 
    // adding styles, pop ups, and circle markers as layers on map
    L.geoJSON(earthquakeData , {
        onEachFeature : eachFeature,
        pointToLayer: pTL,
        style: markerz,
    }).addTo(myMap)
    // Create color scale for the deeper the depth of the earthquake the more red 
    function getColor (d) {
      var mapScale = chroma.scale(['lightgreen', 'red']).domain([Math.min(...maximum), Math.max(...maximum)]  )
      return mapScale(d)
    } 
    // Create a color scale legend for the earthquake depth
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
      // Depths are based off of the mins and maxs 
    var div = L.DomUtil.create('div', 'info legend'),
        grades = 
        [Math.round(Math.min(...maximum),2), 
          Math.round(Math.max(...maximum)-(5*(Math.max(...maximum)/5)),2), 
          Math.round(Math.max(...maximum)-(4*(Math.max(...maximum)/5)),2), 
          Math.round(Math.max(...maximum)-(3*(Math.max(...maximum)/5)),2), 
          Math.round(Math.max(...maximum)-(2*(Math.max(...maximum)/5)),2), 
          Math.round(Math.max(...maximum)-(1*(Math.max(...maximum)/5)),2), 
          Math.round(Math.max(...maximum),2)],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
// Add color scale legend 
legend.addTo(myMap);

        var info = L.control(); 
        info.onAdd = function(map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
        }
        info.update = function(props) {
          this._div.innerHTML = '<h4>Magnatudes and Depths Density</h4>' 
        }
        info.addTo(myMap)
};
