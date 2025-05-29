import { addHours, format } from 'date-fns';
import type { PeakHoursData, WeeklyData, MonthlyData, BusinessRecommendation, LocationData, FranchiseRecommendation } from '../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BUSINESS_TYPES = [
  {
    type: 'Café',
    baseInvestment: 1500000,
    baseRevenue: 3000000,
    profitMargin: 0.25,
    populationWeight: 0.8,
    incomeWeight: 0.7,
    educationWeight: 0.6,
    trafficWeight: 0.9
  },
  {
    type: 'Restaurant',
    baseInvestment: 3500000,
    baseRevenue: 7000000,
    profitMargin: 0.3,
    populationWeight: 0.9,
    incomeWeight: 0.8,
    educationWeight: 0.5,
    trafficWeight: 0.8
  },
  {
    type: 'Retail Store',
    baseInvestment: 2500000,
    baseRevenue: 5000000,
    profitMargin: 0.35,
    populationWeight: 0.7,
    incomeWeight: 0.9,
    educationWeight: 0.4,
    trafficWeight: 0.7
  },
  {
    type: 'Gym',
    baseInvestment: 4000000,
    baseRevenue: 8000000,
    profitMargin: 0.4,
    populationWeight: 0.8,
    incomeWeight: 0.7,
    educationWeight: 0.8,
    trafficWeight: 0.5
  },
  {
    type: 'Coworking Space',
    baseInvestment: 5000000,
    baseRevenue: 10000000,
    profitMargin: 0.45,
    populationWeight: 0.6,
    incomeWeight: 0.9,
    educationWeight: 0.9,
    trafficWeight: 0.4
  }
];

const FRANCHISE_BRANDS = [
  {
    name: "Domino's Pizza",
    baseInvestment: 30000000,
    category: "Food & Beverage",
    requirements: [
      "2000+ sq ft space",
      "High street location",
      "3+ years business experience",
      "Liquid capital of ₹1 Cr"
    ],
    brandStrength: 90,
    supportRating: 85
  },
  {
    name: "Subway",
    baseInvestment: 20000000,
    category: "Food & Beverage",
    requirements: [
      "300-1000 sq ft space",
      "High visibility location",
      "Basic business experience",
      "Liquid capital of ₹50 Lakhs"
    ],
    brandStrength: 85,
    supportRating: 80
  },
  {
    name: "Prestige Smart Kitchen",
    baseInvestment: 15000000,
    category: "Retail",
    requirements: [
      "800-1200 sq ft space",
      "Prime location",
      "Retail experience preferred",
      "Investment capacity of ₹1.5 Cr"
    ],
    brandStrength: 75,
    supportRating: 70
  },
  {
    name: "VLCC",
    baseInvestment: 25000000,
    category: "Health & Wellness",
    requirements: [
      "1500+ sq ft space",
      "Commercial location",
      "Healthcare background preferred",
      "Investment capacity of ₹2.5 Cr"
    ],
    brandStrength: 80,
    supportRating: 75
  },
  {
    name: "Chai Point",
    baseInvestment: 10000000,
    category: "Food & Beverage",
    requirements: [
      "150-400 sq ft space",
      "High footfall area",
      "F&B experience preferred",
      "Investment capacity of ₹1 Cr"
    ],
    brandStrength: 70,
    supportRating: 80
  }
];

const FRANCHISE_CONTACT_INFO = {
  "Domino's Pizza": {
    phone: "+91-1800-123-4567",
    email: "franchise@dominos.in",
    website: "https://www.dominos.co.in/franchise",
    address: "Domino's Pizza India, DLF Phase-3, Gurugram",
    advantages: [
      "Global brand recognition",
      "Proven business model",
      "Comprehensive training program",
      "Supply chain support",
      "Marketing assistance"
    ]
  },
  "Subway": {
    phone: "+91-1800-987-6543",
    email: "franchise@subway.in",
    website: "https://www.subway.com/en-IN/OwnAFranchise",
    address: "Subway India, Cyber City, Gurugram",
    advantages: [
      "Low initial investment",
      "Flexible location options",
      "Strong brand value",
      "Operational support",
      "Regular menu innovation"
    ]
  },
  "Prestige Smart Kitchen": {
    phone: "+91-1800-456-7890",
    email: "franchise@prestigekitchen.in",
    website: "https://www.prestigekitchen.in/franchise",
    address: "Prestige Group, Bangalore",
    advantages: [
      "Established brand name",
      "Quality product range",
      "Marketing support",
      "Technical training",
      "Territory protection"
    ]
  },
  "VLCC": {
    phone: "+91-1800-234-5678",
    email: "franchise@vlcc.in",
    website: "https://www.vlcc.in/franchise",
    address: "VLCC India, Noida",
    advantages: [
      "Premium brand positioning",
      "Comprehensive training",
      "Marketing support",
      "Product supply chain",
      "Technical expertise"
    ]
  },
  "Chai Point": {
    phone: "+91-1800-345-6789",
    email: "franchise@chaipoint.com",
    website: "https://www.chaipoint.com/franchise",
    address: "Chai Point, Bangalore",
    advantages: [
      "Low investment requirement",
      "Quick ROI",
      "Strong supply chain",
      "Technology support",
      "Brand recognition"
    ]
  }
};

