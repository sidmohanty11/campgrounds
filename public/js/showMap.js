mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offsset: 25 })
            .setHTML(
            `<h3>${camp.title}</h3><p>${camp.location}</p>`
        )
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());