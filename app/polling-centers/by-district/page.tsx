import { getPollingCentersByDistrict } from '@/lib/api';
import { ByDistrictClient } from './ByDistrictClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    province?: string;
    district?: string;
    sort?: string;
  }>;
}

export default async function ByDistrictPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getPollingCentersByDistrict({
      province: params.province || '',
      district: params.district || '',
      sort_by: params.sort || 'district_code',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <ByDistrictClient data={data} searchParams={params} />;
}
