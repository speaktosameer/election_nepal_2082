'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import {
  Users,
  Search,
  ChevronUp,
  ChevronDown,
  User,
} from 'lucide-react';
import { Card, SearchInput, Select, Button, Badge, Pagination } from '@/components/ui';
import { CandidatesResponse, ConstituenciesListResponse } from '@/lib/types';

interface CandidatesClientProps {
  initialData: CandidatesResponse | null;
  constituenciesList: ConstituenciesListResponse | null;
  currentPage: number;
  searchParams: {
    search?: string;
    district?: string;
    constituency?: string;
    party?: string;
    gender?: string;
    age_min?: string;
    age_max?: string;
    sort?: string;
    order?: string;
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
  { value: '30-40', label: '30-40 Years' },
  { value: '40-50', label: '40-50 Years' },
  { value: '50-60', label: '50-60 Years' },
  { value: '60+', label: '60+ Years' },
];

export function CandidatesClient({
  initialData,
  constituenciesList,
  currentPage,
  searchParams,
}: CandidatesClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.search || '');

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const currentParams = { ...searchParams, ...updates };

      Object.entries(currentParams).forEach(([key, value]) => {
        if (value && key !== 'page') {
          params.set(key, value);
        }
      });

      if (updates.page) {
        params.set('page', updates.page);
      }

      router.push(`/candidates?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = () => {
    updateParams({ search, page: '1' });
  };

  const handleAgeRange = (range: string) => {
    if (!range) {
      updateParams({ age_min: undefined, age_max: undefined, page: '1' });
      return;
    }
    
    const [min, max] = range.split('-');
    if (range === '60+') {
      updateParams({ age_min: '60', age_max: undefined, page: '1' });
    } else {
      updateParams({ age_min: min, age_max: max, page: '1' });
    }
  };

  const handleSort = (field: string) => {
    const newOrder =
      searchParams.sort === field && searchParams.order !== 'desc' ? 'desc' : 'asc';
    updateParams({ sort: field, order: newOrder, page: '1' });
  };

  const totalPages = initialData ? Math.ceil(initialData.total / initialData.limit) : 0;

  const SortIcon = ({ field }: { field: string }) => {
    if (searchParams.sort !== field) return null;
    return searchParams.order === 'desc' ? (
      <ChevronDown size={16} />
    ) : (
      <ChevronUp size={16} />
    );
  };

  const districtOptions = [
    { value: '', label: 'All Districts' },
    ...(constituenciesList?.districts?.map((d) => ({ value: d, label: d })) || []),
  ];

  const getCurrentAgeRange = () => {
    if (searchParams.age_min === '60') return '60+';
    if (searchParams.age_min && searchParams.age_max) {
      return `${searchParams.age_min}-${searchParams.age_max}`;
    }
    return '';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Users className="text-emerald-500 flex-shrink-0" size={22} />
            Election Candidates
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Browse and search all registered candidates
          </p>
        </div>
        {initialData && (
          <Badge variant="success" className="text-xs sm:text-sm self-start">
            {initialData.total.toLocaleString()} Total Candidates
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-6 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <SearchInput
              placeholder="Search by name, party..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <Select
              options={districtOptions}
              value={searchParams.district || ''}
              onChange={(e) => updateParams({ district: e.target.value, page: '1' })}
            />
            <Select
              options={GENDER_OPTIONS}
              value={searchParams.gender || ''}
              onChange={(e) => updateParams({ gender: e.target.value, page: '1' })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <Select
              options={AGE_RANGE_OPTIONS}
              value={getCurrentAgeRange()}
              onChange={(e) => handleAgeRange(e.target.value)}
            />
            <Button onClick={handleSearch} leftIcon={<Search size={16} />} className="w-full">
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {initialData && initialData.data.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort('serial_no')}
                    >
                      <div className="flex items-center gap-1">
                        # <SortIcon field="serial_no" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort('candidate_name')}
                    >
                      <div className="flex items-center gap-1">
                        Candidate <SortIcon field="candidate_name" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort('party')}
                    >
                      <div className="flex items-center gap-1">
                        Party <SortIcon field="party" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort('district')}
                    >
                      <div className="flex items-center gap-1">
                        District <SortIcon field="district" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort('constituency')}
                    >
                      <div className="flex items-center gap-1">
                        Constituency <SortIcon field="constituency" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort('age')}
                    >
                      <div className="flex items-center gap-1">
                        Age <SortIcon field="age" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                      Gender
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialData.data.map((candidate) => (
                    <tr
                      key={candidate.serial_no}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-mono font-semibold">
                          {candidate.serial_no}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <span className="text-white font-medium">
                            {candidate.candidate_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default" className="text-xs">
                          {candidate.party.length > 25
                            ? candidate.party.substring(0, 25) + '...'
                            : candidate.party}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{candidate.district}</td>
                      <td className="py-3 px-4">
                        <Badge variant="info">{candidate.constituency}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{candidate.age}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={candidate.gender === 'पुरुष' ? 'info' : 'success'}
                        >
                          {candidate.gender}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {initialData.data.map((candidate) => (
                <div
                  key={candidate.serial_no}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                >
                  {/* Header with name and serial */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm truncate">
                        {candidate.candidate_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-emerald-400 font-mono text-xs">#{candidate.serial_no}</span>
                        <Badge
                          variant={candidate.gender === 'पुरुष' ? 'info' : 'success'}
                          className="text-xs"
                        >
                          {candidate.gender}
                        </Badge>
                        <span className="text-gray-400 text-xs">Age: {candidate.age}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Party</span>
                      <Badge variant="default" className="text-xs max-w-[60%] truncate">
                        {candidate.party}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">District</span>
                      <span className="text-gray-300">{candidate.district}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Constituency</span>
                      <Badge variant="info" className="text-xs">{candidate.constituency}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateParams({ page: page.toString() })}
              />
              <p className="text-xs sm:text-sm text-gray-400 text-center">
                Showing {initialData.offset + 1} to{' '}
                {Math.min(initialData.offset + initialData.limit, initialData.total)} of{' '}
                {initialData.total} results
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Users className="mx-auto text-gray-600 mb-3 sm:mb-4" size={40} />
            <p className="text-gray-400 text-sm sm:text-base">No candidates found</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
