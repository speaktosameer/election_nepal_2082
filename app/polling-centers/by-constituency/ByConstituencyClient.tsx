'use client';

import { useRouter } from 'next/navigation';
import { Vote, MapPin, FileText, ExternalLink } from 'lucide-react';
import { Card, Select, Badge } from '@/components/ui';
import { PollingCentersByConstituencyResponse } from '@/lib/types';

interface ByConstituencyClientProps {
  data: PollingCentersByConstituencyResponse | null;
  searchParams: {
    province?: string;
    district?: string;
    min_centers?: string;
    sort?: string;
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

const MIN_CENTERS_OPTIONS = [
  { value: '1', label: 'Min 1 Center' },
  { value: '2', label: 'Min 2 Centers' },
  { value: '3', label: 'Min 3 Centers' },
  { value: '5', label: 'Min 5 Centers' },
];

export function ByConstituencyClient({ data, searchParams }: ByConstituencyClientProps) {
  const router = useRouter();

  const updateFilter = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    const current = { ...searchParams, ...updates };
    Object.entries(current).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/polling-centers/by-constituency?${params.toString()}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <Vote className="text-emerald-500 flex-shrink-0" size={22} />
          Polling Centers by Constituency
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">
          View polling centers grouped by electoral constituencies
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4">
          <div className="sm:w-64">
            <Select
              label="Filter by Province"
              options={PROVINCES}
              value={searchParams.province || ''}
              onChange={(e) => updateFilter({ province: e.target.value })}
            />
          </div>
          <div className="sm:w-48">
            <Select
              label="Min Centers"
              options={MIN_CENTERS_OPTIONS}
              value={searchParams.min_centers || '1'}
              onChange={(e) => updateFilter({ min_centers: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Constituency Cards */}
      {data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {data.data.map((item, index) => (
            <Card
              key={`${item.district}-${item.constituency}-${index}`}
              className="hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">
                      {item.district}
                    </h3>
                    <Badge variant="info">Constituency {item.constituency}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.district_en} • {item.province_en}
                  </p>
                </div>
                <Badge variant="success" className="text-lg px-3 py-1">
                  {item.center_count}
                </Badge>
              </div>

              {/* Centers List */}
              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-400">Polling Centers:</p>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {item.centers.map((center) => (
                    <div
                      key={center.id}
                      className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-500" />
                        <span className="text-sm text-white font-mono">{center.id}</span>
                      </div>
                      {center.pdf_url && (
                        <a
                          href={center.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs"
                        >
                          <FileText size={12} />
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Vote className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No constituencies found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        </Card>
      )}
    </div>
  );
}
