'use client';

import { useRouter } from 'next/navigation';
import { Users, TrendingUp } from 'lucide-react';
import { Card, StatCard, Input, Badge } from '@/components/ui';
import { DonutChart, BarChart } from '@/components/charts';
import { CandidatesByGenderResponse } from '@/lib/types';

interface ByGenderClientProps {
  data: CandidatesByGenderResponse | null;
  searchParams: {
    district?: string;
    party?: string;
  };
}

export function ByGenderClient({ data, searchParams }: ByGenderClientProps) {
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    const current = { ...searchParams, [key]: value };
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/candidates/by-gender?${params.toString()}`);
  };

  const genderPieData = data?.summary?.map((s) => ({
    name: s.gender === 'पुरुष' ? 'Male (पुरुष)' : 'Female (महिला)',
    value: s.total_candidates,
    color: s.gender === 'पुरुष' ? '#3b82f6' : '#ec4899',
  })) || [];

  // Deduplicate gender pie data to avoid duplicate legend labels
  const dedupGenderPieData = (() => {
    const map = new Map<string, { name: string; value: number; color?: string }>();
    for (const item of genderPieData) {
      const existing = map.get(item.name);
      if (existing) {
        existing.value += item.value;
      } else {
        map.set(item.name, { ...item });
      }
    }
    return Array.from(map.values());
  })();

  const districtChartData = data?.by_district?.slice(0, 15).map((d) => {
    const maleCount = d.gender_distribution['पुरुष']?.count || 0;
    const femaleCount = d.gender_distribution['महिला']?.count || 0;
    return {
      name: d.district.length > 12 ? d.district.substring(0, 12) + '...' : d.district,
      male: maleCount,
      female: femaleCount,
    };
  }) || [];

  const ageGroupChartData = data?.by_age_group?.map((ag) => ({
    name: ag.age_group,
    male: ag.gender_distribution['पुरुष'] || 0,
    female: ag.gender_distribution['महिला'] || 0,
  })) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Users className="text-emerald-500 flex-shrink-0" size={22} />
            Gender Analysis
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Candidate gender distribution and demographics
          </p>
        </div>
        {data && (
          <Badge variant="success" className="text-xs sm:text-sm self-start">
            {data.total_candidates} Total Candidates
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Input
              label="Filter by District"
              placeholder="Enter district..."
              value={searchParams.district || ''}
              onChange={(e) => updateFilter('district', e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Filter by Party"
              placeholder="Enter party..."
              value={searchParams.party || ''}
              onChange={(e) => updateFilter('party', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {data ? (
        <>
          {/* Summary Stats */}
          {data.summary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {data.summary.map((s) => (
                <StatCard
                  key={s.gender}
                  title={s.gender === 'पुरुष' ? 'Male Candidates' : 'Female Candidates'}
                  value={s.total_candidates}
                  icon={<Users size={24} />}
                />
              ))}
              <StatCard
                title="Total Candidates"
                value={data.total_candidates}
                icon={<TrendingUp size={24} />}
              />
              <StatCard
                title="Gender Ratio"
                value={`${((genderPieData[0]?.value || 0) / (data.total_candidates || 1) * 100).toFixed(1)}% M`}
                icon={<Users size={24} />}
              />
            </div>
          )}

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card title="Overall Gender Distribution" icon={<Users size={18} />}>
              {genderPieData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <DonutChart data={dedupGenderPieData} height={240} showLabels showLegend={false} />
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
                    {dedupGenderPieData.map((item, idx) => (
                      <div key={`${item.name}-${idx}`} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-300">
                          {item.name}: {item.value}
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

            <Card title="Gender by Age Group" icon={<TrendingUp size={20} />}>
              {ageGroupChartData.length > 0 ? (
                <BarChart
                  data={ageGroupChartData}
                  xKey="name"
                  yKey="male"
                  yKey2="female"
                  height={300}
                  colors={['#3b82f6', '#ec4899']}
                  showLegend
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </Card>
          </div>

          {/* Gender by District Chart */}
          {districtChartData.length > 0 && (
            <Card title="Gender Distribution by District" icon={<Users size={20} />}>
              <BarChart
                data={districtChartData}
                xKey="name"
                yKey="male"
                yKey2="female"
                height={350}
                colors={['#3b82f6', '#ec4899']}
                showLegend
              />
            </Card>
          )}

          {/* Summary Cards */}
          {data.summary && data.summary.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.summary.map((s) => (
                <Card
                  key={s.gender}
                  title={s.gender === 'पुरुष' ? 'Male Candidates' : 'Female Candidates'}
                  icon={<Users size={20} />}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-white">
                          {s.total_candidates}
                        </p>
                        <p className="text-sm text-gray-400">Total</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-400">
                          {s.avg_age}
                        </p>
                        <p className="text-sm text-gray-400">Avg Age</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-400">
                          {s.districts_represented}
                        </p>
                        <p className="text-sm text-gray-400">Districts</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-400">
                          {s.parties_represented}
                        </p>
                        <p className="text-sm text-gray-400">Parties</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Party Gender Breakdown */}
          {data.by_party && data.by_party.length > 0 && (
            <Card title="Gender by Party" icon={<Users size={20} />}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                        Party
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Male
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Female
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Total
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">
                        Female %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.by_party.slice(0, 20).map((party, index) => {
                      const male = party.gender_distribution['पुरुष'] || 0;
                      const female = party.gender_distribution['महिला'] || 0;
                      const total = male + female;
                      const femalePercent = total > 0 ? ((female / total) * 100).toFixed(1) : '0';
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-white">
                            {party.party.length > 40
                              ? party.party.substring(0, 40) + '...'
                              : party.party}
                          </td>
                          <td className="text-right py-3 px-4 text-blue-400">{male}</td>
                          <td className="text-right py-3 px-4 text-pink-400">{female}</td>
                          <td className="text-right py-3 px-4 text-gray-300">{total}</td>
                          <td className="text-right py-3 px-4">
                            <Badge
                              variant={parseFloat(femalePercent) >= 33 ? 'success' : 'warning'}
                            >
                              {femalePercent}%
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No data available</p>
          </div>
        </Card>
      )}
    </div>
  );
}
