import "./styles.scss";

import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import TOKEN from "./mapbox-token.js";
import PLACES from "./places.json";

// Convert custom format to geojson
const DATA = {
    "type": "FeatureCollection",
    "features": PLACES.map(p => {
        return {
            "type": "Feature",
            "properties": {
                "title": p.name,
                "description": p.name,
                "icon": p.icon
            },
            "geometry": {
                "type": "Point",
                "coordinates": p.coordinates
            }
        };
    })
};

mapboxgl.accessToken = TOKEN;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/freongrr/cjjo11jdxf3rs2rpb5x42cv4m"
    // center: [-77.04, 38.907],
    // zoom: 11.15
});

map.on("load", function() {
    map.addSource("places", {
        type: "geojson",
        data: DATA,
        cluster: true
    });

    map.addLayer({
        id: "place-cluster",
        type: "circle",
        source: "places",
        filter: ["has", "point_count"],
        paint: {
            "circle-blur": 0.5,
            "circle-color": "#FFF",
            "circle-radius": [
                "step", ["get", "point_count"],
                50,
                5,
                50,
                10,
                60
            ]
        }
    });

    map.addLayer({
        id: "place-count",
        type: "symbol",
        source: "places",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated} places",
            "text-size": 16
        },
        paint: {
            "text-color": "#008",
        }
    });

    map.addLayer({
        id: "place-symbols",
        type: "symbol",
        source: "places",
        filter: ["!has", "point_count"],
        "layout": {
            "text-field": "{title}",
            "text-font": ["Roboto Regular"],
            // TODO : increase with zoom
            "text-size": 16,
            "text-letter-spacing": 0.05,
            "text-offset": [0, 1],
            "text-anchor": "top",
            "icon-size": 1.5,
            "icon-image": "{icon}-15"
        },
        "paint": {
            "text-color": "#008",
            "text-halo-color": "white",
            "text-halo-width": 2,
            "text-halo-blur": 0.5
        }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "place-symbols", function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "place-symbols", function() {
        map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "place-symbols", function() {
        map.getCanvas().style.cursor = "";
    });
});
