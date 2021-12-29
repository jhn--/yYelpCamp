mapboxgl.accessToken = MAPBOX_TOKEN;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: mapbox_coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

const marker = new mapboxgl.Marker({ color: 'black' })
    .setLngLat(mapbox_coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
            `${camptitle}`
        )
    )
    .addTo(map);