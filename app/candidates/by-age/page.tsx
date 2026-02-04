import { getCandidatesByAge } from '@/lib/api';
import { ByAgeClient } from './ByAgeClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    age_min?: string;
    age_max?: string;
    district?: string;
    party?: string;
    gender?: string;
  }>;
}

export default async function ByAgePage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getCandidatesByAge({
      age_min: params.age_min ? parseInt(params.age_min) : undefined,
      age_max: params.age_max ? parseInt(params.age_max) : undefined,
      district: params.district || '',
      party_filter: params.party || '',
      gender_filter: params.gender || '',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <ByAgeClient data={data} searchParams={params} />;
}
