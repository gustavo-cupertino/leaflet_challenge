// Store the api endpoint as an object

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Perform a GET request to the url

d3.json(url).then(function (data) {

    createFeatures(data.features);

// Create a function to run once for each feature in the array; bind a popup with earthquake info to each feature

function createFeatures (earthquakeData) {

    function onEachFeature (feature, layer) {

        layer.bindPopup (`<h3> Location: ${feature.properties.place}</h3><hr><p><h2>Magnitude: ${feature.properties.mag} , Depth: ${feature.geometry.coordinates[2]}</h2></p> `);
}

// Create a function that will run once for each feature in the features array.

function createCircleMarker (feature, latlng) {

    let options = {
        radius: feature.properties.mag * 5000,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: 'black',
        weight: 0.5,
        opacity: 0.8,
        fillOpacity: 0.8
    }
    return L.circle(latlng, options);
}

function chooseColor (depth) {
    if (depth <= 10) return '#33FF99';
    else if (depth > 10 && depth <= 30) return '#33FF33';
    else if (depth > 30 && depth <= 50) return '#99FF33';
    else if (depth > 50 && depth <= 70) return '#FFFF33';
    else if (depth > 70 && depth <= 90) return '#FF9933';
    else return '#FF3333';
}

// Create a GeoJSON layer that contains the features array on the earthquakeData object.

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
});

// Send earthquakes layer to the createMap function

createMap (earthquakes);

}

function createMap (earthquakes) {

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      })

// Create a basemap object

var basemap = {
    'Street Map': street,
    'Topographic Map': topo
};
  
// Create an overlay object

var overlay = {
    Earthquakes: earthquakes
};

// Create a map object

var map = L.map('map', {
    center: [0, 0],
    zoom: 3,
    layers: [street, earthquakes]
});

// Create a layer control and add it to the map

L.control.layers(basemap, overlay, {
    collapsed: false
}).addTo(map);


// Set up the legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [-10, 10, 30, 50, 70, 90];
    var labels = ['#33FF99', '#33FF33', '#99FF33', '#FFFF33','#FF9933','#FF3333'];
    var legendInfo = "<h4>Earthquake Depth</h4>";

    div.innerHTML = legendInfo

    // go through each magnitude item to label and color the legend
    // push to labels array as list item

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=('<i style="background:' + (labels[i]) + '"></i>' + grades[i] +
           (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') );
        }
    
    return div;
};


// Adding the legend to the map

  legend.addTo(map);

}


});


