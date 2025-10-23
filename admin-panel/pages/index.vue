<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Welcome, {{ user?.name || 'EGIS Admistrator' }}!</h1>
        <p class="text-gray-400 mt-1">Here's a real-time overview of the urban system.</p>
      </div>
      <DashboardClock />
    </div>

    <div v-if="pendingInitialLoad" class="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 p-20 text-gray-400">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading Dashboard...</span>
    </div>

    <div v-else-if="error" class="rounded-md bg-red-900/50 border border-red-500/50 p-4 text-red-300">
      <h3 class="font-bold">Failed to load dashboard data</h3>
      <p class="text-sm mt-1">{{ error.message || 'An unknown error occurred.' }}</p>
    </div>

    <div v-else-if="dashboardData" class="space-y-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard title="Total Districts" :value="dashboardData.global.totalDistricts" :icon="MapIcon" icon-bg-class="bg-blue-600" />
        <DashboardStatCard title="Total Infrastructures" :value="dashboardData.global.totalInfrastructures" :icon="BuildingOffice2Icon" icon-bg-class="bg-green-600" />
        <DashboardStatCard title="Total Traffic Routes" :value="dashboardData.global.totalTrafficRoutes" :icon="MapPinIcon" icon-bg-class="bg-yellow-600" />
        <DashboardStatCard title="Latest Population" :value="dashboardData.global.latestPopulationData?.total.toLocaleString() || 'N/A'" :icon="UserGroupIcon" icon-bg-class="bg-purple-600" />
      </div>

      <div class="grid grid-cols-1">
        <DashboardChartCard title="Quality of Life Index" :icon="HeartIcon" :is-loading="pendingDistrictData">
          <template #actions>
            <UiAppDropdown
              v-if="districtOptions.length > 0"
              v-model="selectedDistrictId"
              :options="districtOptions"
              placeholder="Select District"
            />
          </template>
          <DashboardLineChart :chart-data="qualityOfLifeChartData" :chart-options="qualityOfLifeChartOptions" />
        </DashboardChartCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 flex flex-col gap-8">
          <DashboardChartCard title="Population History" :icon="ChartBarIcon" :is-loading="pendingDistrictData">
            <DashboardPopulationHistoryChart :population-data="districtData?.population" :is-loading="pendingDistrictData" />
          </DashboardChartCard>

          <DashboardChartCard title="Accidents by Time of Day" :icon="ClockIcon" :is-loading="pendingInitialLoad">
            <DashboardAccidentsTimeOfDayChart :accidents-data="dashboardData.accidentsTime" :is-loading="pendingInitialLoad" />
          </DashboardChartCard>
        </div>

        <div class="lg:col-span-1 flex flex-col gap-8">
          <DashboardChartCard title="Infrastructure by Category" :icon="BuildingLibraryIcon" :is-loading="pendingInitialLoad">
            <DashboardPieChart :chart-data="infraChartData" />
          </DashboardChartCard>
          <DashboardRecentActivities :activities="dashboardData.recentActivities" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardRankingCard
          title="Air Quality Ranking (Worst First)"
          unit="PM2.5"
          :icon="CloudIcon"
          :is-loading="pendingInitialLoad"
          :items="airQualityRanking"
        />
        <DashboardRankingCard
          title="Accident Hotspots"
          unit="accidents"
          :icon="ExclamationTriangleIcon"
          :is-loading="pendingInitialLoad"
          :items="accidentHotspots"
        />
        <DashboardRankingCard
          title="Water Quality Ranking (Worst First)"
          unit="Index"
          :icon="BeakerIcon"
          :is-loading="pendingInitialLoad"
          :items="waterQualityRanking"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  BuildingOffice2Icon, MapIcon, MapPinIcon, UserGroupIcon, HeartIcon,
  BuildingLibraryIcon, ClockIcon, CloudIcon, ExclamationTriangleIcon, ChartBarIcon, BeakerIcon
} from '@heroicons/vue/24/outline';
import { useAuth } from '~/composables/useAuth';
import type { District } from '~/types/api/district';
import type {
  InfrastructureByCategory, AirQualityHistoryPoint, WaterQualityHistoryPoint,
  AirQualityRanking, AccidentHotspot, WaterQualityRanking
} from '~/types/api/analytics';

useHead({ title: 'Dashboard' });

const { $api } = useNuxtApp();
const { user } = useAuth();

const selectedDistrictId = ref<string>('');
const districtOptions = ref<{ label: string; value: string }[]>([]);