export function generateDailyData(location: LocationData): PeakHoursData[] {
  const baseTraffic = Math.floor(location.population / 1000);
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  return Array.from({ length: 24 }, (_, i) => {
    const hour = addHours(startDate, i);
    let multiplier = 1;
    let pedestrianRatio = 0.6;
    
    const densityFactor = location.businessDensity / 10;
    
    // Morning peak (8-10 AM)
    if (i >= 8 && i <= 10) {
      multiplier = 2.5 * densityFactor;
      pedestrianRatio = 0.7;
    }
    // Lunch peak (12-2 PM)
    else if (i >= 12 && i <= 14) {
      multiplier = 2 * densityFactor;
      pedestrianRatio = 0.8;
    }
    // Evening peak (5-7 PM)
    else if (i >= 17 && i <= 19) {
      multiplier = 3 * densityFactor;
      pedestrianRatio = 0.6;
    }
    // Night (11 PM-5 AM)
    else if (i >= 23 || i <= 5) {
      multiplier = 0.3;
      pedestrianRatio = 0.3;
    }

    const totalTraffic = Math.floor(baseTraffic * multiplier * (0.8 + Math.random() * 0.4));
    const pedestrian = Math.floor(totalTraffic * pedestrianRatio);
    const vehicle = totalTraffic - pedestrian;

    return {
      hour: format(hour, 'HH:mm'),
      traffic: totalTraffic,
      pedestrian,
      vehicle
    };
  });
}

export function generateWeeklyData(location: LocationData): WeeklyData[] {
  const baseTraffic = Math.floor(location.population / 1000);
  const densityFactor = location.businessDensity / 10;
  
  return DAYS.map(day => {
    let multiplier = 1;
    let pedestrianRatio = 0.6;

    if (day === 'Saturday') {
      multiplier = 2 * densityFactor;
      pedestrianRatio = 0.8;
    }
    else if (day === 'Sunday') {
      multiplier = 1.8 * densityFactor;
      pedestrianRatio = 0.9;
    }
    else if (day === 'Friday') {
      multiplier = 1.5 * densityFactor;
      pedestrianRatio = 0.7;
    }
    
    const totalTraffic = Math.floor(baseTraffic * multiplier * (0.8 + Math.random() * 0.4) * 24);
    const pedestrian = Math.floor(totalTraffic * pedestrianRatio);
    const vehicle = totalTraffic - pedestrian;

    return {
      day,
      traffic: totalTraffic,
      pedestrian,
      vehicle
    };
  });
}

export function generateMonthlyData(location: LocationData): MonthlyData[] {
  const baseTraffic = Math.floor(location.population / 1000);
  const densityFactor = location.businessDensity / 10;
  
  return MONTHS.map(month => {
    let multiplier = 1;
    let pedestrianRatio = 0.6;
    
    // Festival/Holiday seasons
    if (['Oct', 'Nov', 'Dec'].includes(month)) {
      multiplier = 1.5 * densityFactor;
      pedestrianRatio = 0.8;
    }
    // Summer months
    else if (['Jun', 'Jul', 'Aug'].includes(month)) {
      multiplier = 0.8 * densityFactor;
      pedestrianRatio = 0.5;
    }
    
    const totalTraffic = Math.floor(baseTraffic * multiplier * (0.8 + Math.random() * 0.4) * 30 * 24);
    const pedestrian = Math.floor(totalTraffic * pedestrianRatio);
    const vehicle = totalTraffic - pedestrian;

    return {
      month,
      traffic: totalTraffic,
      pedestrian,
      vehicle
    };
  });
}

function generateLocalBusinesses(location: LocationData, businessType: string): LocalBusiness[] {
  const count = Math.floor(Math.random() * 5) + 2; // 2-6 businesses
  const businesses: LocalBusiness[] = [];

  for (let i = 0; i < count; i++) {
    const distance = (Math.random() * location.radius! || 5).toFixed(1);
    const rating = (3 + Math.random() * 2).toFixed(1);
    const reviews = Math.floor(Math.random() * 200) + 50;
    const yearsSince = Math.floor(Math.random() * 10) + 1;
    const status = Math.random() > 0.8 ? 'Closed' : 'Open';

    businesses.push({
      name: `${businessType} ${i + 1}`,
      type: businessType,
      distance: parseFloat(distance),
      rating: parseFloat(rating),
      reviews,
      operatingSince: `${new Date().getFullYear() - yearsSince}`,
      status: status as 'Open' | 'Closed' | 'Opening Soon'
    });
  }

  return businesses.sort((a, b) => a.distance - b.distance);
}

