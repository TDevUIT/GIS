'use client';

import { useState } from 'react';
import { useTrafficData, useTrafficIncidents } from '../../hooks/api/useTrafficQuery';
import { useDistricts } from '../../hooks/api/useGisQuery';
import { useMapStore, useUIStore } from '../../stores';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TrafficDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const { selectedDistrict: mapSelectedDistrict, setSelectedDistrict: setMapDistrict } = useMapStore();
  const { addNotification } = useUIStore();

  const { data: districts, isLoading: districtsLoading } = useDistricts();
  const { data: trafficData, isLoading: trafficLoading, error: trafficError } = useTrafficData(selectedDistrict);
  const { data: incidents, isLoading: incidentsLoading } = useTrafficIncidents();

  const handleDistrictChange = (districtId: string) => {
    console.log('🏙️ District selected:', districtId);
    setSelectedDistrict(districtId);
    setMapDistrict(districtId);

    addNotification({
      type: 'info',
      title: 'District Changed',
      message: `Switched to ${districts?.data?.find(d => d.id === districtId)?.name || 'Unknown District'}`,
    });
  };

  if (districtsLoading) {
    return <LoadingSpinner message="Loading districts..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">TRAFFIC DASHBOARD EXAMPLE</h1>
        <p className="text-gray-600">
          Example component showing Zustand + TanStack Query + Axios integration
        </p>
      </div>

      {/* District Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Select District</h2>
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Districts</option>
          {districts?.data?.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
        
        {/* Map Store State Display */}
        <div className="mt-3 text-sm text-gray-600">
          <strong>Map Store Selected District:</strong> {mapSelectedDistrict || 'None'}
        </div>
      </div>

      {/* Traffic Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Traffic Data</h3>
          
          {trafficLoading && <LoadingSpinner size="sm" message="Loading traffic data..." />}
          
          {trafficError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">Error loading traffic data: {trafficError.message}</p>
            </div>
          )}
          
          {trafficData && (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Status:</strong> {trafficData.status}</p>
                <p><strong>District:</strong> {selectedDistrict || 'All'}</p>
                <p className="text-sm text-gray-600 mt-2">
                  This would show real traffic data from the API
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Incidents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Recent Incidents</h3>
          
          {incidentsLoading && <LoadingSpinner size="sm" message="Loading incidents..." />}
          
          {incidents && (
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="font-medium text-yellow-800">Sample Incident</p>
                <p className="text-yellow-600 text-sm">Status: {incidents.status}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Auto-refreshes every 30 seconds
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Query State Debug Info */}
      <div className="bg-gray-800 text-white rounded-lg p-4">
        <h3 className="font-semibold mb-2">🔧 Debug Info</h3>
        <div className="text-sm space-y-1">
          <p><strong>Districts Loading:</strong> {districtsLoading.toString()}</p>
          <p><strong>Traffic Loading:</strong> {trafficLoading.toString()}</p>
          <p><strong>Incidents Loading:</strong> {incidentsLoading.toString()}</p>
          <p><strong>Selected District:</strong> {selectedDistrict || 'None'}</p>
          <p><strong>Map Store District:</strong> {mapSelectedDistrict || 'None'}</p>
        </div>
      </div>
    </div>
  );
}
