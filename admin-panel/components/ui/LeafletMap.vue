<template>
    <div style="height: 400px; width: 100%" class="rounded-lg overflow-hidden border border-gray-700">
        <LMap ref="map" :zoom="zoom" :center="center">
            <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                layer-type="base"
                name="OpenStreetMap"
            />
            <slot />
        </LMap>
    </div>
</template>

<script setup lang="ts">
const { LMap, LTileLayer } = await import('@vue-leaflet/vue-leaflet');
import type { PointExpression } from 'leaflet';

defineProps<{
    center: PointExpression;
    zoom?: number;
}>();
</script>
