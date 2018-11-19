import Map from "./map";

export default {
    props: ["id", "locationTypes"],
    created() {
        // HACK - Vue is doing something with the DOM and the map does not work
        // Delaying the initialization fixes it
        setTimeout(() => {
            this.map = new Map();
            this.map.init(this.id, () => {
                this.$emit("load", this.map);
            });
        }, 100);
    },
    watch: {
        locationTypes: {
            handler: function() {
                const activeTypes = this.locationTypes.filter(t => t.active).map(t => t.id);
                this.map.setFeatureTypes(activeTypes);
            },
            deep: true
        }
    },
    template: "<div :id=\"id\" style=\"width: 1200px; height: 600px;\" />"
};
