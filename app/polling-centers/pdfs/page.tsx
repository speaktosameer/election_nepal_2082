import { getPollingCenterPDFs } from '@/lib/api';
import { PDFsClient } from './PDFsClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    province?: string;
    district?: string;
    constituency?: string;
    format?: 'list' | 'grouped';
  }>;
}

export default async function PDFsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getPollingCenterPDFs({
      province: params.province || '',
      district: params.district || '',
      constituency: params.constituency ? parseInt(params.constituency) : undefined,
      format: params.format || 'list',
    });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
  }

  return <PDFsClient data={data} searchParams={params} />;
}
