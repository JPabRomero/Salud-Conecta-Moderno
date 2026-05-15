import React from 'react';
import { 
  Hospital, 
  Heart, 
  Cross, 
  Microscope, 
  Pill,
  MapPin,
  HospitalIcon
} from 'lucide-react';

interface Facility {
  name: string;
  type: string;
  sector: 'public' | 'private';
  lat: number;
  lng: number;
  phone?: string;
  address?: string;
}

interface CityHealthMapProps {
  city: string;
  coordinates: { lat: number; lng: number };
  facilities: Facility[];
}

const typeIcons: Record<string, React.ReactNode> = {
  hospital: <HospitalIcon className="w-5 h-5" />,
  hospital枣: <Hospital className="w-5 h-5" />,
  health-center: <Heart className="w-5 h-5" />,
  clinic: <Cross className="w-5 h-5" />,
  laboratory: <Microscope className="w-5 h-5" />,
  pharmacy: <Pill className="w-5 h-5" />
};

const typeColors: Record<string, string> = {
  hospital: 'bg-blue-500',
  health-center: 'bg-red-500',
  clinic: 'bg-green-500',
  laboratory: 'bg-purple-500',
  pharmacy: 'bg-yellow-500'
};

export default function CityHealthMap({ city, coordinates, facilities }: CityHealthMapProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              {city}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Centro de referencia: {coordinates.lat}, {coordinates.lng}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {facilities.length}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Establecimientos</span>
          </div>
        </div>

        {/* Summary by Type */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <Hospital className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {facilities.filter(f => f.type.includes('hospital')).length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Hospitales</div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
            <Heart className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {facilities.filter(f => f.type.includes('health-center')).length}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">Centros</div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <Cross className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {facilities.filter(f => f.type === 'clinic').length}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Clínicas</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
            <Microscope className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {facilities.filter(f => f.type === 'laboratory').length}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Labs</div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
            <Pill className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {facilities.filter(f => f.type === 'pharmacy').length}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Farm</div>
          </div>
        </div>

        {/* Public/Private Distribution */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Red Pública</span>
            <span>Red Privada</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {facilities.filter(f => f.sector === 'public').length}
              </div>
            </div>
            <div className="flex-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                {facilities.filter(f => f.sector === 'private').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-800 dark:text-white">Lista de Establecimientos</h3>
        </div>

        {facilities.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
            <p>No hay establecimientos registrados en esta ciudad</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {facilities.map((facility, index) => (
              <div key={index} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {typeColors[facility.type.toLowerCase()] || 'bg-slate-500'}
                  </div>
                  <div className="flex-1 min-w-0