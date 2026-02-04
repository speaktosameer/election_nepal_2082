import { getCandidatesByParty } from '@/lib/api';
import { ByPartyClient } from './ByPartyClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    party?: string;
    district?: string;
    gender?: string;
    min_candidates?: string;
    sort?: string;
  }>;
}

export default async function ByPartyPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getCandidatesByParty({
      party_filter: params.party || '',
      district: params.district || '',
      gender_filter: params.gender || '',
      min_candidates: params.min_candidates ? parseInt(params.min_candidates) : 1,
      sort_by: params.sort || 'candidate_count',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <ByPartyClient data={data} searchParams={params} />;
}
