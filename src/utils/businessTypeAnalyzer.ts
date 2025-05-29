import * as turf from '@turf/turf';
import { LinearRegression } from 'ml-regression';
import type { LocationData } from '../types';

interface AnalysisResult {
  marketFit: number;
  confidence: number;
  recommendations: string[];
  competitorAnalysis: {
    marketShare: {
      leader: number;
      competitors: { name: string; share: number }[];
    };
    benchmarking: {
      marketShare: number;
      customerService: number;
      productQuality: number;
      location: number;
      price: number;
    };
    strengths: { metric: string; value: number }[];
    weaknesses: { metric: string; value: number }[];
    opportunities: string[];
    differentiators: string[];
  };
}

export class BusinessTypeAnalyzer {
  static async analyzeBusinessType(businessType: string, location: LocationData): Promise<AnalysisResult> {
    // Calculate market density
    const area = Math.PI * Math.pow(location.radius || 1, 2);
    const density = location.businessDensity;
    
    // Calculate market potential
    const marketPotential = this.calculateMarketPotential(location);
    
    // Analyze competition
    const competitorAnalysis = await this.analyzeCompetitors(location, businessType);
    
    // Calculate market fit score
    const marketFit = this.calculateMarketFit(location, competitorAnalysis);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(marketFit, competitorAnalysis);

    return {
      marketFit,
      confidence: 0.85,
      recommendations,
      competitorAnalysis
    };
  }

  private static calculateMarketPotential(location: LocationData): number {
    const populationScore = Math.min(location.population / 100000, 1);
    const incomeScore = Math.min(location.avgIncome / 50000, 1);
    const educationScore = location.educationLevel / 100;
    
    return (populationScore * 0.4 + incomeScore * 0.4 + educationScore * 0.2) * 100;
  }

  private static async analyzeCompetitors(location: LocationData, businessType: string) {
    // Market share analysis
    const marketShare = {
      leader: 35,
      competitors: [
        { name: 'Market Leader', share: 35 },
        { name: 'Competitor A', share: 25 },
        { name: 'Competitor B', share: 20 },
        { name: 'Others', share: 20 }
      ]
    };

    // Competitive benchmarking
    const benchmarking = {
      marketShare: 75,
      customerService: 85,
      productQuality: 80,
      location: 90,
      price: 70
    };

    // Strengths and weaknesses
    const strengths = [
      { metric: 'Brand Recognition', value: 85 },
      { metric: 'Customer Service', value: 90 },
      { metric: 'Product Quality', value: 88 },
      { metric: 'Location', value: 95 },
      { metric: 'Price', value: 75 }
    ];

    const weaknesses = [
      { metric: 'Innovation', value: 60 },
      { metric: 'Digital Presence', value: 65 },
      { metric: 'Delivery Service', value: 55 },
      { metric: 'Operating Hours', value: 70 },
      { metric: 'Parking Space', value: 50 }
    ];

    // Market opportunities
    const opportunities = [
      'Underserved customer segments',
      'Growing market demand',
      'Digital transformation potential'
    ];

    // Differentiation points
    const differentiators = [
      'Innovative service offerings',
      'Superior customer experience',
      'Strategic location advantages'
    ];

    return {
      marketShare,
      benchmarking,
      strengths,
      weaknesses,
      opportunities,
      differentiators
    };
  }

  private static calculateMarketFit(location: LocationData, analysis: any): number {
    const weights = {
      marketShare: 0.2,
      competition: 0.2,
      demographics: 0.3,
      location: 0.3
    };

    const marketShareScore = analysis.benchmarking.marketShare / 100;
    const competitionScore = 1 - (location.competitorCount / 10);
    const demographicsScore = (location.population / 100000) * (location.avgIncome / 50000);
    const locationScore = analysis.benchmarking.location / 100;

    return Math.round(
      (marketShareScore * weights.marketShare +
      competitionScore * weights.competition +
      demographicsScore * weights.demographics +
      locationScore * weights.location) * 100
    );
  }

  private static generateRecommendations(marketFit: number, analysis: any): string[] {
    const recommendations = [];

    if (marketFit < 50) {
      recommendations.push('Consider alternative locations with better market potential');
      recommendations.push('Focus on differentiation strategy to stand out from competitors');
    } else if (marketFit < 75) {
      recommendations.push('Invest in areas identified as competitor weaknesses');
      recommendations.push('Target underserved customer segments');
    } else {
      recommendations.push('Capitalize on strong market position');
      recommendations.push('Explore expansion opportunities');
    }

    // Add recommendations based on competitor analysis
    if (analysis.weaknesses.some(w => w.value < 60)) {
      recommendations.push('Address critical competitive weaknesses');
    }

    return recommendations;
  }
}

export default BusinessTypeAnalyzer;