import { createServerSupabaseClient } from './supabase';
import {
  PollingCentersResponse,
  PollingCentersByProvinceResponse,
  PollingCentersByDistrictResponse,
  PollingCentersByConstituencyResponse,
  PollingCenterPDFsResponse,
  PollingCenterStatsResponse,
  PollingCenter,
  ConstituenciesListResponse,
  CandidatesResponse,
  CandidatesByDistrictResponse,
  CandidatesByPartyResponse,
  CandidatesByGenderResponse,
  CandidatesByAgeResponse,
  ElectionStatsResponse,
  ElectionResultsResponse,
  ElectionCandidate,
} from './types';

// ============================================================================
// POLLING CENTER API FUNCTIONS
// ============================================================================

export async function getPollingCenters(params?: {
  search_term?: string;
  province?: string;
  district?: string;
  constituency?: number;
  election_year?: number;
  sort_by?: string;
  sort_asc?: boolean;
  limit?: number;
  offset?: number;
}): Promise<PollingCentersResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_polling_centers', {
    p_search_term: params?.search_term || '',
    p_province: params?.province || '',
    p_district: params?.district || '',
    p_constituency: params?.constituency || null,
    p_election_year: params?.election_year || null,
    p_sort_by: params?.sort_by || 'id',
    p_sort_asc: params?.sort_asc ?? true,
    p_limit: params?.limit || 50,
    p_offset: params?.offset || 0,
  });

  if (error) throw error;
  return data as PollingCentersResponse;
}

export async function getPollingCentersByProvince(params?: {
  province?: string;
  district?: string;
  include_pdfs?: boolean;
}): Promise<PollingCentersByProvinceResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_polling_centers_by_province', {
    p_province: params?.province || '',
    p_district: params?.district || '',
    p_include_pdfs: params?.include_pdfs ?? true,
  });

  if (error) throw error;
  return data as PollingCentersByProvinceResponse;
}

export async function getPollingCentersByDistrict(params?: {
  province?: string;
  district?: string;
  constituency?: number;
  sort_by?: string;
}): Promise<PollingCentersByDistrictResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_polling_centers_by_district', {
    p_province: params?.province || '',
    p_district: params?.district || '',
    p_constituency: params?.constituency || null,
    p_sort_by: params?.sort_by || 'district_code',
  });

  if (error) throw error;
  return data as PollingCentersByDistrictResponse;
}

export async function getPollingCentersByConstituency(params?: {
  province?: string;
  district?: string;
  min_centers?: number;
  sort_by?: string;
}): Promise<PollingCentersByConstituencyResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_polling_centers_by_constituency', {
    p_province: params?.province || '',
    p_district: params?.district || '',
    p_min_centers: params?.min_centers || 1,
    p_sort_by: params?.sort_by || 'id',
  });

  if (error) throw error;
  return data as PollingCentersByConstituencyResponse;
}

export async function getPollingCenterPDFs(params?: {
  province?: string;
  district?: string;
  constituency?: number;
  format?: 'list' | 'grouped';
}): Promise<PollingCenterPDFsResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_polling_center_pdfs', {
    p_province: params?.province || '',
    p_district: params?.district || '',
    p_constituency: params?.constituency || null,
    p_format: params?.format || 'list',
  });

  if (error) throw error;
  return data as PollingCenterPDFsResponse;
}

export async function getPollingCenterStats(
  election_year?: number
): Promise<PollingCenterStatsResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_polling_center_stats', {
    p_election_year: election_year || null,
  });

  if (error) throw error;
  return data as PollingCenterStatsResponse;
}

export async function getPollingCenterById(
  id: string
): Promise<PollingCenter | { error: string; id: string }> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_polling_center_by_id', {
    p_id: id,
  });

  if (error) throw error;
  return data;
}

export async function getConstituenciesList(params?: {
  province?: string;
  district?: string;
}): Promise<ConstituenciesListResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_constituencies_list', {
    p_province: params?.province || '',
    p_district: params?.district || '',
  });

  if (error) throw error;
  return data as ConstituenciesListResponse;
}

// ============================================================================
// CANDIDATE API FUNCTIONS
// ============================================================================

export async function getCandidates(params?: {
  search_term?: string;
  district?: string;
  constituency?: number;
  party?: string;
  gender?: string;
  age_min?: number;
  age_max?: number;
  election_type?: string;
  election_year?: number;
  sort_by?: string;
  sort_asc?: boolean;
  limit?: number;
  offset?: number;
}): Promise<CandidatesResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_candidates', {
    p_search_term: params?.search_term || '',
    p_district: params?.district || '',
    p_constituency: params?.constituency || null,
    p_party: params?.party || '',
    p_gender: params?.gender || '',
    p_age_min: params?.age_min || null,
    p_age_max: params?.age_max || null,
    p_election_type: params?.election_type || '',
    p_election_year: params?.election_year || null,
    p_sort_by: params?.sort_by || 'serial_no',
    p_sort_asc: params?.sort_asc ?? true,
    p_limit: params?.limit || 50,
    p_offset: params?.offset || 0,
  });

  if (error) throw error;
  return data as CandidatesResponse;
}