const extractData = (response: any) => response.data?.data?.data || response.data?.data || response.data || [];

const { data: dashboardData, pending: pendingInitialLoad, error } = useAsyncData('dashboard-initial-data', async () => {
  const [
    districtsRes, globalRes, infraRes,
    recentActivitiesRes, accidentsTimeRes, airRankingRes, waterRankingRes, accidentHotspotsRes
  ] = await Promise.all([
    $api.districts.getAll(), $api.analytics.getGlobalSummary(),
    $api.analytics.getInfrastructureByCategory(), $api.analytics.getRecentActivities(),
    $api.analytics.getAccidentsByTimeOfDay(), $api.analytics.getAirQualityRankingByDistrict(),
    $api.analytics.getWaterQualityRankingByDistrict(), $api.analytics.getAccidentHotspots()
  ]);

  const districts = extractData(districtsRes);
  if (Array.isArray(districts) && districts.length > 0) {
    districtOptions.value = districts.map((d: District) => ({ label: d.name, value: d.id }));
    if (!selectedDistrictId.value) {
      selectedDistrictId.value = districts[0].id;
    }
  }
  return {
    global: extractData(globalRes),
    infra: extractData(infraRes),
    recentActivities: extractData(recentActivitiesRes),
    accidentsTime: extractData(accidentsTimeRes),
    airRanking: extractData(airRankingRes),
    waterRanking: extractData(waterRankingRes),
    accidentHotspots: extractData(accidentHotspotsRes)
  };
});

const { data: districtData, pending: pendingDistrictData } = useAsyncData(
  'dashboard-district-data',
  async () => {
    if (!selectedDistrictId.value) return null;
    const [airQualityRes, waterQualityRes, populationRes] = await Promise.all([
      $api.analytics.getAirQualityHistory(selectedDistrictId.value),
      $api.analytics.getWaterQualityHistory(selectedDistrictId.value),
      $api.analytics.getPopulationHistory(selectedDistrictId.value)
    ]);
    return {
      airQuality: extractData(airQualityRes),
      waterQuality: extractData(waterQualityRes),
      population: extractData(populationRes),
    };
  },
  { watch: [selectedDistrictId] }
);

const infraChartData = computed(() => {
  const data = dashboardData.value?.infra || [];
  return {
    labels: data.map((item: InfrastructureByCategory) => item.category),
    datasets: [{
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280'],
      data: data.map((item: InfrastructureByCategory) => item.count),
    }],
  };
});

const qualityOfLifeChartData = computed(() => {
  const airData = districtData.value?.airQuality || [];
  const waterData = districtData.value?.waterQuality || [];
  const labels = airData.map((item: AirQualityHistoryPoint) => new Date(item.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));

  return {
    labels,
    datasets: [
      {
        label: 'Avg PM2.5',
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        pointBackgroundColor: '#EF4444',
        data: airData.map((item: AirQualityHistoryPoint) => Number(item.avgPm25)),
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Avg pH',
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointBackgroundColor: '#3B82F6',
        data: waterData.map((item: WaterQualityHistoryPoint) => Number(item.avgPh)),
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      }
    ],
  };
});

const qualityOfLifeChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  scales: {
    x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9CA3AF' } },
    y: {
      type: 'linear' as const, position: 'left' as const,
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#EF4444' },
      title: { display: true, text: 'PM2.5 (µg/m³)', color: '#EF4444' }
    },
    y1: {
      type: 'linear' as const, position: 'right' as const,
      grid: { drawOnChartArea: false },
      ticks: { color: '#3B82F6' },
      title: { display: true, text: 'pH Level', color: '#3B82F6' }
    }
  },
  plugins: {
    legend: { labels: { color: '#D1D5DB' } },
    tooltip: {
      backgroundColor: '#1F2937',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 12 },
      padding: 10,
      boxPadding: 4,
    }
  }
}));

const airQualityRanking = computed(() => (dashboardData.value?.airRanking || []).map((d: AirQualityRanking) => ({
  id: d.districtCode, label: d.districtName, value: d.avgPm25
})));

const waterQualityRanking = computed(() => (dashboardData.value?.waterRanking || []).map((d: WaterQualityRanking) => ({
  id: d.districtCode, label: d.districtName, value: d.avgContaminationIndex
})));

const accidentHotspots = computed(() => (dashboardData.value?.accidentHotspots || []).map((h: AccidentHotspot) => ({
  id: h.id, label: h.roadName, value: h.accidentCount
})));
</script>
