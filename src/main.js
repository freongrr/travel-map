import "./styles.scss";

import Map from "./map";
import Vue from "vue";

// TODO : add to data?
const map = new Map();

Vue.component("map-controls", {
    props: {
        types: {
            type: Array,
            required: true
        }
    },
    template: `
    <div class="mapControls">
      <strong>Locations:</strong>
      <ul>
        <li v-for="type in types" :key="type.id">
          <label>
            <input type="checkbox" v-model="type.active" />
            {{ type.label }}
          </label>
        </li>
      </ul>
    </div>`
});

Vue.component("travel-map", {
    props: [],
    template: "<div id=\"map\" style=\"width: 1200px; height: 600px;\" />"
});

Vue.component("travel-map", {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    created() {
        // HACK - Vue is doing something with the DOM and the map does not work
        // Delyaing the initialization fixes it.
        setTimeout(() => {
            map.init(this.id, () => {
                this.$emit("load");
            });
        }, 100);
    },
    template: "<div :id=\"id\" style=\"width: 1200px; height: 600px;\" />"
});

window.vueApp = new Vue({
    el: "#vue-view",
    data: {
        locationTypes: []
    },
    methods: {
        onMapLoaded: function() {
            const types = map.getAllFeatureTypes();
            // TODO : labels (or remove the label from the object)
            this.locationTypes = types.map(type => ({
                id: type,
                label: type,
                active: true
            }));
        }
    },
    watch: {
        locationTypes: {
            handler: function() {
                const activeTypes = this.locationTypes.filter(t => t.active).map(t => t.id);
                map.setFeatureTypes(activeTypes);
            },
            deep: true
        }
    }
});
