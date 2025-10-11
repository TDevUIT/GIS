import {
    LMap,
    LTileLayer,
    LGeoJson,
    LFeatureGroup,
} from '@vue-leaflet/vue-leaflet';
import LControlDraw from 'vue-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('LMap', LMap);
    nuxtApp.vueApp.component('LTileLayer', LTileLayer);
    nuxtApp.vueApp.component('LGeoJson', LGeoJson);
    nuxtApp.vueApp.component('LFeatureGroup', LFeatureGroup);
    nuxtApp.vueApp.component('LControlDraw', LControlDraw);
});
