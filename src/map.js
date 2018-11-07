/* eslint no-unused-vars: off */

import "./styles.scss";

import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import TOKEN from "./mapbox-token.js";
import PLACES from "./places.json";
import COUNTRIES from "./countries.geojson";

// Convert custom format to geojson FeatureCollection
const DATA = {
    type: "FeatureCollection",
    features: PLACES.map(p => {
        return {
            type: "Feature",
            properties: {
                "title": p.name,
                "description": p.name,
                "countryName": p.countryName,
                "icon": p.icon
            },
            geometry: {
                "type": "Point",
                "coordinates": p.coordinates
            }
        };
    })
};

// Normal
const styleUrl = "mapbox://styles/freongrr/cjjo11jdxf3rs2rpb5x42cv4m";
const visitedCountryColor = "";
const unvisitedCountryColor = "#888";
const clusterColor = "#FFF";

// Orange and black
// const styleUrl = "mapbox://styles/freongrr/cjk5bl6a85uxy2rpeakfp2pyg";
// const visitedCountryColor = "#F08000";
// const unvisitedCountryColor = "#704010";
// const clusterColor = "#F0F040";

const CLUSTERED_PLACE_SOURCE = "clustered-places";

export default class Map {

    constructor() {
        mapboxgl.accessToken = TOKEN;
    }

    init(containerId, callback) {
        this.map = new mapboxgl.Map({
            container: containerId,
            style: styleUrl,
            center: [2, 35],
            zoom: 1.1
        });

        this.map.on("load", () => this.onLoad(callback));
    }

    onLoad(callback) {
        this.configureSources();
        this.configureLayers();
        this.configureEvents();

        callback();
    }

    configureSources() {
        this.map.addSource(CLUSTERED_PLACE_SOURCE, {
            type: "geojson",
            data: DATA,
            cluster: true
        });

        // TODO : this could be hosted on MapBox
        this.map.addSource("countries", {
            "type": "geojson",
            "data": COUNTRIES
        });
    }

    configureLayers() {
        const countryFilter = ["in", "alpha3"];
        PLACES.forEach(p => {
            if (p.country && countryFilter.indexOf(p.country) < 0) {
                countryFilter.push(p.country);
            }
        });

        const reverseCountryFilter = [...countryFilter];
        reverseCountryFilter[0] = "!in";

        // Overlay that shows non-visited countries
        this.map.addLayer({
            id: "not-visited-countries-fills",
            type: "fill",
            source: "countries",
            layout: {},
            filter: reverseCountryFilter,
            paint: {
                "fill-color": unvisitedCountryColor
            }
        }, "country-borders");

        // Overlay that shows visited countries (only when enabled)
        if (visitedCountryColor) {
            this.map.addLayer({
                id: "visited-countries-fills",
                type: "fill",
                source: "countries",
                layout: {},
                filter: countryFilter,
                paint: {
                    "fill-color": visitedCountryColor
                }
            }, "country-borders");
        }

        // Shows a symbol at the exact location of a feature
        // Only visible when clusters are not in the way
        this.map.addLayer({
            id: "place-symbols",
            type: "symbol",
            source: CLUSTERED_PLACE_SOURCE,
            filter: ["!has", "point_count"],
            layout: {
                "text-field": "{title}",
                "text-font": ["Roboto Regular"],
                "text-size": 18,
                "text-letter-spacing": 0.05,
                "text-offset": [0, 1],
                "text-anchor": "top",
                "icon-size": 1.5,
                "icon-image": "{icon}-15"
            },
            paint: {
                "text-color": "white",
                "text-halo-color": "black",
                "text-halo-width": 2,
                "text-halo-blur": 1
            }
        });

        // Shows circles where a cluster of features is (with varying size)
        this.map.addLayer({
            id: "place-cluster",
            type: "circle",
            source: CLUSTERED_PLACE_SOURCE,
            filter: ["has", "point_count"],
            paint: {
                "circle-color": clusterColor,
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

        // Shows the symbol count on top of a cluser circle
        this.map.addLayer({
            id: "place-count",
            type: "symbol",
            source: CLUSTERED_PLACE_SOURCE,
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated} places",
                "text-size": 16
            },
            paint: {
                "text-color": "black",
            }
        });
    }

    configureEvents() {
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        this.map.on("click", "place-symbols", e => {
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice();
            const description = `${feature.properties.description}<br />
                             ${feature.properties.countryName}<br />
                             Type: ${e.features[0].properties.icon}`;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(this.map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        this.map.on("mouseenter", "place-symbols", () => {
            this.map.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        this.map.on("mouseleave", "place-symbols", () => {
            this.map.getCanvas().style.cursor = "";
        });
    }

    getAllFeatureTypes() {
        const types = new Set();
        DATA.features.forEach(f => types.add(f.properties.icon));
        return [...types];
    }

    setFeatureTypes(types) {
        // The layers can't be filtered because the data is clustered
        const filteredData = {
            ...DATA,
            features: DATA.features.filter(f => types.indexOf(f.properties.icon) >= 0)
        };
        this.map.getSource(CLUSTERED_PLACE_SOURCE).setData(filteredData);
    }
}
