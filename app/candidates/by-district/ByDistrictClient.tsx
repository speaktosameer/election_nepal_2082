'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, ChevronDown, ChevronRight, User } from 'lucide-react';
import { Card, Select, Badge } from '@/components/ui';
import { CandidatesByDistrictResponse } from '@/lib/types';

interface ByDistrictClientProps {
  data: CandidatesByDistrictResponse | null;
  searchParams: {
    district?: string;
    party?: string;
    gender?: string;
    sort?: string;
  };
}

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'पुरुष', label: 'Male (पुरुष)' },
  { value: 'महिला', label: 'Female (महिला)' },
];

const SORT_OPTIONS = [
  { value: 'serial_no', label: 'Sort by Serial No' },
  { value: 'candidate_name', label: 'Sort by Name' },
  { value: 'age', label: 'Sort by Age' },
  { value: 'party', label: 'Sort by Party' },
];

export function ByDistrictClient({ data, searchParams }: ByDistrictClientProps) {
  const router = useRouter();
  const [expandedDistricts, setExpandedDistricts] = useState<string[]>([]);
  const [expandedConstituencies, setExpandedConstituencies] = useState<string[]>([]);

  const toggleDistrict = (district: string) => {
    setExpandedDistricts((prev) =>
      prev.includes(district) ? prev.filter((d) => d !== district) : [...prev, district]
    );
  };

  const toggleConstituency = (key: string) => {
    setExpandedConstituencies((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    const current = { ...searchParams, [key]: value };
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/candidates/by-district?${params.toString()}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <Building2 className="text-emerald-500 flex-shrink-0" size={22} />
          Candidates by District
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">
          Hierarchical view: District → Constituency → Candidates
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4">
          <div className="sm:w-48">
            <Select
              label="Filter by Gender"
              options={GENDER_OPTIONS}
              value={searchParams.gender || ''}
              onChange={(e) => updateFilter('gender', e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Select
              label="Sort Candidates"
              options={SORT_OPTIONS}
              value={searchParams.sort || 'serial_no'}
              onChange={(e) => updateFilter('sort', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* District Groups */}
      {data && data.data.length > 0 ? (
        <div className="space-y-4">
          {data.data.map((district) => (
            <Card key={district.district} className="overflow-hidden">
              {/* District Level */}
              <button
                onClick={() => toggleDistrict(district.district)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-800/50 transition-colors gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {expandedDistricts.includes(district.district) ? (
                    <ChevronDown className="text-emerald-500 flex-shrink-0" size={18} />
                  ) : (
                    <ChevronRight className="text-gray-500 flex-shrink-0" size={18} />
                  )}
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-white">{district.district}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-7 sm:ml-0 flex-wrap">
                  <Badge variant="info" className="text-xs">{district.constituencies_count} Const.</Badge>
                  <Badge variant="success" className="text-xs">{district.total_candidates} Candidates</Badge>
                </div>
              </button>

              {/* Constituencies */}
              {expandedDistricts.includes(district.district) && (
                <div className="border-t border-gray-700">
                  {district.constituencies.map((constituency) => {
                    const constKey = `${district.district}-${constituency.constituency}`;
                    return (
                      <div key={constKey} className="border-b border-gray-800 last:border-0">
                        <button
                          onClick={() => toggleConstituency(constKey)}
                          className="w-full flex items-center justify-between p-4 pl-12 hover:bg-gray-800/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {expandedConstituencies.includes(constKey) ? (
                              <ChevronDown className="text-emerald-400" size={18} />
                            ) : (
                              <ChevronRight className="text-gray-500" size={18} />
                            )}
                            <span className="font-medium text-white">
                              Constituency {constituency.constituency}
                            </span>
                          </div>
                          <Badge variant="default">
                            {constituency.candidate_count} Candidates
                          </Badge>
                        </button>

                        {/* Candidates */}
                        {expandedConstituencies.includes(constKey) && (
                          <div className="pl-20 pr-4 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {constituency.candidates.map((candidate) => (
                                <div
                                  key={candidate.serial_no}
                                  className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-lg"
                                >
                                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <User size={18} className="text-gray-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">
                                      {candidate.candidate_name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {candidate.party}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-sm text-gray-400">
                                      Age: {candidate.age}
                                    </span>
                                    <Badge
                                      variant={candidate.gender === 'पुरुष' ? 'info' : 'success'}
                                      className="text-xs"
                                    >
                                      {candidate.gender === 'पुरुष' ? 'M' : 'F'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
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
