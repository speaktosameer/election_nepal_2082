import { getPollingCentersByConstituency } from '@/lib/api';
import { ByConstituencyClient } from './ByConstituencyClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    province?: string;
    district?: string;
    min_centers?: string;
    sort?: string;
  }>;
}

export default async function ByConstituencyPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getPollingCentersByConstituency({
      province: params.province || '',
      district: params.district || '',
      min_centers: params.min_centers ? parseInt(params.min_centers) : 1,
      sort_by: params.sort || 'id',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <ByConstituencyClient data={data} searchParams={params} />;
}
