'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Card, Select, Badge } from '@/components/ui';
import { PollingCentersByProvinceResponse } from '@/lib/types';

interface ByProvinceClientProps {
  data: PollingCentersByProvinceResponse | null;
  searchParams: {
    province?: string;
    district?: string;
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

export function ByProvinceClient({ data, searchParams }: ByProvinceClientProps) {
  const router = useRouter();
  const [expandedProvinces, setExpandedProvinces] = useState<string[]>([]);
  const [expandedDistricts, setExpandedDistricts] = useState<string[]>([]);
  const [expandedConstituencies, setExpandedConstituencies] = useState<string[]>([]);

  const toggleProvince = (province: string) => {
    setExpandedProvinces((prev) =>
      prev.includes(province) ? prev.filter((p) => p !== province) : [...prev, province]
    );
  };

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
    if (key === 'province' && value) params.set('province', value);
    if (key === 'district' && value) params.set('district', value);
    if (key !== 'province' && searchParams.province) params.set('province', searchParams.province);
    router.push(`/polling-centers/by-province?${params.toString()}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <Building2 className="text-emerald-500 flex-shrink-0" size={22} />
          Polling Centers by Province
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">
          Hierarchical view: Province → District → Constituency
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="w-full sm:w-64">
          <Select
            label="Filter by Province"
            options={PROVINCES}
            value={searchParams.province || ''}
            onChange={(e) => updateFilter('province', e.target.value)}
          />
        </div>
      </Card>

      {/* Hierarchical Data */}
      {data && data.data.length > 0 ? (
        <div className="space-y-4">
          {data.data.map((province) => (
            <Card key={province.province} className="overflow-hidden">
              {/* Province Level */}
              <button
                onClick={() => toggleProvince(province.province)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-800/50 transition-colors gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {expandedProvinces.includes(province.province) ? (
                    <ChevronDown className="text-emerald-500 flex-shrink-0" size={18} />
                  ) : (
                    <ChevronRight className="text-gray-500 flex-shrink-0" size={18} />
                  )}
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-white">{province.province}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">{province.province_en}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-7 sm:ml-0 flex-wrap">
                  <Badge variant="default" className="text-xs">{province.districts_count} Dist.</Badge>
                  <Badge variant="info" className="text-xs">{province.constituencies_count} Const.</Badge>
                  <Badge variant="success" className="text-xs">{province.total_centers} Centers</Badge>
                </div>
              </button>

              {/* District Level */}
              {expandedProvinces.includes(province.province) && (
                <div className="border-t border-gray-700">
                  {province.districts.map((district) => (
                    <div key={district.district} className="border-b border-gray-800 last:border-0">
                      <button
                        onClick={() => toggleDistrict(`${province.province}-${district.district}`)}
                        className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 pl-8 sm:pl-12 hover:bg-gray-800/30 transition-colors gap-2"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          {expandedDistricts.includes(`${province.province}-${district.district}`) ? (
                            <ChevronDown className="text-emerald-400 flex-shrink-0" size={16} />
                          ) : (
                            <ChevronRight className="text-gray-500 flex-shrink-0" size={16} />
                          )}
                          <div className="text-left">
                            <p className="font-medium text-white text-sm sm:text-base">{district.district}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{district.district_en}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm ml-7 sm:ml-0">
                          <span className="text-gray-400">
                            {district.constituencies_count} Const.
                          </span>
                          <Badge variant="success" className="text-xs">
                            {district.total_centers} Centers
                          </Badge>
                        </div>
                      </button>

                      {/* Constituency Level */}
                      {expandedDistricts.includes(`${province.province}-${district.district}`) && (
                        <div className="bg-gray-800/20">
                          {district.constituencies.map((constituency) => {
                            const constKey = `${district.district}-${constituency.constituency}`;
                            return (
                              <div key={constKey} className="border-t border-gray-800/50">
                                <button
                                  onClick={() => toggleConstituency(constKey)}
                                  className="w-full flex items-center justify-between p-3 pl-20 hover:bg-gray-800/30 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {expandedConstituencies.includes(constKey) ? (
                                      <ChevronDown className="text-emerald-300" size={16} />
                                    ) : (
                                      <ChevronRight className="text-gray-500" size={16} />
                                    )}
                                    <span className="text-gray-300">
                                      Constituency {constituency.constituency}
                                    </span>
                                  </div>
                                  <Badge variant="default" className="text-xs">
                                    {constituency.center_count} Centers
                                  </Badge>
                                </button>

                                {/* Centers */}
                                {expandedConstituencies.includes(constKey) && (
                                  <div className="pl-28 pr-4 pb-4 space-y-2">
                                    {constituency.centers.map((center) => (
                                      <div
                                        key={center.id}
                                        className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg"
                                      >
                                        <div className="flex items-center gap-3">
                                          <MapPin size={16} className="text-emerald-500" />
                                          <span className="text-white">{center.filename || "Polling Center"}</span>
                                        </div>
                                        {center.url && (
                                          <a
                                            href={center.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm"
                                          >
                                            <FileText size={14} />
                                            <span>PDF</span>
                                            <ExternalLink size={12} />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
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
