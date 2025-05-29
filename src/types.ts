export interface LocationData {
  lat: number;
  lng: number;
  name: string;
  population: number;
  avgIncome: number;
  competitorCount: number;
  educationLevel: number;
  businessDensity: number;
  radius?: number;
}

export interface PeakHoursData {
  hour: string;
  traffic: number;
  pedestrian: number;
  vehicle: number;
}

export interface WeeklyData {
  day: string;
  traffic: number;
  pedestrian: number;
  vehicle: number;
}

export interface MonthlyData {
  month: string;
  traffic: number;
  pedestrian: number;
  vehicle: number;
}

export interface BusinessRecommendation {
  type: string;
  score: number;
  investment: number;
  revenue: number;
  profit: number;
  breakEven: number;
  risk: 'Low' | 'Medium' | 'High';
  competitorCount: number;
  marketPotential: number;
  growthRate: number;
  successProbability: number;
  priority?: number;
  localBusinesses?: LocalBusiness[];
}

export interface LocalBusiness {
  name: string;
  type: string;
  distance: number;
  rating: number;
  reviews: number;
  operatingSince: string;
  status: 'Open' | 'Closed' | 'Opening Soon';
}

export interface FranchiseRecommendation {
  name: string;
  investment: number;
  roi: number;
  marketMatch: number;
  requirements: string[];
  category: string;
  expansionPotential: number;
  supportRating: number;
  brandStrength: number;
  contact?: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  advantages?: string[];
}

export interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  preferred_contact_method: 'email' | 'phone';
}

export interface DemographicData {
  age_groups: { label: string; value: number }[];
  income_levels: { label: string; value: number }[];
  education_levels: { label: string; value: number }[];
}

export interface CompetitorData {
  name: string;
  market_share: number;
  customer_satisfaction: number;
  price_point: number;
}

export interface MigrationData {
  period: string;
  inflow: number;
  outflow: number;
  net_migration: number;
}

export interface MarketingData {
  channel: string;
  effectiveness: number;
  cost_per_acquisition: number;
  conversion_rate: number;
}

export interface BusinessIdeaAnalysis {
  businessType: string;
  location: LocationData;
  successProbability: number;
  resources: BusinessResource[];
  supportPrograms: SupportProgram[];
  demographics: DemographicData;
  roi: {
    value: number;
    timeframe: string;
    breakEvenMonths: number;
  };
  riskFactors: RiskFactor[];
  marketTrends: MarketTrend[];
  competitorAnalysis: CompetitorAnalysis;
}

export interface BusinessResource {
  name: string;
  type: 'Financial' | 'Human' | 'Physical' | 'Intellectual' | 'Digital';
  availability: number;
  cost: number;
  importance: number;
}

export interface SupportProgram {
  name: string;
  provider: string;
  type: 'Government' | 'Private' | 'NGO' | 'Academic';
  benefit: string;
  eligibility: string;
  applicationProcess: string;
  contactInfo: {
    website: string;
    email: string;
    phone: string;
  };
}

export interface RiskFactor {
  name: string;
  probability: number;
  impact: number;
  mitigationStrategy: string;
}

export interface MarketTrend {
  name: string;
  direction: 'Up' | 'Down' | 'Stable';
  impact: 'Positive' | 'Negative' | 'Neutral';
  description: string;
  timeframe: string;
}

export interface CompetitorAnalysis {
  totalCompetitors: number;
  directCompetitors: number;
  indirectCompetitors: number;
  marketLeader: {
    name: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  };
  competitiveAdvantage: string[];
}

export interface NearbyBusiness {
  id: string;
  name: string;
  type: string;
  category: string;
  distance: number;
  lat: number;
  lon: number;
  businessHours?: string;
  amenities: string[];
  rating?: number;
  priceRange?: string;
}