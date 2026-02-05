import { getCandidatesByGender } from '@/lib/api';
import { ByGenderClient } from './ByGenderClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    district?: string;
    party?: string;
  }>;
}
//Umesh does the commit 
export default async function ByGenderPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let data = null;

  try {
    data = await getCandidatesByGender({
      district: params.district || '',
      party_filter: params.party || '',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <ByGenderClient data={data} searchParams={params} />;
}
