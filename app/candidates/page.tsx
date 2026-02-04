import { getCandidates, getConstituenciesList } from '@/lib/api';
import { CandidatesClient } from './CandidatesClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    district?: string;
    constituency?: string;
    party?: string;
    gender?: string;
    age_min?: string;
    age_max?: string;
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function CandidatesPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  const page = parseInt(params.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  let candidates = null;
  let constituenciesList = null;

  try {
    [candidates, constituenciesList] = await Promise.all([
      getCandidates({
        search_term: params.search || '',
        district: params.district || '',
        constituency: params.constituency ? parseInt(params.constituency) : undefined,
        party: params.party || '',
        gender: params.gender || '',
        age_min: params.age_min ? parseInt(params.age_min) : undefined,
        age_max: params.age_max ? parseInt(params.age_max) : undefined,
        sort_by: params.sort || 'serial_no',
        sort_asc: params.order !== 'desc',
        limit,
        offset,
      }),
      getConstituenciesList(),
    ]);
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }

  return (
    <CandidatesClient
      initialData={candidates}
      constituenciesList={constituenciesList}
      currentPage={page}
      searchParams={params}
    />
  );
}
