'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, Users, Building2, Flag, Vote, Calendar } from 'lucide-react';
import { Card, StatCard, Select, Badge } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/charts';
import { ElectionStatsResponse } from '@/lib/types';

interface StatsClientProps {
  stats: ElectionStatsResponse | null;
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
    router.push(`/candidates/stats?${params.toString()}`);
  };

  const genderPieData = stats?.gender_distribution
    ? Object.entries(stats.gender_distribution).map(([name, value]) => ({
        name: name === 'पुरुष' ? 'Male (पुरुष)' : 'Female (महिला)',
        value: value as number,
        color: name === 'पुरुष' ? '#3b82f6' : '#ec4899',
      }))
    : [];

  const partyChartData = stats?.top_parties?.slice(0, 10).map((p) => ({
    name: p.party.length > 15 ? p.party.substring(0, 15) + '...' : p.party,
    candidates: p.candidate_count,
  })) || [];

  const districtChartData = stats?.districts_summary?.slice(0, 15).map((d) => ({
    name: d.district.length > 12 ? d.district.substring(0, 12) + '...' : d.district,
    candidates: d.candidates,
    constituencies: d.constituencies,
  })) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <BarChart3 className="text-emerald-500 flex-shrink-0" size={22} />
            Election Statistics
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Comprehensive election data overview
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
          {/* Main Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Total Candidates"
              value={stats.total_candidates}
              icon={<Users size={24} />}
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
            <StatCard
              title="Total Parties"
              value={stats.total_parties}
              icon={<Flag size={24} />}
            />
          </div>

          {/* Age Stats */}
          {stats.age_stats && (
            <Card title="Age Statistics" icon={<Calendar size={18} />}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                    {stats.age_stats.average}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Average Age</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {stats.age_stats.median}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Median Age</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    {stats.age_stats.youngest}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Youngest</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-400">
                    {stats.age_stats.oldest}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Oldest</p>
                </div>
              </div>
            </Card>
          )}

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card title="Gender Distribution" icon={<Users size={18} />}>
              {genderPieData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <DonutChart data={genderPieData} height={240} showLabels />
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
                    {genderPieData.map((item, idx) => (
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

            <Card title="Top Political Parties" icon={<Flag size={18} />}>
              {partyChartData.length > 0 ? (
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="min-w-[300px]">
                    <BarChart
                      data={partyChartData}
                      xKey="name"
                      yKey="candidates"
                      height={280}
                      colors={['#10b981']}
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

          {/* Districts Chart */}
          {districtChartData.length > 0 && (
            <Card title="Candidates by District" icon={<Building2 size={18} />}>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="min-w-[300px]">
                  <BarChart
                    data={districtChartData}
                    xKey="name"
                    yKey="candidates"
                    height={300}
                    colors={['#10b981']}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Districts Table */}
          {stats.districts_summary && stats.districts_summary.length > 0 && (
            <Card title="District Summary" icon={<Building2 size={20} />}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                        District
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Constituencies
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Candidates
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Avg per Constituency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.districts_summary.map((district, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-white font-medium">
                          {district.district}
                        </td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="info">{district.constituencies}</Badge>
                        </td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="success">{district.candidates}</Badge>
                        </td>
                        <td className="text-right py-3 px-4 text-gray-300">
                          {(district.candidates / district.constituencies).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Top Parties Table */}
          {stats.top_parties && stats.top_parties.length > 0 && (
            <Card title="All Parties Ranking" icon={<Flag size={20} />}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                        Rank
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                        Party
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Candidates
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_parties.map((party, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="text-emerald-400 font-mono font-semibold">
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white">{party.party}</td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="success">{party.candidate_count}</Badge>
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{
                                  width: `${(party.candidate_count / stats.total_candidates) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-12">
                              {((party.candidate_count / stats.total_candidates) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
