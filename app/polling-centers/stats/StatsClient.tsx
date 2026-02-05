'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, MapPin, Building2, Vote, Calendar } from 'lucide-react';
import { Card, StatCard, Select } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/charts';
import { PollingCenterStatsResponse } from '@/lib/types';

interface StatsClientProps {
  stats: PollingCenterStatsResponse | null;
  searchParams: {
    year?: string;
  };
}

const YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  { value: '2082', label: 'Election 2082' },
  { value: '2079', label: 'Election 2079' },
  { value: '2074', label: 'Election 2074' },
];

export function StatsClient({ stats, searchParams }: StatsClientProps) {
  const router = useRouter();

  const updateYear = (year: string) => {
    const params = new URLSearchParams();
    if (year) params.set('year', year);
    router.push(`/polling-centers/stats?${params.toString()}`);
  };

  const provinceChartData = stats?.province_breakdown?.map((p) => ({
    name: p.province_en || p.province,
    centers: p.centers_count,
    districts: p.districts_count,
  })) || [];

  const calcMinWidth = (count: number, per = 100) => `${Math.max(count * per, 300)}px`;

  const provincePieData = stats?.province_breakdown?.map((p, index) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    return {
      name: p.province_en || p.province,
      value: p.centers_count,
      color: colors[index % colors.length],
    };
  }) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <BarChart3 className="text-emerald-500 flex-shrink-0" size={22} />
            Polling Center Statistics
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Overview and analytics of polling centers
          </p>
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={YEAR_OPTIONS}
            value={searchParams.year || ''}
            onChange={(e) => updateYear(e.target.value)}
          />
        </div>
      </div>

      {stats ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Total Centers"
              value={stats.total_centers}
              icon={<MapPin size={24} />}
            />
            <StatCard
              title="Total Provinces"
              value={stats.total_provinces}
              icon={<Building2 size={24} />}
            />
            <StatCard
              title="Total Districts"
              value={stats.total_districts}
              icon={<Building2 size={24} />}
            />
            <StatCard
              title="Total Constituencies"
              value={stats.total_constituencies}
              icon={<Vote size={24} />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card title="Centers by Province" icon={<BarChart3 size={18} />}>
              {provinceChartData.length > 0 ? (
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div style={{ minWidth: calcMinWidth(provinceChartData.length, 100) }}>
                    <BarChart
                      data={provinceChartData}
                      xKey="name"
                      yKey="centers"
                      height={300}
                      showValues
                      xTickAngle={-30}
                      xTickFormatter={(v) => (typeof v === 'string' && v.length > 15 ? v.substring(0, 15) + '...' : v)}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </Card>

            <Card title="Distribution by Province" icon={<MapPin size={18} />}>
              {provincePieData.length > 0 ? (
                <DonutChart
                  data={provincePieData}
                  height={300}
                  showLabels
                />
              ) : (
                <div className="h-[350px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </Card>
          </div>

          {/* Province Breakdown Table */}
          <Card title="Province Breakdown" icon={<Building2 size={20} />}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Province</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Districts</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Constituencies</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Centers</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.province_breakdown?.map((province, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{province.province}</p>
                          <p className="text-sm text-gray-500">{province.province_en}</p>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-300">
                        {province.districts_count}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-300">
                        {province.constituencies_count}
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-emerald-400 font-semibold">
                          {province.centers_count}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{
                                width: `${(province.centers_count / stats.total_centers) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-12">
                            {((province.centers_count / stats.total_centers) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Last Updated */}
          {stats.last_updated && (
            <Card>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar size={18} />
                <span className="text-sm">
                  Last Updated: {new Date(stats.last_updated).toLocaleString()}
                </span>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <BarChart3 className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No statistics available</p>
          </div>
        </Card>
      )}
    </div>
  );
}