export async function getCandidatesByDistrict(params?: {
  district?: string;
  constituency?: number;
  party_filter?: string;
  gender_filter?: string;
  sort_candidates?: string;
}): Promise<CandidatesByDistrictResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_candidates_by_district', {
    p_district: params?.district || '',
    p_constituency: params?.constituency || null,
    p_party_filter: params?.party_filter || '',
    p_gender_filter: params?.gender_filter || '',
    p_sort_candidates: params?.sort_candidates || 'serial_no',
  });

  if (error) throw error;
  return data as CandidatesByDistrictResponse;
}

export async function getCandidatesByParty(params?: {
  party_filter?: string;
  district?: string;
  gender_filter?: string;
  min_candidates?: number;
  sort_by?: string;
}): Promise<CandidatesByPartyResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_candidates_by_party', {
    p_party_filter: params?.party_filter || '',
    p_district: params?.district || '',
    p_gender_filter: params?.gender_filter || '',
    p_min_candidates: params?.min_candidates || 1,
    p_sort_by: params?.sort_by || 'candidate_count',
  });

  if (error) throw error;
  return data as CandidatesByPartyResponse;
}

export async function getCandidatesByGender(params?: {
  district?: string;
  party_filter?: string;
  group_by?: string;
}): Promise<CandidatesByGenderResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_candidates_by_gender', {
    p_district: params?.district || '',
    p_party_filter: params?.party_filter || '',
    p_group_by: params?.group_by || 'gender',
  });

  if (error) throw error;
  return data as CandidatesByGenderResponse;
}

export async function getCandidatesByAge(params?: {
  age_min?: number;
  age_max?: number;
  district?: string;
  party_filter?: string;
  gender_filter?: string;
}): Promise<CandidatesByAgeResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_candidates_by_age', {
    p_age_min: params?.age_min || null,
    p_age_max: params?.age_max || null,
    p_district: params?.district || '',
    p_party_filter: params?.party_filter || '',
    p_gender_filter: params?.gender_filter || '',
  });

  if (error) throw error;
  return data as CandidatesByAgeResponse;
}

export async function getElectionStats(
  election_year?: number
): Promise<ElectionStatsResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_election_stats', {
    p_election_year: election_year || null,
  });

  if (error) throw error;
  return data as ElectionStatsResponse;
}

// ============================================================================
// ELECTION RESULTS API FUNCTIONS
// ============================================================================

export async function getElectionResults(params?: {
  district?: string;
  party?: string;
  search_term?: string;
  limit?: number;
  offset?: number;
}): Promise<ElectionResultsResponse> {
  try {
    const response = await fetch(
      'https://result.election.gov.np/JSONFiles/ElectionResultCentral2082.txt',
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch election results: ${response.statusText}`);
    }

    const candidates: ElectionCandidate[] = await response.json();

    // Filter based on parameters
    let filtered = [...candidates];

    if (params?.search_term) {
      const term = params.search_term.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.CandidateName.toLowerCase().includes(term) ||
          c.PoliticalPartyName.toLowerCase().includes(term) ||
          c.DistrictName.toLowerCase().includes(term)
      );
    }

    if (params?.district) {
      filtered = filtered.filter(
        (c) => c.DistrictName.toLowerCase() === params.district!.toLowerCase()
      );
    }

    if (params?.party) {
      filtered = filtered.filter(
        (c) => c.PoliticalPartyName.toLowerCase() === params.party!.toLowerCase()
      );
    }

    // Apply pagination
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    const paginatedData = filtered.slice(offset, offset + limit);

    return {
      data: paginatedData,
      total: filtered.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching election results:', error);
    throw error;
  }
}

export async function getElectionResultsByDistrict(
  district?: string
): Promise<ElectionResultsResponse> {
  return getElectionResults({ district, limit: 1000 });
}

export async function getElectionResultsByParty(
  party?: string
): Promise<ElectionResultsResponse> {
  return getElectionResults({ party, limit: 1000 });
}

export async function getElectionResultsStats(): Promise<{
  total_candidates: number;
  total_districts: number;
  total_parties: number;
  top_parties: Array<{
    party: string;
    candidate_count: number;
    total_votes: number;
  }>;
  timestamp: string;
}> {
  try {
    const response = await fetch(
      'https://result.election.gov.np/JSONFiles/ElectionResultCentral2082.txt',
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch election results: ${response.statusText}`);
    }

    const candidates: ElectionCandidate[] = await response.json();

    // Calculate statistics
    const districts = new Set(candidates.map((c) => c.DistrictName));
    const parties = new Set(candidates.map((c) => c.PoliticalPartyName));

    const partyStats: { [key: string]: { count: number; votes: number } } = {};
    candidates.forEach((c) => {
      if (!partyStats[c.PoliticalPartyName]) {
        partyStats[c.PoliticalPartyName] = { count: 0, votes: 0 };
      }
      partyStats[c.PoliticalPartyName].count++;
      partyStats[c.PoliticalPartyName].votes += c.TotalVoteReceived || 0;
    });

    const topParties = Object.entries(partyStats)
      .map(([party, stats]) => ({
        party,
        candidate_count: stats.count,
        total_votes: stats.votes,
      }))
      .sort((a, b) => b.total_votes - a.total_votes)
      .slice(0, 10);

    return {
      total_candidates: candidates.length,
      total_districts: districts.size,
      total_parties: parties.size,
      top_parties: topParties,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching election results stats:', error);
    throw error;
  }
}
