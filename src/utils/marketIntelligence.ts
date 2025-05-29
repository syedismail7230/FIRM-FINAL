// Simplified version without ML dependencies
import type { LocationData, BusinessRecommendation } from '../types';

export class MarketIntelligenceSystem {
  async analyzeLocation(location: LocationData): Promise<{
    segment: number;
    demand: {
      value: number;
      confidence: number;
      factors: { feature: string; importance: number; }[];
    };
    risk: {
      level: 'Low' | 'Medium' | 'High';
      probability: number;
      factors: { factor: string; impact: number; }[];
    };
    recommendations: BusinessRecommendation[];
  }> {
    // Simple heuristic-based analysis
    const segment = Math.floor(Math.random() * 5);
    
    const demand = {
      value: Math.min(100, Math.round(
        (location.population / 100000 * 30) +
        (location.avgIncome / 50000 * 30) +
        (location.businessDensity * 5) +
        (location.educationLevel * 0.3)
      )),
      confidence: Math.round(70 + Math.random() * 20),
      factors: [
        { feature: 'Population', importance: 85 },
        { feature: 'Average Income', importance: 75 },
        { feature: 'Business Density', importance: 65 },
        { feature: 'Education Level', importance: 55 }
      ]
    };

    const riskScore = 
      (location.businessDensity > 10 ? -1 : 1) +
      (location.competitorCount > 5 ? -1 : 1) +
      (location.population > 500000 ? 1 : -1) +
      (location.avgIncome > 50000 ? 1 : -1);

    let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    if (riskScore >= 2) riskLevel = 'Low';
    else if (riskScore <= -2) riskLevel = 'High';

    const risk = {
      level: riskLevel,
      probability: Math.round(50 + riskScore * 10),
      factors: [
        {
          factor: 'Market Competition',
          impact: Math.min(100, location.competitorCount * 10)
        },
        {
          factor: 'Market Size',
          impact: Math.min(100, (location.population / 100000) * 20)
        },
        {
          factor: 'Economic Factors',
          impact: Math.min(100, (location.avgIncome / 50000 * 50) + (location.businessDensity * 5))
        },
        {
          factor: 'Demographics',
          impact: Math.min(100, location.educationLevel)
        }
      ]
    };

    const recommendations: BusinessRecommendation[] = [];

    return {
      segment,
      demand,
      risk,
      recommendations
    };
  }
}

export const marketIntelligence = new MarketIntelligenceSystem();