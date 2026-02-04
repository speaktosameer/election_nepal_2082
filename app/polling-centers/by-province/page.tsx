import { getPollingCentersByProvince } from '@/lib/api';
import { ByProvinceClient } from './ByProvinceClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    province?: string;
    district?: string;
  }>;
}

export default async function ByProvincePage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getPollingCentersByProvince({
      province: params.province || '',
      district: params.district || '',
      include_pdfs: true,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <ByProvinceClient data={data} searchParams={params} />;
}
