'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface DistrictStats {
  district: string;
  total: number;
  open: number;
  inProgress: number;
  completed: number;
}

// District coordinates (approximate centers)
const districtLocations: { [key: string]: [number, number] } = {
  'Colombo': [6.9271, 79.8612],
  'Gampaha': [7.0873, 80.0142],
  'Kalutara': [6.5854, 79.9607],
  'Kandy': [7.2906, 80.6337],
  'Matale': [7.4675, 80.6234],
  'Nuwara Eliya': [6.9497, 80.7891],
  'Galle': [6.0535, 80.2210],
  'Matara': [5.9549, 80.5550],
  'Hambantota': [6.1429, 81.1212],
  'Jaffna': [9.6615, 80.0255],
  'Kilinochchi': [9.3803, 80.3887],
  'Mannar': [8.9810, 79.9044],
  'Vavuniya': [8.7542, 80.4982],
  'Mullaitivu': [9.2671, 80.8142],
  'Batticaloa': [7.7310, 81.6747],
  'Ampara': [7.2914, 81.6747],
  'Trincomalee': [8.5874, 81.2152],
  'Kurunegala': [7.4863, 80.3623],
  'Puttalam': [8.0362, 79.8283],
  'Anuradhapura': [8.3114, 80.4037],
  'Polonnaruwa': [7.9403, 81.0188],
  'Badulla': [6.9934, 81.0550],
  'Monaragala': [6.8728, 81.3507],
  'Ratnapura': [6.6828, 80.3992],
  'Kegalle': [7.2513, 80.3464]
};

export default function MapPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DistrictStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/requirements/district-stats');
        const statsData = await response.json();
        setStats(statsData.stats || statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDistrictStats = (districtName: string) => {
    return stats.find(s => s.district === districtName) || { district: districtName, total: 0, open: 0, inProgress: 0, completed: 0 };
  };

  const getColor = (districtName: string) => {
    const districtStats = getDistrictStats(districtName);
    if (districtStats.total === 0) return '#e5e7eb';
    const completionRate = districtStats.completed / districtStats.total;
    if (completionRate >= 0.75) return '#10b981';
    if (completionRate >= 0.5) return '#3b82f6';
    if (completionRate >= 0.25) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('districtMap')}
          </h1>
          <p className="text-gray-600">
            {t('districtMapDesc')}
          </p>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('legend')}:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">&gt;75% {t('completed')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">50-75% {t('completed')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">25-50% {t('completed')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">&lt;25% {t('completed')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">{t('noRequirements')}</span>
            </div>
          </div>
        </div>

        {/* Map */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md">
            <Loading size="lg" text={t('loading')} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div style={{ height: '600px', width: '100%' }}>
              <MapContainer
                center={[7.8731, 80.7718]}
                zoom={8}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Object.entries(districtLocations).map(([district, coords]) => {
                  const districtStats = getDistrictStats(district);
                  const color = getColor(district);
                  
                  return (
                    <CircleMarker
                      key={district}
                      center={coords}
                      radius={8}
                      pathOptions={{
                        fillColor: color,
                        fillOpacity: 0.8,
                        color: 'white',
                        weight: 2
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <strong className="text-base block mb-2">{district}</strong>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Total:</span> <strong>{districtStats.total}</strong></div>
                            <div className="text-green-600"><span className="font-medium">Open:</span> <strong>{districtStats.open}</strong></div>
                            <div className="text-blue-600"><span className="font-medium">In Progress:</span> <strong>{districtStats.inProgress}</strong></div>
                            <div className="text-gray-600"><span className="font-medium">Completed:</span> <strong>{districtStats.completed}</strong></div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}
