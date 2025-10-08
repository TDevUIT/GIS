<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Welcome, {{ user?.name || 'Admin' }}!</h1>
        <p class="text-gray-400 mt-1">Here's a summary of the urban infrastructure system.</p>
      </div>
      <DashboardClock />
    </div>

    <div v-if="pending" class="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 p-20 text-gray-400">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading dashboard data...</span>
    </div>
    
    <div v-else-if="error" class="rounded-md bg-red-900/50 border border-red-500/50 p-4 text-red-300">
      <h3 class="font-bold">Failed to load dashboard data</h3>
      <p class="text-sm mt-1">{{ error.message }}</p>
    </div>

    <div v-else-if="summaryData" class="space-y-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Total Districts"
          :value="summaryData.global.totalDistricts"
          :icon="MapIcon"
          icon-bg-class="bg-blue-600"
        />
        <DashboardStatCard
          title="Total Infrastructures"
          :value="summaryData.global.totalInfrastructures"
          :icon="BuildingOffice2Icon"
          icon-bg-class="bg-green-600"
        />
        <DashboardStatCard
          title="Total Traffic Routes"
          :value="summaryData.global.totalTrafficRoutes"
          :icon="RadioIcon"
          icon-bg-class="bg-yellow-600"
        />
        <DashboardStatCard
          title="Latest Population"
          :value="summaryData.global.latestPopulationData?.total.toLocaleString() || 'N/A'"
          :icon="UserGroupIcon"
          icon-bg-class="bg-purple-600"
        />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardPieChart title="Infrastructure by Category" :chart-data="infraChartData" />
        <DashboardPieChart title="Accidents by Severity" :chart-data="accidentChartData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BuildingOffice2Icon, MapIcon, RadioIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '~/composables/useAuth';
import type { InfrastructureByCategory, AccidentSummaryBySeverity } from '~/types/api/analytics';

useHead({ title: 'Dashboard' });

const { $api } = useNuxtApp();
const { user } = useAuth();

const { data: summaryData, pending, error } = await useAsyncData('dashboard-summary', async () => {
  const [globalRes, infraRes, accidentsRes] = await Promise.all([
    $api.analytics.getGlobalSummary(),
    $api.analytics.getInfrastructureByCategory(),
    $api.analytics.getAccidentSummaryBySeverity(),
  ]);
  return {
    global: globalRes.data,
    infra: infraRes.data,
    accidents: accidentsRes.data,
  };
});

if (error.value) {
  console.error("Dashboard data fetching error:", error.value);
}

const generateColors = (numColors: number) => {
  if (numColors === 0) return [];
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = (360 / numColors) * i;
    colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
  }
  return colors;
};

const infraChartData = computed(() => {
  const infraData = summaryData.value?.infra;
  const items = Array.isArray(infraData) ? infraData : [];
  const labels = items.map((item: InfrastructureByCategory) => item.category);
  const data = items.map((item: InfrastructureByCategory) => item.count);
  return {
    labels,
    datasets: [{
      backgroundColor: generateColors(labels.length),
      borderColor: '#1F2937',
      borderWidth: 2,
      data,
    }],
  };
});

const accidentChartData = computed(() => {
  const accidentData = summaryData.value?.accidents;
  const items = Array.isArray(accidentData) ? accidentData : [];
  const labels = items.map((item: AccidentSummaryBySeverity) => item.severity);
  const data = items.map((item: AccidentSummaryBySeverity) => item.count);
  return {
    labels,
    datasets: [{
      backgroundColor: ['#DC2626', '#F59E0B', '#3B82F6'].slice(0, labels.length),
      borderColor: '#1F2937',
      borderWidth: 2,
      data,
    }],
  };
});
</script>
