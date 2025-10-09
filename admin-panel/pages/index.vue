<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Welcome, {{ user?.name || 'Admin' }}!</h1>
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
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 rounded-lg border border-gray-700 bg-gray-800/50 p-5 shadow-lg">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
    <h3 class="text-lg font-semibold text-white">Air Quality History</h3>
    <UiAppDropdown
    v-if="districtOptions.length > 0"
    v-model="selectedDistrictId"
    :options="districtOptions"
    placeholder="Select District"
  />
  </div>
  <DashboardLineChart
    :is-loading="pendingAirQuality"
    :chart-data="airQualityChartData"
  />
</div>
        <div>
          <DashboardRecentActivities :activities="dashboardData.recentActivities" />
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardPieChart title="Infrastructure by Category" :chart-data="infraChartData" />
        <DashboardPieChart title="Accidents by Severity" :chart-data="accidentChartData" />
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-16">
      <p>No dashboard data could be loaded.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { BuildingOffice2Icon, MapIcon, MapPinIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '~/composables/useAuth';
import type { District } from '~/types/api/district';
import type { InfrastructureByCategory, AccidentSummaryBySeverity, AirQualityHistoryPoint, RecentActivity } from '~/types/api/analytics';

useHead({ title: 'Dashboard' });

const { $api } = useNuxtApp();
const { user } = useAuth();

const selectedDistrictId = ref<string>('');
const districtOptions = ref<{ label: string; value: string }[]>([]);

const { data: dashboardData, pending: pendingInitialLoad, error } = useAsyncData('dashboard-initial-data', async () => {
  const [
    districtsRes,
    globalRes,
    infraRes,
    accidentsRes,
    recentActivitiesRes
  ] = await Promise.all([
    $api.districts.getAll(),
    $api.analytics.getGlobalSummary(),
    $api.analytics.getInfrastructureByCategory(),
    $api.analytics.getAccidentSummaryBySeverity(),
    $api.analytics.getRecentActivities(),
  ]);
  const districts = districtsRes.data.data;
  if (Array.isArray(districts) && districts.length > 0) {
    districtOptions.value = districts.map((d: District) => ({ label: d.name, value: d.id }));
    if (!selectedDistrictId.value) {
      selectedDistrictId.value = districts[0].id;
    }
  }
  return {
    global: globalRes.data.data,
    infra: infraRes.data.data,
    accidents: accidentsRes.data.data,
    recentActivities: recentActivitiesRes.data.data,
  };
});

const { data: airQualityHistory, pending: pendingAirQuality } = useAsyncData(
  'airQualityHistory',
  () => {
    if (!selectedDistrictId.value) return Promise.resolve(null);
    return $api.analytics.getAirQualityHistory(selectedDistrictId.value);
  },
  { 
    watch: [selectedDistrictId]
  }
);

if (error.value) {
  console.error("Dashboard data fetching error:", error.value);
}

const generateColors = (numColors: number) => {
  if (numColors === 0) return [];
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = (200 + (160 / numColors) * i) % 360;
    colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
  }
  return colors;
};

const infraChartData = computed(() => {
  const infraData = dashboardData.value?.infra;
  const items = Array.isArray(infraData) ? infraData : [];
  return {
    labels: items.map((item: InfrastructureByCategory) => item.category),
    datasets: [{
      backgroundColor: generateColors(items.length),
      borderColor: '#1F2937',
      borderWidth: 1,
      data: items.map((item: InfrastructureByCategory) => item.count),
    }],
  };
});

const accidentChartData = computed(() => {
  const accidentData = dashboardData.value?.accidents;
  const items = Array.isArray(accidentData) ? accidentData : [];
  return {
    labels: items.map((item: AccidentSummaryBySeverity) => item.severity),
    datasets: [{
      backgroundColor: ['#DC2626', '#F59E0B', '#3B82F6'].slice(0, items.length),
      borderColor: '#1F2937',
      borderWidth: 1,
      data: items.map((item: AccidentSummaryBySeverity) => item.count),
    }],
  };
});

const airQualityChartData = computed(() => {
  const airData = airQualityHistory.value?.data.data;
  const items = Array.isArray(airData) ? airData : [];
  return {
    labels: items.map((item: AirQualityHistoryPoint) => new Date(item.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })),
    datasets: [
      {
        label: 'Avg PM2.5',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
        pointBackgroundColor: '#EF4444',
        data: items.map((item: AirQualityHistoryPoint) => Number(item.avgPm25)),
        tension: 0.4,
      },
      {
        label: 'Avg CO2',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        pointBackgroundColor: '#3B82F6',
        data: items.map((item: AirQualityHistoryPoint) => Number(item.avgCo2)),
        tension: 0.4,
      },
    ],
  };
});
</script>
