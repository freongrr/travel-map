import Vue from "vue";
import MapContainer from "./mapContainer";
import MapControls from "./mapControls";
import "./styles.scss";

window.vueApp = new Vue({
    el: "#vue-view",
    components: {
        "travel-map": MapContainer,
        "map-controls": MapControls
    },
    data: {
        locationTypes: []
    },
    methods: {
        onMapLoaded: function(map) {
            const types = map.getAllFeatureTypes();
            // TODO : labels (or remove the label from the object)
            this.locationTypes = types.map(type => ({
                id: type,
                label: type,
                active: true
            }));
        }
    }
});
