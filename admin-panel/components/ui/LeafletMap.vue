<template>
    <div style="height: 400px; width: 100%" class="rounded-lg overflow-hidden border border-gray-700">
        <LMap ref="map" :zoom="zoom" :center="center">
            <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
                layer-type="base"
                name="OpenStreetMap"
            />
            <slot />
        </LMap>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const { LMap, LTileLayer } = await import('@vue-leaflet/vue-leaflet');
import type { PointExpression } from 'leaflet';

defineProps<{
    center: PointExpression;
    zoom?: number;
}>();

const map = ref();

defineExpose({
    mapObject: computed(() => map.value?.mapObject),
});
</script>
