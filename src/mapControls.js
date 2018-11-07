export default {
    props: {
        locationTypes: {
            type: Array,
            required: true
        }
    },
    template: `
    <div class="mapControls">
      <strong>Locations:</strong>
      <ul>
        <li v-for="type in locationTypes" :key="type.id">
          <label>
            <input type="checkbox" v-model="type.active" />
            {{ type.label }}
          </label>
        </li>
      </ul>
    </div>`
};
