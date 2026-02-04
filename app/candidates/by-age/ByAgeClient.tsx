'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Users, TrendingUp, TrendingDown, User } from 'lucide-react';
import { Card, StatCard, Select, Badge } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/charts';
import { CandidatesByAgeResponse } from '@/lib/types';

interface ByAgeClientProps {
  data: CandidatesByAgeResponse | null;
  searchParams: {
    age_min?: string;
    age_max?: string;
    district?: string;
    party?: string;
    gender?: string;
  };
}

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'पुरुष', label: 'Male (पुरुष)' },
  { value: 'महिला', label: 'Female (महिला)' },
];

const AGE_RANGE_OPTIONS = [
  { value: '', label: 'All Ages' },
  { value: '18-30', label: '18-30 Years' },
  { value: '30-45', label: '30-45 Years' },
  { value: '45-60', label: '45-60 Years' },
  { value: '60+', label: '60+ Years' },
];

export function ByAgeClient({ data, searchParams }: ByAgeClientProps) {
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    const current = { ...searchParams };
    
    if (key === 'age_range') {
      if (!value) {
        delete current.age_min;
        delete current.age_max;
      } else if (value === '60+') {
        current.age_min = '60';
        delete current.age_max;
      } else {
        const [min, max] = value.split('-');
        current.age_min = min;
        current.age_max = max;
      }
    } else {
      if (value) {
        current[key as keyof typeof current] = value;
      } else {
        delete current[key as keyof typeof current];
      }
    }
    
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/candidates/by-age?${params.toString()}`);
  };

  const getCurrentAgeRange = () => {
    if (searchParams.age_min === '60' && !searchParams.age_max) return '60+';
    if (searchParams.age_min && searchParams.age_max) {
      return `${searchParams.age_min}-${searchParams.age_max}`;
    }
    return '';
  };

  const ageGroupChartData = data?.age_groups?.map((ag) => ({
    name: ag.age_group,
    candidates: ag.candidate_count,
    male: ag.male_count,
    female: ag.female_count,
  })) || [];

  const ageGroupPieData = data?.age_groups?.map((ag, index) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    return {
      name: ag.age_group,
      value: ag.candidate_count,
      color: colors[index % colors.length],
    };
  }) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <Calendar className="text-emerald-500 flex-shrink-0" size={22} />
          Age Analysis
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">
          Candidate age distribution and demographics
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4">
          <div className="sm:w-48">
            <Select
              label="Age Range"
              options={AGE_RANGE_OPTIONS}
              value={getCurrentAgeRange()}
              onChange={(e) => updateFilter('age_range', e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Select
              label="Gender"
              options={GENDER_OPTIONS}
              value={searchParams.gender || ''}
              onChange={(e) => updateFilter('gender', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {data ? (
        <>
          {/* Overall Stats */}
          {data.overall_stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard
                title="Total Candidates"
                value={data.overall_stats.total_candidates}
                icon={<Users size={24} />}
              />
              <StatCard
                title="Average Age"
                value={data.overall_stats.avg_age}
                icon={<Calendar size={24} />}
              />
              <StatCard
                title="Median Age"
                value={data.overall_stats.median_age}
                icon={<TrendingUp size={24} />}
              />
              <StatCard
                title="Youngest"
                value={data.overall_stats.youngest}
                icon={<TrendingDown size={24} />}
              />
              <StatCard
                title="Oldest"
                value={data.overall_stats.oldest}
                icon={<TrendingUp size={24} />}
              />
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Candidates by Age Group" icon={<Calendar size={20} />}>
              {ageGroupChartData.length > 0 ? (
                <BarChart
                  data={ageGroupChartData}
                  xKey="name"
                  yKey="candidates"
                  height={300}
                  colors={['#10b981']}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </Card>

            <Card title="Age Group Distribution" icon={<Users size={20} />}>
              {ageGroupPieData.length > 0 ? (
                <DonutChart data={ageGroupPieData} height={300} showLabels />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </Card>
          </div>

          {/* Gender by Age Group */}
          {ageGroupChartData.length > 0 && (
            <Card title="Gender Distribution by Age" icon={<Users size={20} />}>
              <BarChart
                data={ageGroupChartData}
                xKey="name"
                yKey="male"
                yKey2="female"
                height={300}
                colors={['#3b82f6', '#ec4899']}
                showLegend
              />
            </Card>
          )}

          {/* Age Group Cards */}
          {data.age_groups && data.age_groups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.age_groups.map((ag) => (
                <Card
                  key={ag.age_group}
                  title={`Age ${ag.age_group}`}
                  className="hover:border-emerald-500/30 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total</span>
                      <Badge variant="success">{ag.candidate_count}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Average Age</span>
                      <span className="text-white">{ag.avg_age}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-center p-2 bg-blue-500/10 rounded-lg">
                        <p className="text-blue-400 font-semibold">{ag.male_count}</p>
                        <p className="text-xs text-gray-500">Male</p>
                      </div>
                      <div className="flex-1 text-center p-2 bg-pink-500/10 rounded-lg">
                        <p className="text-pink-400 font-semibold">{ag.female_count}</p>
                        <p className="text-xs text-gray-500">Female</p>
                      </div>
                    </div>
                    {/* Gender bar */}
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-500 h-full"
                        style={{
                          width: `${(ag.male_count / ag.candidate_count) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-pink-500 h-full"
                        style={{
                          width: `${(ag.female_count / ag.candidate_count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Youngest and Oldest Candidates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Youngest */}
            {data.youngest_candidates && data.youngest_candidates.length > 0 && (
              <Card title="Youngest Candidates" icon={<TrendingDown size={20} />}>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {data.youngest_candidates.map((c, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-bold">{c.age}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{c.candidate_name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {c.district} • {c.party.length > 20 ? c.party.substring(0, 20) + '...' : c.party}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Oldest */}
            {data.oldest_candidates && data.oldest_candidates.length > 0 && (
              <Card title="Oldest Candidates" icon={<TrendingUp size={20} />}>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {data.oldest_candidates.map((c, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-400 font-bold">{c.age}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{c.candidate_name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {c.district} • {c.party.length > 20 ? c.party.substring(0, 20) + '...' : c.party}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No data available</p>
          </div>
        </Card>
      )}
    </div>
  );
}
