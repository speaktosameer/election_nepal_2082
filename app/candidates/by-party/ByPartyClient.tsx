'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flag, Users, ChevronDown, ChevronRight, User } from 'lucide-react';
import { Card, Select, Badge, Input } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/charts';
import { CandidatesByPartyResponse } from '@/lib/types';

interface ByPartyClientProps {
  data: CandidatesByPartyResponse | null;
  searchParams: {
    party?: string;
    gender?: string;
    min_candidates?: string;
    sort?: string;
  };
}

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'पुरुष', label: 'Male (पुरुष)' },
  { value: 'महिला', label: 'Female (महिला)' },
];

const MIN_CANDIDATES_OPTIONS = [
  { value: '1', label: 'Min 1 Candidate' },
  { value: '2', label: 'Min 2 Candidates' },
  { value: '5', label: 'Min 5 Candidates' },
  { value: '10', label: 'Min 10 Candidates' },
];

const SORT_OPTIONS = [
  { value: 'candidate_count', label: 'Sort by Count' },
  { value: 'party_name', label: 'Sort by Name' },
  { value: 'avg_age', label: 'Sort by Avg Age' },
];

export function ByPartyClient({ data, searchParams }: ByPartyClientProps) {
  const router = useRouter();
  const [expandedParties, setExpandedParties] = useState<string[]>([]);

  const toggleParty = (party: string) => {
    setExpandedParties((prev) =>
      prev.includes(party) ? prev.filter((p) => p !== party) : [...prev, party]
    );
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    const current = { ...searchParams, [key]: value };
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/candidates/by-party?${params.toString()}`);
  };

  const partyChartData = data?.data.slice(0, 10).map((p) => ({
    name: p.party.length > 15 ? p.party.substring(0, 15) + '...' : p.party,
    candidates: p.candidate_count,
  })) || [];

  const genderChartData = data?.data.reduce(
    (acc, party) => {
      acc[0].value += party.demographics.male_count;
      acc[1].value += party.demographics.female_count;
      return acc;
    },
    [
      { name: 'Male', value: 0, color: '#3b82f6' },
      { name: 'Female', value: 0, color: '#ec4899' },
    ]
  ) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Flag className="text-emerald-500 flex-shrink-0" size={22} />
            Candidates by Party
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Political party analysis with demographics
          </p>
        </div>
        {data && (
          <Badge variant="success" className="text-xs sm:text-sm self-start">
            {data.total_parties} Political Parties
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:w-64">
            <Input
              label="Search Party"
              placeholder="Filter by party..."
              value={searchParams.party || ''}
              onChange={(e) => updateFilter('party', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:contents lg:contents">
            <div className="lg:w-40">
              <Select
                label="Gender"
                options={GENDER_OPTIONS}
                value={searchParams.gender || ''}
                onChange={(e) => updateFilter('gender', e.target.value)}
              />
            </div>
            <div className="lg:w-40">
              <Select
                label="Min Cand."
                options={MIN_CANDIDATES_OPTIONS}
                value={searchParams.min_candidates || '1'}
                onChange={(e) => updateFilter('min_candidates', e.target.value)}
              />
            </div>
            <div className="lg:w-40">
              <Select
                label="Sort By"
                options={SORT_OPTIONS}
                value={searchParams.sort || 'candidate_count'}
                onChange={(e) => updateFilter('sort', e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Charts */}
      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card title="Top Parties by Candidates" icon={<Flag size={18} />}>
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="min-w-[280px]">
                <BarChart
                  data={partyChartData}
                  xKey="name"
                  yKey="candidates"
                  height={260}
                  colors={['#10b981']}
                />
              </div>
            </div>
          </Card>
          <Card title="Overall Gender Distribution" icon={<Users size={18} />}>
            <DonutChart
              data={genderChartData}
              height={260}
              showLabels
            />
          </Card>
        </div>
      )}

      {/* Party Cards */}
      {data && data.data.length > 0 ? (
        <div className="space-y-4">
          {data.data.map((party) => (
            <Card key={party.party} className="overflow-hidden">
              {/* Party Header */}
              <button
                onClick={() => toggleParty(party.party)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-800/50 transition-colors gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {expandedParties.includes(party.party) ? (
                    <ChevronDown className="text-emerald-500 flex-shrink-0" size={18} />
                  ) : (
                    <ChevronRight className="text-gray-500 flex-shrink-0" size={18} />
                  )}
                  <div className="text-left min-w-0">
                    <h3 className="text-sm sm:text-lg font-semibold text-white truncate">{party.party}</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {party.districts_count} Dist.
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">•</span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {party.constituencies_count} Const.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-7 sm:ml-0">
                  <Badge variant="success" className="text-xs">{party.candidate_count} Cand.</Badge>
                  <Badge variant="info" className="text-xs">
                    Avg: {party.demographics.avg_age}
                  </Badge>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <span className="text-blue-400">♂ {party.demographics.male_count}</span>
                    <span className="text-pink-400">♀ {party.demographics.female_count}</span>
                  </div>
                </div>
              </button>

              {/* Candidates List */}
              {expandedParties.includes(party.party) && (
                <div className="border-t border-gray-700 p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-72 sm:max-h-96 overflow-y-auto">
                    {party.candidates.map((candidate, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-800/40 rounded-lg"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs sm:text-sm font-medium truncate">
                            {candidate.candidate_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {candidate.district} - {candidate.constituency}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400">{candidate.age}</span>
                          <Badge
                            variant={candidate.gender === 'पुरुष' ? 'info' : 'success'}
                            className="text-xs px-1.5"
                          >
                            {candidate.gender === 'पुरुष' ? 'M' : 'F'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Flag className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No parties found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        </Card>
      )}
    </div>
  );
}
