'use client';

import Link from 'next/link';
import {
  MapPin,
  Users,
  Building2,
  FileText,
  Vote,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { StatCard, Card } from '@/components/ui';
import { BarChart, DonutChart, AreaChart } from '@/components/charts';
import { PollingCenterStatsResponse, ElectionStatsResponse } from '@/lib/types';

interface DashboardClientProps {
  pollingStats: PollingCenterStatsResponse | null;
  electionStats: ElectionStatsResponse | null;
}

export function DashboardClient({ pollingStats, electionStats }: DashboardClientProps) {
  // Prepare chart data
  const provinceChartData = pollingStats?.province_breakdown?.map((p) => ({
    name: p.province_en || p.province,
    centers: p.centers_count,
    districts: p.districts_count,
    constituencies: p.constituencies_count,
  })) || [];

  const genderChartData = electionStats?.gender_distribution
    ? Object.entries(electionStats.gender_distribution).map(([name, value]) => ({
        name: name === 'पुरुष' ? 'Male (पुरुष)' : 'Female (महिला)',
        value: value as number,
        color: name === 'पुरुष' ? '#3b82f6' : '#ec4899',
      }))
    : [];

  // Deduplicate gender data by name to avoid duplicate legend labels
  const dedupGenderChartData = (() => {
    const map = new Map<string, { name: string; value: number; color?: string }>();
    for (const item of genderChartData) {
      const existing = map.get(item.name);
      if (existing) {
        existing.value += item.value;
      } else {
        map.set(item.name, { ...item });
      }
    }
    return Array.from(map.values());
  })();

  const partyChartData = electionStats?.top_parties?.slice(0, 8).map((p) => ({
    name: p.party.length > 20 ? p.party.substring(0, 20) + '...' : p.party,
    candidates: p.candidate_count,
  })) || [];

  const districtChartData = electionStats?.districts_summary?.slice(0, 10).map((d) => ({
    name: d.district.length > 15 ? d.district.substring(0, 15) + '...' : d.district,
    candidates: d.candidates,
    constituencies: d.constituencies,
  })) || [];

  const calcMinWidth = (count: number, per = 80) => `${Math.max(count * per, 300)}px`;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Nepal Election Commission - Data Overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <Vote className="text-emerald-500 flex-shrink-0" size={18} />
          <span>Election Year: {pollingStats?.election_year || 2082}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Polling Centers"
          value={pollingStats?.total_centers || 0}
          icon={<MapPin size={24} />}
        />
        <StatCard
          title="Total Candidates"
          value={electionStats?.total_candidates || 0}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Total Districts"
          value={pollingStats?.total_districts || electionStats?.total_districts || 0}
          icon={<Building2 size={24} />}
        />
        <StatCard
          title="Total Parties"
          value={electionStats?.total_parties || 0}
          icon={<FileText size={24} />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Province Polling Centers Chart */}
            <Card title="Polling Centers by Province" icon={<MapPin size={18} />}>
          {provinceChartData.length > 0 ? (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div style={{ minWidth: calcMinWidth(provinceChartData.length, 80) }}>
                <BarChart
                  data={provinceChartData}
                  xKey="name"
                  yKey="centers"
                  height={280}
                  showValues
                  xTickAngle={-45}
                  xTickFormatter={(v) => (typeof v === 'string' && v.length > 12 ? v.substring(0, 12) + '...' : v)}
                />
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </Card>

        {/* Gender Distribution Chart */}
        <Card title="Candidate Gender Distribution" icon={<Users size={18} />}>
          {genderChartData.length > 0 ? (
            <div className="flex flex-col items-center">
              <DonutChart
                data={dedupGenderChartData}
                height={240}
                showLabels
                showLegend={false}
              />
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
                {dedupGenderChartData.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs sm:text-sm text-gray-300">
                      {item.name}: {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Parties Chart */}
        <Card title="Top Political Parties" icon={<TrendingUp size={18} />}>
          {partyChartData.length > 0 ? (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div style={{ minWidth: calcMinWidth(partyChartData.length, 80) }}>
                <BarChart
                  data={partyChartData}
                  xKey="name"
                  yKey="candidates"
                  height={280}
                  colors={['#10b981']}
                  showValues
                  xTickAngle={-45}
                  xTickFormatter={(v) => (typeof v === 'string' && v.length > 12 ? v.substring(0, 12) + '...' : v)}
                />
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </Card>

        {/* Districts Chart */}
        <Card title="Candidates by District" icon={<Building2 size={18} />}>
          {districtChartData.length > 0 ? (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div style={{ minWidth: calcMinWidth(districtChartData.length, 80) }}>
                <AreaChart
                  data={districtChartData}
                  xKey="name"
                  yKey="candidates"
                  height={280}
                  color="#10b981"
                  showValues
                  xTickAngle={-45}
                  xTickFormatter={(v) => (typeof v === 'string' && v.length > 12 ? v.substring(0, 12) + '...' : v)}
                />
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </Card>
      </div>

      {/* Age Statistics Card */}
      {electionStats?.age_stats && (
        <Card title="Candidate Age Statistics" icon={<Users size={18} />}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                {electionStats.age_stats.average}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Average Age</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                {electionStats.age_stats.median}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Median Age</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-green-400">
                {electionStats.age_stats.youngest}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Youngest</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-orange-400">
                {electionStats.age_stats.oldest}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Oldest</p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Link href="/polling-centers" className="group">
          <Card className="hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="p-2 sm:p-3 bg-emerald-500/10 rounded-lg flex-shrink-0">
                  <MapPin className="text-emerald-500" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Polling Centers</h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    Browse and search polling center locations
                  </p>
                </div>
              </div>
              <ArrowRight className="text-gray-500 group-hover:text-emerald-500 transition-colors flex-shrink-0" size={20} />
            </div>
          </Card>
        </Link>

        <Link href="/candidates" className="group">
          <Card className="hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="p-2 sm:p-3 bg-emerald-500/10 rounded-lg flex-shrink-0">
                  <Users className="text-emerald-500" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Candidates</h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    View candidate information and analytics
                  </p>
                </div>
              </div>
              <ArrowRight className="text-gray-500 group-hover:text-emerald-500 transition-colors flex-shrink-0" size={20} />
            </div>
          </Card>
        </Link>
      </div>

      {/* Province Breakdown Table */}
      {pollingStats?.province_breakdown && pollingStats.province_breakdown.length > 0 && (
        <Card title="Province Overview" icon={<Building2 size={18} />}>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Province</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Districts</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Constituencies</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Centers</th>
                </tr>
              </thead>
              <tbody>
                {pollingStats.province_breakdown.map((province, index) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {pollingStats.province_breakdown.map((province, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
              >
                <div className="mb-2">
                  <p className="text-white font-medium text-sm">{province.province}</p>
                  <p className="text-xs text-gray-500">{province.province_en}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-900/50 rounded p-2">
                    <p className="text-lg font-semibold text-gray-300">{province.districts_count}</p>
                    <p className="text-xs text-gray-500">Districts</p>
                  </div>
                  <div className="bg-gray-900/50 rounded p-2">
                    <p className="text-lg font-semibold text-gray-300">{province.constituencies_count}</p>
                    <p className="text-xs text-gray-500">Const.</p>
                  </div>
                  <div className="bg-gray-900/50 rounded p-2">
                    <p className="text-lg font-semibold text-emerald-400">{province.centers_count}</p>
                    <p className="text-xs text-gray-500">Centers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
