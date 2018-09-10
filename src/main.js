import "./styles.scss";
import mapImage from "./map.png";

import Map from "./map";
import Vue from "vue";

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
          <label><input type="checkbox" v-model='type.active' />{{ type.label }}</label>
        </li>
      </ul>
    </div>`
});

Vue.component("travel-map", {
    props: [],
    template: "<div id=\"map\" style=\"width: 1200px; height: 600px;\" />"
});

window.vueApp = new Vue({
    el: "#vue-view",
    data: {
        locationTypes: [{
            id: "star",
            label: "Home",
            active: true
        },
        {
            id: "lodging",
            label: "Hotel",
            active: true
        },
        {
            id: "airport",
            label: "Airport",
            active: true
        },
        {
            id: "rail",
            label: "Train",
            active: false
        },
        {
            id: "car",
            label: "Car",
            active: true
        }]
    }
});

// TODO : better interface
new Map("map");
