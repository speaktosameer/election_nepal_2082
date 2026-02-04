'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import {
  MapPin,
  Search,
  FileText,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Card, SearchInput, Select, Button, Badge, Pagination } from '@/components/ui';
import { PollingCentersResponse, ConstituenciesListResponse } from '@/lib/types';

interface PollingCentersClientProps {
  initialData: PollingCentersResponse | null;
  constituenciesList: ConstituenciesListResponse | null;
  currentPage: number;
  searchParams: {
    search?: string;
    province?: string;
    district?: string;
    constituency?: string;
    sort?: string;
    order?: string;
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

export function PollingCentersClient({
  initialData,
  constituenciesList,
  currentPage,
  searchParams,
}: PollingCentersClientProps) {
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

      router.push(`/polling-centers?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = () => {
    updateParams({ search, page: '1' });
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

  const constituencyOptions = [
    { value: '', label: 'All Constituencies' },
    ...(constituenciesList?.constituencies?.map((c) => ({
      value: c.toString(),
      label: `Constituency ${c}`,
    })) || []),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <MapPin className="text-emerald-500 flex-shrink-0" size={22} />
            Polling Centers
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Browse and search all polling center locations
          </p>
        </div>
        {initialData && (
          <Badge variant="success" className="text-xs sm:text-sm self-start">
            {initialData.total.toLocaleString()} Total Centers
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <SearchInput
              placeholder="Search by district, province..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <Select
              options={PROVINCES}
              value={searchParams.province || ''}
              onChange={(e) => updateParams({ province: e.target.value, page: '1' })}
            />
            <Select
              options={districtOptions}
              value={searchParams.district || ''}
              onChange={(e) => updateParams({ district: e.target.value, page: '1' })}
            />
          </div>
          <Button onClick={handleSearch} leftIcon={<Search size={16} />} className="w-full">
            Search
          </Button>
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
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-1">
                        ID <SortIcon field="id" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort('province')}
                    >
                      <div className="flex items-center gap-1">
                        Province <SortIcon field="province" />
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialData.data.map((center, index) => (
                    <tr
                      key={center.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-mono font-semibold">
                          {center.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white">{center.province}</p>
                          <p className="text-sm text-gray-500">{center.province_en}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white">{center.district}</p>
                          <p className="text-sm text-gray-500">{center.district_en}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="info">{center.constituency}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {center.pdf_url ? (
                          <a
                            href={center.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <FileText size={16} />
                            <span className="text-sm">View PDF</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {initialData.data.map((center) => (
                <div
                  key={center.id}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                >
                  {/* Header with ID and Constituency */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400 font-mono font-semibold text-sm">
                      ID: {center.id}
                    </span>
                    <Badge variant="info" className="text-xs">{center.constituency}</Badge>
                  </div>
                  
                  {/* Location Details */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-500 block mb-0.5">Province</span>
                      <p className="text-white text-sm">{center.province}</p>
                      <p className="text-gray-500">{center.province_en}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">District</span>
                      <p className="text-white text-sm">{center.district}</p>
                      <p className="text-gray-500">{center.district_en}</p>
                    </div>
                  </div>
                  
                  {/* PDF Link */}
                  {center.pdf_url && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <a
                        href={center.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
                      >
                        <FileText size={14} />
                        <span>View PDF</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
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
            <MapPin className="mx-auto text-gray-600 mb-3 sm:mb-4" size={40} />
            <p className="text-gray-400 text-sm sm:text-base">No polling centers found</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
