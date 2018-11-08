import Vue from "vue";
import MapContainer from "./mapContainer";
import MapControls from "./mapControls";
import FilterButton from "./filterButton";
import AddButton from "./addButton";
import DialogRoot from "./dialogRoot";
import "./styles.scss";

window.vueApp = new Vue({
    el: "#vue-view",
    components: {
        "travel-map": MapContainer,
        "map-controls": MapControls,
        "filter-button": FilterButton,
        "add-button": AddButton,
        "dialog-root": DialogRoot
    },
    data: {
        locationTypes: [],
        showFilters: false
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
