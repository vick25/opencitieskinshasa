/* global mapboxgl */

mapboxgl.accessToken = 'pk.eyJ1IjoidmljazI1IiwiYSI6ImNqa3d6NWpxczAzN2IzcHF4eHlwZzNmcjYifQ.XNOgFms-v3P60RerHVIeUQ';

var marker = null;
var coordinates = document.getElementById('coordinates');
//console.log(window.innerHeight);
var data_url = 'https://raw.githubusercontent.com/vick25/opencitieskinshasa/master/data/';

//active communes
var activeNomAdministrative = 'matete';
var nomsAdministratives = {
    'matete': {
        bearing: 27,
        center: [15.3466022, -4.3911944],
        zoom: 19,
        pitch: 20
    },
    'kisenso': {
        bearing: 90,
        center: [15.3410782, -4.4038238],
        zoom: 19,
        speed: 0.6,
        pitch: 40
    },
    'amba': {
        duration: 6000,
        center: [15.3371622, -4.4203534],
        bearing: 150,
        zoom: 19,
        pitch: 0
    },
    'bikanga': {
        bearing: 90,
        center: [15.35428, -4.4135742],
        zoom: 19
    },
    'dingi': {
        bearing: 45,
        center: [15.3573317, -4.400854],
        zoom: 19,
        pitch: 20,
        speed: 0.5
    },
    'mai': {
        bearing: 180,
        center: [15.3374049, -4.4103744],
        zoom: 19,
        pitch: 20
    },
    'kabila': {
        bearing: 90,
        center: [15.3541017, -4.4313444],
        zoom: 19,
        pitch: 40
    },
    'kisenso-gare': {
        bearing: 180,
        center: [15.3548607, -4.4214432],
        zoom: 19
    },
    'nsola': {
        bearing: 90,
        center: [15.3579412, -4.4103444],
        zoom: 19,
        pitch: 40
    },
    'regideso': {
        bearing: 90,
        center: [15.3424779, -4.4027623],
        zoom: 19,
        pitch: 40
    },
    'revolution': {
        bearing: 90,
        center: [15.3454234, -4.3997281],
        zoom: 19,
        pitch: 40
    }
};

// Set bounds to Kinshasa
var bounds = [
    [14.758758544921875, -4.867942700387028], // Southwest coordinates
    [15.83404541015625, -3.99989036105956]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/vick25/cjo4ezhkr654r2rqn6h0voiro', //?fresh=true stylesheet location
    center: [15.353908538818358, -4.407857960216308], // starting position [lng, lat]
    zoom: 11.5, // starting zoom
//    bearing: 15,
//    pitch: 15,
    maxBounds: bounds // Sets bounds as max
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// View a fullscreen map
map.addControl(new mapboxgl.FullscreenControl());

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

map.on('mousemove', function (e) {
    var lngLat = e.lngLat;
    coordinates.style.display = 'block';
    coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
});

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
//    console.log(bounds);
    return (bounds.top - 20) < window.innerHeight && bounds.bottom > 0;
}

function setActiveChapter(chapterName) {
    if (chapterName === activeNomAdministrative)
        return;

    map.flyTo(nomsAdministratives[chapterName]);

    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeNomAdministrative).setAttribute('class', '');

    activeNomAdministrative = chapterName;
}

// create the popup
var markerPopup = new mapboxgl.Popup({offset: 25})
        .setText('Construction on the Washington Monument began in 1848.');

// On every scroll event, check which element is on screen
window.onscroll = function () {
    var chapterNames = Object.keys(nomsAdministratives);

    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
//            console.log(nomsAdministratives[chapterName].center);
            if (marker !== null)
                marker.remove();

            marker = new mapboxgl.Marker().setPopup(markerPopup)
                    .setLngLat(nomsAdministratives[chapterName].center).addTo(map);
            break;
        }
    }
};

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/vick25/' + layerId);
}

function switchLayer2(layer) {
//    var layerId = layer.target.id;
//    map.setStyle('mapbox://styles/pratikyadav/cjldke8fv3c3r2row6hvk5k7z');
    alert("Not available yet!");
    document.getElementById('basic').setAttribute('checked', 'checked');
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}

//inputs[2].onclick = switchLayer2;

map.on('load', function () {
    map.addSource("limite_kisenso", {
        type: "geojson",
        data: data_url + "limite_kisenso.geojson"
    });

    map.addSource("limite_matete", {
        type: "geojson",
        data: data_url + "limite_matete.geojson"
    });

    map.addLayer({
        "id": "boundary_matete",
        "type": "line",
        "source": "limite_matete",
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        "paint": {
            "line-color": "#b45c3c",
            "line-opacity": 0.6,
            "line-width": 2.5
        },
        "filter": ["==", "$type", "Polygon"]
    });

    map.addLayer({
        "id": "boundary_kisenso",
        "type": "line",
        "source": "limite_kisenso",
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        "paint": {
            "line-color": "#b45c3c",
            "line-opacity": 0.6,
            "line-width": 2.5
        },
        "filter": ["==", "$type", "Polygon"]
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    var x = "Entry: ";

    function checkEmpty(info) {
        return (info) ? info : "No data";
    }
    function showPopup(e) {
        // Updates the cursor to a hand (interactivity)
        map.getCanvas().style.cursor = 'pointer';
        // Show the popup at the coordinates with some data
        popup.setLngLat(e.features[0].geometry.coordinates)
                .setHTML("<center><strong>" +
                        checkEmpty(e.features[0].properties.SITE) +
                        "</strong></center><br><center>" + x
                        + checkEmpty(e.features[0].properties.ACCESS) + "</center>")
                .addTo(map);
    }
    function hidePopup() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    }
// CHANGE: Add layer names that need to be interactive
//    map.on('mouseenter', 'boundary_kisenso', showPopup);
//    map.on('mouseleave', 'boundary_matete', hidePopup);
});
