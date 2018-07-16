import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "./styles.scss";

// TODO : read token from somewhere?
mapboxgl.accessToken = "XXX";

new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v10"
});
