// Polling Center Types
export interface PollingCenter {
  id: string;
  province: string;
  province_en: string;
  district_code: number;
  district: string;
  district_en: string;
  constituency: number;
  pdf_filename: string;
  pdf_url: string;
  election_type: string;
  election_year: number;
  created_at: string;
}

export interface PollingCentersResponse {
  data: PollingCenter[];
  total: number;
  limit: number;
  offset: number;
  filters: {
    search_term: string;
    province: string;
    district: string;
    constituency: number | null;
    election_year: number | null;
    sort_by: string;
    sort_asc: boolean;
  };
}

export interface PollingCenterPDF {
  id: string;
  filename: string;
  url: string;
}

export interface ConstituencyGroup {
  constituency: number;
  center_count: number;
  centers: PollingCenterPDF[];
}

export interface DistrictGroup {
  district: string;
  district_en: string;
  district_code: number;
  constituencies_count: number;
  total_centers: number;
  constituencies: ConstituencyGroup[];
}

export interface ProvinceGroup {
  province: string;
  province_en: string;
  districts_count: number;
  constituencies_count: number;
  total_centers: number;
  districts: DistrictGroup[];
}

export interface PollingCentersByProvinceResponse {
  data: ProvinceGroup[];
}

export interface PollingCentersByDistrictData {
  district: string;
  district_en: string;
  district_code: number;
  province: string;
  province_en: string;
  constituencies_count: number;
  total_centers: number;
  centers: {
    id: string;
    constituency: number;
    pdf_filename: string;
    pdf_url: string;
  }[];
}

export interface PollingCentersByDistrictResponse {
  data: PollingCentersByDistrictData[];
}

export interface ConstituencyData {
  province: string;
  province_en: string;
  district: string;
  district_en: string;
  district_code: number;
  constituency: number;
  center_count: number;
  centers: {
    id: string;
    pdf_filename: string;
    pdf_url: string;
    election_type: string;
    election_year: number;
  }[];
}

export interface PollingCentersByConstituencyResponse {
  data: ConstituencyData[];
}

export interface PDFListItem {
  id: string;
  province: string;
  province_en: string;
  district: string;
  district_en: string;
  constituency: number;
  pdf_filename: string;
  pdf_url: string;
}

export interface PDFGroupedItem {
  province: string;
  province_en: string;
  district: string;
  district_en: string;
  district_code: number;
  constituency: number;
  pdfs: {
    id: string;
    filename: string;
    url: string;
  }[];
}

export interface PollingCenterPDFsResponse {
  data: PDFListItem[] | PDFGroupedItem[];
  format: 'list' | 'grouped';
}

export interface ProvinceStats {
  province: string;
  province_en: string;
  districts_count: number;
  constituencies_count: number;
  centers_count: number;
}

export interface PollingCenterStatsResponse {
  total_centers: number;
  total_districts: number;
  total_provinces: number;
  total_constituencies: number;
  province_breakdown: ProvinceStats[];
  election_year: number | null;
  last_updated: string;
}

export interface ConstituenciesListResponse {
  districts: string[];
  constituencies: number[];
}

// Candidate Types
export interface Candidate {
  serial_no: number;
  district: string;
  constituency: number;
  party: string;
  candidate_name: string;
  age: number;
  gender: string;
  election_type: string;
  election_year: number;
}

export interface CandidatesResponse {
  data: Candidate[];
  total: number;
  limit: number;
  offset: number;
  filters: {
    search_term: string;
    district: string;
    constituency: number | null;
    party: string;
    gender: string;
    age_min: number | null;
    age_max: number | null;
    sort_by: string;
    sort_asc: boolean;
  };
}

export interface CandidateInfo {
  serial_no: number;
  candidate_name: string;
  party: string;
  age: number;
  gender: string;
}

export interface ConstituencyCandidates {
  constituency: number;
  candidate_count: number;
  candidates: CandidateInfo[];
}

export interface DistrictCandidates {
  district: string;
  constituencies_count: number;
  total_candidates: number;
  constituencies: ConstituencyCandidates[];
}

export interface CandidatesByDistrictResponse {
  data: DistrictCandidates[];
}

export interface PartyDemographics {
  avg_age: number;
  min_age: number;
  max_age: number;
  male_count: number;
  female_count: number;
}

export interface PartyCandidateInfo {
  candidate_name: string;
  district: string;
  constituency: number;
  age: number;
  gender: string;
}

export interface PartyStats {
  party: string;
  candidate_count: number;
  districts_count: number;
  constituencies_count: number;
  demographics: PartyDemographics;
  candidates: PartyCandidateInfo[];
}

export interface CandidatesByPartyResponse {
  data: PartyStats[];
  total_parties: number;
}

export interface GenderSummary {
  gender: string;
  total_candidates: number;
  avg_age: number;
  districts_represented: number;
  parties_represented: number;
  districts: string[];
  parties: string[];
}

export interface GenderDistribution {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

export interface DistrictGenderBreakdown {
  district: string;
  gender_distribution: GenderDistribution;
}

export interface PartyGenderBreakdown {
  party: string;
  gender_distribution: { [key: string]: number };
}

export interface AgeGroupGenderBreakdown {
  age_group: string;
  gender_distribution: { [key: string]: number };
}

export interface CandidatesByGenderResponse {
  summary: GenderSummary[];
  by_district: DistrictGenderBreakdown[];
  by_party: PartyGenderBreakdown[];
  by_age_group: AgeGroupGenderBreakdown[];
  total_candidates: number;
}

export interface AgeGroupCandidate {
  candidate_name: string;
  age: number;
  gender: string;
  district: string;
  constituency: number;
  party: string;
}

export interface AgeGroupStats {
  age_group: string;
  candidate_count: number;
  male_count: number;
  female_count: number;
  avg_age: number;
  candidates: AgeGroupCandidate[];
}

export interface OverallAgeStats {
  total_candidates: number;
  avg_age: number;
  youngest: number;
  oldest: number;
  median_age: number;
}

export interface AgeCandidateBasic {
  candidate_name: string;
  age: number;
  district: string;
  party: string;
}

export interface CandidatesByAgeResponse {
  age_groups: AgeGroupStats[];
  overall_stats: OverallAgeStats;
  youngest_candidates: AgeCandidateBasic[];
  oldest_candidates: AgeCandidateBasic[];
}

export interface GenderDistributionSimple {
  [key: string]: number;
}

export interface AgeStatsSimple {
  average: number;
  median: number;
  youngest: number;
  oldest: number;
}

export interface TopParty {
  party: string;
  candidate_count: number;
}

export interface DistrictSummary {
  district: string;
  constituencies: number;
  candidates: number;
}

export interface ElectionStatsResponse {
  total_candidates: number;
  total_districts: number;
  total_constituencies: number;
  total_parties: number;
  gender_distribution: GenderDistributionSimple;
  age_stats: AgeStatsSimple;
  top_parties: TopParty[];
  districts_summary: DistrictSummary[];
}
