'use client';

import { useRouter } from 'next/navigation';
import { FileText, Download, ExternalLink, List, Grid } from 'lucide-react';
import { Card, Select, Button, Badge } from '@/components/ui';
import { PollingCenterPDFsResponse, PDFListItem, PDFGroupedItem } from '@/lib/types';

interface PDFsClientProps {
  data: PollingCenterPDFsResponse | null;
  searchParams: {
    province?: string;
    district?: string;
    constituency?: string;
    format?: 'list' | 'grouped';
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

function isPDFListItem(item: PDFListItem | PDFGroupedItem): item is PDFListItem {
  return 'pdf_url' in item;
}

export function PDFsClient({ data, searchParams }: PDFsClientProps) {
  const router = useRouter();
  const format = searchParams.format || 'list';

  const updateFilter = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    const current = { ...searchParams, ...updates };
    Object.entries(current).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/polling-centers/pdfs?${params.toString()}`);
  };

  const listData = data?.format === 'list' ? (data.data as PDFListItem[]) : [];
  const groupedData = data?.format === 'grouped' ? (data.data as PDFGroupedItem[]) : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <FileText className="text-emerald-500 flex-shrink-0" size={22} />
            PDF Documents
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Download polling center PDF documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={format === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => updateFilter({ format: 'list' })}
            leftIcon={<List size={14} />}
          >
            List
          </Button>
          <Button
            variant={format === 'grouped' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => updateFilter({ format: 'grouped' })}
            leftIcon={<Grid size={14} />}
          >
            Grouped
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="w-full sm:w-64">
          <Select
            label="Filter by Province"
            options={PROVINCES}
            value={searchParams.province || ''}
            onChange={(e) => updateFilter({ province: e.target.value })}
          />
        </div>
      </Card>

      {/* Content */}
      {format === 'list' && listData.length > 0 && (
        <Card>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">District</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Constituency</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Province</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {listData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-mono font-semibold">{item.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white">{item.district}</p>
                        <p className="text-sm text-gray-500">{item.district_en}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info">{item.constituency}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{item.province_en}</td>
                    <td className="py-3 px-4 text-right">
                      {item.pdf_url ? (
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                        >
                          <Download size={16} />
                          <span className="text-sm">Download</span>
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {listData.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 font-mono font-semibold text-sm">ID: {item.id}</span>
                  <Badge variant="info" className="text-xs">{item.constituency}</Badge>
                </div>
                <div className="mb-2">
                  <p className="text-white text-sm">{item.district}</p>
                  <p className="text-xs text-gray-500">{item.district_en} • {item.province_en}</p>
                </div>
                {item.pdf_url && (
                  <a
                    href={item.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors w-full justify-center text-sm"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {format === 'grouped' && groupedData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {groupedData.map((group, index) => (
            <Card
              key={`${group.district}-${group.constituency}-${index}`}
              className="hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{group.district}</h3>
                  <p className="text-sm text-gray-500">{group.district_en}</p>
                </div>
                <Badge variant="info">#{group.constituency}</Badge>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">{group.province_en}</p>

              <div className="space-y-2">
                {group.pdfs.map((pdf) => (
                  <a
                    key={pdf.id}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-emerald-500" />
                      <span className="text-sm text-white font-mono">{pdf.id}</span>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-gray-500 group-hover:text-emerald-400 transition-colors"
                    />
                  </a>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {(!data || data.data.length === 0) && (
        <Card>
          <div className="text-center py-8 sm:py-12">
            <FileText className="mx-auto text-gray-600 mb-3 sm:mb-4" size={40} />
            <p className="text-gray-400 text-sm sm:text-base">No PDF documents found</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        </Card>
      )}
    </div>
  );
}
