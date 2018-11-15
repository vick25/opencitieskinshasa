/* global mapboxgl */

mapboxgl.accessToken = 'pk.eyJ1IjoidmljazI1IiwiYSI6ImNqa3d6NWpxczAzN2IzcHF4eHlwZzNmcjYifQ.XNOgFms-v3P60RerHVIeUQ';

//active communes
var activeChapterName = 'matete';

var chapters = {
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
//    'wonders': {
//        bearing: 180,
//        center: [39.18968333, -6.16078333],
//        zoom: 19
//    },
//    'prison': {
//        bearing: 90,
//        center: [39.16885, -6.12048333],
//        zoom: 19,
//        pitch: 40
//    }
};

// Set bounds to Kinshasa
var bounds = [
    [14.758758544921875, -4.867942700387028], // Southwest coordinates
    [15.83404541015625, -3.99989036105956]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map', // container id
//    style: 'mapbox://styles/hills95/cjlklf0yn37mx2sqqty08wxvr', // stylesheet location
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

var jsonData = $.getJSON("data/limite_kisenso.geojson");
console.log(jsonData);

map.on('load', function () {
    map.addSource('boundary', {
        type: 'geojson',
        data: jsonData
    });
    
    map.addLayer();
    
    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    var x = "Entry: ";

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
    function checkEmpty(info) {
        return (info) ? info : "No data";
    }
// CHANGE: Add layer names that need to be interactive
    map.on('mouseenter', 'zanzibar-heritage', showPopup);
    map.on('mouseleave', 'zanzibar-heritage', hidePopup);
});

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}

function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName)
        return;

    map.flyTo(chapters[chapterName]);

    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;
}

// On every scroll event, check which element is on screen
window.onscroll = function () {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
};

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
//    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/vick25/cjo4ezhkr654r2rqn6h0voiro');
}
function switchLayer1(layer) {
//    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/vick25/cjo5v77ye0xuj2rqlnzz5esnp');

}
function switchLayer2(layer) {
//    var layerId = layer.target.id;
//    map.setStyle('mapbox://styles/pratikyadav/cjldke8fv3c3r2row6hvk5k7z');
    alert("Not available yet!");
    document.getElementById('basic').setAttribute('checked', 'checked');
}

inputs[0].onclick = switchLayer;
inputs[1].onclick = switchLayer1;
inputs[2].onclick = switchLayer2;
