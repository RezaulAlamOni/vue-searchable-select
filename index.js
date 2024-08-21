import VueSearchableSelect from './src/vue-searchable-componet.vue';

export default {
    install(app) {
        app.component('VueSearchableSelect', VueSearchableSelect);
    },
};

export { VueSearchableSelect };
