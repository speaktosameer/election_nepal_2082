import { getCandidatesByDistrict } from '@/lib/api';
import { ByDistrictClient } from './ByDistrictClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    district?: string;
    constituency?: string;
    party?: string;
    gender?: string;
    sort?: string;
  }>;
}

export default async function ByDistrictPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getCandidatesByDistrict({
      district: params.district || '',
      constituency: params.constituency ? parseInt(params.constituency) : undefined,
      party_filter: params.party || '',
      gender_filter: params.gender || '',
      sort_candidates: params.sort || 'serial_no',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <ByDistrictClient data={data} searchParams={params} />;
}
