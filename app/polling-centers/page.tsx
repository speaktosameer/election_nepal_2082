import { getPollingCenters, getConstituenciesList } from '@/lib/api';
import { PollingCentersClient } from './PollingCentersClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    province?: string;
    district?: string;
    constituency?: string;
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function PollingCentersPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  const page = parseInt(params.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  let pollingCenters = null;
  let constituenciesList = null;

  try {
    [pollingCenters, constituenciesList] = await Promise.all([
      getPollingCenters({
        search_term: params.search || '',
        province: params.province || '',
        district: params.district || '',
        constituency: params.constituency ? parseInt(params.constituency) : undefined,
        sort_by: params.sort || 'id',
        sort_asc: params.order !== 'desc',
        limit,
        offset,
      }),
      getConstituenciesList({
        province: params.province || '',
      }),
    ]);
  } catch (error) {
    console.error('Error fetching polling centers:', error);
  }

  return (
    <PollingCentersClient
      initialData={pollingCenters}
      constituenciesList={constituenciesList}
      currentPage={page}
      searchParams={params}
    />
  );
}