function shuffleRecommendations(recommendations: BusinessRecommendation[]): BusinessRecommendation[] {
  return recommendations.map(rec => {
    const priority = (
      (rec.score * 0.3) +
      (rec.successProbability * 0.3) +
      (rec.marketPotential * 0.2) +
      (rec.growthRate * 0.2)
    );

    return {
      ...rec,
      priority,
      localBusinesses: generateLocalBusinesses(location, rec.type)
    };
  }).sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

export function generateBusinessRecommendations(location: LocationData): BusinessRecommendation[] {
  const { population, avgIncome, competitorCount, educationLevel, businessDensity } = location;
  
  const recommendations = BUSINESS_TYPES.map(business => {
    const popScore = Math.min(population / 100000, 1) * business.populationWeight;
    const incomeScore = Math.min(avgIncome / 50000, 1) * business.incomeWeight;
    const educationScore = (educationLevel / 100) * business.educationWeight;
    const competitionScore = Math.max(0, 1 - (competitorCount / 10));
    const densityScore = Math.min(businessDensity / 20, 1);
    const trafficScore = business.trafficWeight * densityScore;
    
    const score = Math.round(
      (popScore + incomeScore + educationScore + competitionScore + trafficScore) * 100 / 5
    );
    
    const locationMultiplier = (score / 100) * (1 + densityScore);
    const investment = Math.round(business.baseInvestment * (0.8 + locationMultiplier * 0.4));
    const revenue = Math.round(business.baseRevenue * locationMultiplier);
    const profit = Math.round(revenue * business.profitMargin);
    
    let risk: 'Low' | 'Medium' | 'High' = 'Medium';
    if (score >= 70 && competitorCount <= 3) risk = 'Low';
    else if (score < 40 || competitorCount > 7) risk = 'High';
    
    const successProbability = Math.min(100, Math.round(
      score * (1.2 - competitorCount / 10) * (1 + densityScore / 5)
    ));
    
    const marketPotential = Math.round(
      ((population * avgIncome) / 1000000) * (1 + businessDensity / 20)
    );
    
    const growthRate = Math.round(
      (score / 100) * (20 - competitorCount) * (1 + businessDensity / 30)
    );
    
    const breakEven = Math.max(6, Math.round(
      (investment / (profit / 12)) * (1 + (risk === 'High' ? 0.3 : risk === 'Medium' ? 0.15 : 0))
    ));
    
    return {
      type: business.type,
      score,
      investment,
      revenue,
      profit,
      breakEven,
      risk,
      competitorCount,
      marketPotential,
      growthRate,
      successProbability
    };
  });

  return shuffleRecommendations(recommendations);
}

export function generateFranchiseRecommendations(location: LocationData): FranchiseRecommendation[] {
  const { population, avgIncome, educationLevel, businessDensity } = location;
  
  const recommendations = FRANCHISE_BRANDS.map(franchise => {
    const populationScore = Math.min(population / 500000, 1);
    const incomeScore = Math.min(avgIncome / 40000, 1);
    const educationScore = educationLevel / 100;
    const densityScore = Math.min(businessDensity / 15, 1);
    
    const marketMatch = Math.round(
      (populationScore + incomeScore + educationScore + densityScore) * 100 / 4
    );
    
    const roi = Math.round(
      15 + (marketMatch / 100) * 20 + (franchise.brandStrength / 100) * 15
    );
    
    const locationFactor = 0.8 + (marketMatch / 100) * 0.4;
    const investment = Math.round(franchise.baseInvestment * locationFactor);
    
    const expansionPotential = Math.round(
      (populationScore * 40) + (densityScore * 30) + (franchise.brandStrength / 100 * 30)
    );
    
    return {
      name: franchise.name,
      investment,
      roi,
      marketMatch,
      requirements: franchise.requirements,
      category: franchise.category,
      expansionPotential,
      supportRating: franchise.supportRating,
      brandStrength: franchise.brandStrength,
      contact: FRANCHISE_CONTACT_INFO[franchise.name as keyof typeof FRANCHISE_CONTACT_INFO],
      advantages: FRANCHISE_CONTACT_INFO[franchise.name as keyof typeof FRANCHISE_CONTACT_INFO]?.advantages
    };
  });

  return recommendations.sort((a, b) => b.marketMatch - a.marketMatch);
}