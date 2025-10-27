'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface DistrictMiniMapProps {
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  districtName: string;
  height?: string;
}

export default function DistrictMiniMap({ 
  geometry, 
  districtName,
  height = '300px' 
}: DistrictMiniMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || !geometry) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
        attributionControl: false,
      });

      // Add tile layer with better styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 10,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON || layer instanceof L.Polygon) {
        map.removeLayer(layer);
      }
    });

    // Create GeoJSON feature
    const geoJsonFeature = {
      type: 'Feature' as const,
      properties: {
        name: districtName,
      },
      geometry: geometry,
    };

    // Add GeoJSON layer with hover effect
    const geoJsonLayer = L.geoJSON(geoJsonFeature, {
      style: {
        color: '#2563eb',
        weight: 3,
        opacity: 0.8,
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(`
            <div style="padding: 8px;">
              <strong style="font-size: 14px; color: #1f2937;">${feature.properties.name}</strong>
              <p style="margin-top: 4px; font-size: 12px; color: #6b7280;">
                Nhấp vào bản đồ để xem tọa độ
              </p>
            </div>
          `);
        }

        // Hover effect
        layer.on('mouseover', function (this: L.Path) {
          this.setStyle({
            weight: 4,
            fillOpacity: 0.3,
          });
        });

        layer.on('mouseout', function (this: L.Path) {
          this.setStyle({
            weight: 3,
            fillOpacity: 0.15,
          });
        });
      },
    }).addTo(map);

    // Fit bounds to geometry
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    // Add click handler to show coordinates
    map.on('click', (e) => {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div style="padding: 4px;">
            <strong style="font-size: 12px;">Tọa độ:</strong>
            <p style="font-size: 11px; margin-top: 4px; font-family: monospace;">
              Lat: ${e.latlng.lat.toFixed(6)}<br/>
              Lng: ${e.latlng.lng.toFixed(6)}
            </p>
          </div>
        `)
        .openOn(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geometry, districtName]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (mapRef.current) {
      mapRef.current.invalidateSize();
      // Refit bounds
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          const bounds = layer.getBounds();
          if (bounds.isValid()) {
            mapRef.current?.fitBounds(bounds, { padding: [30, 30] });
          }
        }
      });
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
  };

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg 
            className="w-5 h-5 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
            />
          </svg>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Bản đồ tương tác
            </h3>
            <p className="text-xs text-gray-600">
              {districtName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
            title="Làm mới bản đồ"
          >
            <RefreshCw 
              className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-gray-600" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="w-full"
        style={{ 
          height: isFullscreen ? 'calc(100vh - 100px)' : height,
          minHeight: isFullscreen ? 'calc(100vh - 100px)' : height 
        }}
      />

      {/* Footer with instructions */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>💡 Nhấp vào bản đồ để xem tọa độ</span>
          <span>🖱️ Cuộn để zoom, kéo để di chuyển</span>
        </div>
      </div>
    </div>
  );
}
