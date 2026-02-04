import { getElectionStats } from '@/lib/api';
import { StatsClient } from './StatsClient';
import { decodeQueryParams } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    year?: string;
  }>;
}

export default async function StatsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = decodeQueryParams(raw);
  let stats = null;

  try {
    stats = await getElectionStats(params.year ? parseInt(params.year) : undefined);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  return <StatsClient stats={stats} searchParams={params} />;
}
