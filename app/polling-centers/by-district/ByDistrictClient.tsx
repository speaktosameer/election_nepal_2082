'use client';

import { useRouter } from 'next/navigation';
import { Building2, MapPin } from 'lucide-react';
import { Card, Select, Badge } from '@/components/ui';
import { BarChart } from '@/components/charts';
import { PollingCentersByDistrictResponse } from '@/lib/types';

interface ByDistrictClientProps {
  data: PollingCentersByDistrictResponse | null;
  searchParams: {
    province?: string;
    district?: string;
    sort?: string;
  };
}

const PROVINCES = [
  { value: '', label: 'All Provinces' },
  { value: 'कोशी प्रदेश', label: 'Koshi Pradesh' },
  { value: 'मधेश प्रदेश', label: 'Madhesh Pradesh' },
  { value: 'बागमती प्रदेश', label: 'Bagmati Pradesh' },
  { value: 'गण्डकी प्रदेश', label: 'Gandaki Pradesh' },
  { value: 'लुम्बिनी प्रदेश', label: 'Lumbini Pradesh' },
  { value: 'कर्णाली प्रदेश', label: 'Karnali Pradesh' },
  { value: 'सुदुरपश्चिम प्रदेश', label: 'Sudurpaschim Pradesh' },
];

const SORT_OPTIONS = [
  { value: 'district_code', label: 'Sort by Code' },
  { value: 'district', label: 'Sort by Name' },
  { value: 'center_count', label: 'Sort by Centers' },
];

export function ByDistrictClient({ data, searchParams }: ByDistrictClientProps) {
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (key === 'province') {
      if (value) params.set('province', value);
    } else if (searchParams.province) {
      params.set('province', searchParams.province);
    }
    if (key === 'sort') {
      if (value) params.set('sort', value);
    } else if (searchParams.sort) {
      params.set('sort', searchParams.sort);
    }
    router.push(`/polling-centers/by-district?${params.toString()}`);
  };

  const chartData = data?.data.slice(0, 15).map((d) => ({
    name: d.district_en.length > 12 ? d.district_en.substring(0, 12) + '...' : d.district_en,
    centers: d.total_centers,
    constituencies: d.constituencies_count,
  })) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <Building2 className="text-emerald-500 flex-shrink-0" size={22} />
          Polling Centers by District
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">
          View polling center distribution across districts
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4">
          <div className="sm:w-64">
            <Select
              label="Filter by Province"
              options={PROVINCES}
              value={searchParams.province || ''}
              onChange={(e) => updateFilter('province', e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Select
              label="Sort By"
              options={SORT_OPTIONS}
              value={searchParams.sort || 'district_code'}
              onChange={(e) => updateFilter('sort', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card title="Centers Distribution" icon={<MapPin size={18} />}>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[300px]">
              <BarChart
                data={chartData}
                xKey="name"
                yKey="centers"
                height={300}
              />
            </div>
          </div>
        </Card>
      )}

      {/* District Cards */}
      {data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {data.data.map((district) => (
            <Card key={district.district_code} className="hover:border-emerald-500/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{district.district}</h3>
                  <p className="text-sm text-gray-500">{district.district_en}</p>
                </div>
                <Badge variant="success">{district.total_centers}</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Province</span>
                  <span className="text-gray-300">{district.province_en}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">District Code</span>
                  <span className="text-gray-300">{district.district_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Constituencies</span>
                  <span className="text-gray-300">{district.constituencies_count}</span>
                </div>
              </div>

              {/* Mini chart or indicator */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${Math.min((district.total_centers / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{district.total_centers} centers</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Building2 className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No data available</p>
          </div>
        </Card>
      )}
    </div>
  );
}
