// var platform = new H.service.Platform({
//     'apikey': 'WWAsbNyP0NSMNK37h-sCpel9YcUALVKU-0FCpVztiIg'
// });

// var omvService = platform.getOMVService({path:  'v2/vectortiles/core/mc'});
// var baseUrl = 'https://js.api.here.com/v3/3.1/styles/omv/oslo/japan/';

// // create a Japan specific style
// var style = new H.map.Style(`${baseUrl}normal.day.yaml`, baseUrl);

// // instantiate provider and layer for the basemap
// var omvProvider = new H.service.omv.Provider(omvService, style);
// var omvlayer = new H.map.layer.TileLayer(omvProvider, {max: 22});

// // instantiate (and display) a map:
// var map = new H.Map(
// document.getElementById('mapContainer'),
// omvlayer,
// {
//     zoom: 17,
//     center: { lat: 21.0464757324252, lng: 105.80235451843232 }
// });


function loadMap() {
    var platform = new H.service.Platform({
        'apikey': 'FwFaFrGSkmz1srzLbrB-o7yBjAUnhXdG4XU9qD5CBOk'
    });

    var defaultLayers = platform.createDefaultLayers();

    var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
        zoom: 17,
        center: { lat: 21.0464757324252, lng: 105.80235451843232 }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready');
    loadMap();
});