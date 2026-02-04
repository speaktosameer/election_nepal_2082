import { getPollingCenterStats, getElectionStats } from '@/lib/api';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  let pollingStats = null;
  let electionStats = null;

  try {
    [pollingStats, electionStats] = await Promise.all([
      getPollingCenterStats(),
      getElectionStats(),
    ]);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  return (
    <DashboardClient
      pollingStats={pollingStats}
      electionStats={electionStats}
    />
  );
}
