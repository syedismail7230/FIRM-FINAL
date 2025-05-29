export interface StoreAnalysis {
  type: string;
  name: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  customerBase: string;
  peakHours: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
  marketPotential: number;
  recommendedActions: string[];
}