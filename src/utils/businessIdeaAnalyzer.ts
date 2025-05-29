import type {
  BusinessIdeaAnalysis,
  LocationData,
  BusinessResource,
  SupportProgram,
  RiskFactor,
  MarketTrend,
  CompetitorAnalysis,
  DemographicData
} from '../types';

// Helper function to generate a random number within a range
const randomInRange = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max - min));
};

// Helper function to generate a random element from an array
const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Business type specific data
const BUSINESS_TYPE_DATA = {
  'Café': {
    baseSuccessProbability: 65,
    baseRoi: 35,
    breakEvenMonths: 18,
    populationWeight: 0.8,
    incomeWeight: 0.7,
    educationWeight: 0.6,
    competitorImpact: 0.9,
    resources: [
      { name: 'Coffee Equipment', type: 'Physical', baseAvailability: 75, baseCost: 500000, importance: 90 },
      { name: 'Trained Baristas', type: 'Human', baseAvailability: 60, baseCost: 300000, importance: 85 },
      { name: 'Coffee Beans Supply', type: 'Physical', baseAvailability: 80, baseCost: 200000, importance: 95 },
      { name: 'Interior Design', type: 'Physical', baseAvailability: 70, baseCost: 400000, importance: 75 },
      { name: 'POS System', type: 'Digital', baseAvailability: 90, baseCost: 100000, importance: 70 }
    ],
    riskFactors: [
      { name: 'High Rent', baseProbability: 70, baseImpact: 80, mitigation: 'Negotiate long-term lease with caps on increases' },
      { name: 'Staff Turnover', baseProbability: 60, baseImpact: 50, mitigation: 'Competitive wages and career development opportunities' },
      { name: 'Supply Chain Disruption', baseProbability: 40, baseImpact: 70, mitigation: 'Multiple suppliers and local sourcing where possible' },
      { name: 'Changing Consumer Preferences', baseProbability: 50, baseImpact: 60, mitigation: 'Regular menu updates and customer feedback loops' }
    ],
    marketTrends: [
      { name: 'Specialty Coffee Demand', direction: 'Up', impact: 'Positive', description: 'Growing interest in artisanal and specialty coffee', timeframe: '3-5 years' },
      { name: 'Remote Work Culture', direction: 'Up', impact: 'Positive', description: 'Increased demand for "third places" to work from', timeframe: '2-4 years' },
      { name: 'Health Consciousness', direction: 'Up', impact: 'Neutral', description: 'Growing demand for healthier food and drink options', timeframe: '1-3 years' },
      { name: 'Sustainability Focus', direction: 'Up', impact: 'Positive', description: 'Increased consumer preference for eco-friendly businesses', timeframe: '3-7 years' }
    ],
    competitiveAdvantages: [
      'Unique specialty coffee blends not available elsewhere',
      'Comfortable workspace environment with reliable high-speed internet',
      'Extended operating hours compared to competitors',
      'Loyalty program with personalized recommendations',
      'Partnership with local bakeries for fresh pastries'
    ]
  },
  'Restaurant': {
    baseSuccessProbability: 55,
    baseRoi: 40,
    breakEvenMonths: 24,
    populationWeight: 0.9,
    incomeWeight: 0.8,
    educationWeight: 0.5,
    competitorImpact: 0.8,
    resources: [
      { name: 'Kitchen Equipment', type: 'Physical', baseAvailability: 80, baseCost: 1500000, importance: 95 },
      { name: 'Skilled Chefs', type: 'Human', baseAvailability: 50, baseCost: 800000, importance: 90 },
      { name: 'Fresh Ingredients Supply', type: 'Physical', baseAvailability: 70, baseCost: 500000, importance: 95 },
      { name: 'Restaurant Space', type: 'Physical', baseAvailability: 60, baseCost: 2000000, importance: 85 },
      { name: 'Reservation System', type: 'Digital', baseAvailability: 90, baseCost: 150000, importance: 70 }
    ],
    riskFactors: [
      { name: 'Food Cost Inflation', baseProbability: 75, baseImpact: 80, mitigation: 'Dynamic menu pricing and seasonal ingredients' },
      { name: 'Chef Turnover', baseProbability: 65, baseImpact: 85, mitigation: 'Competitive compensation and creative freedom' },
      { name: 'Regulatory Compliance', baseProbability: 50, baseImpact: 70, mitigation: 'Regular training and compliance audits' },
      { name: 'Changing Dining Trends', baseProbability: 60, baseImpact: 75, mitigation: 'Menu innovation and customer feedback analysis' }
    ],
    marketTrends: [
      { name: 'Food Delivery Demand', direction: 'Up', impact: 'Positive', description: 'Continued growth in delivery and takeout options', timeframe: '2-4 years' },
      { name: 'Plant-Based Options', direction: 'Up', impact: 'Positive', description: 'Increasing demand for vegetarian and vegan menu items', timeframe: '3-5 years' },
      { name: 'Experience Dining', direction: 'Up', impact: 'Positive', description: 'Growing preference for unique dining experiences', timeframe: '2-5 years' },
      { name: 'Local Sourcing', direction: 'Up', impact: 'Positive', description: 'Increased consumer interest in locally sourced ingredients', timeframe: '3-6 years' }
    ],
    competitiveAdvantages: [
      'Signature dishes unique to your restaurant',
      'Farm-to-table concept with local ingredient sourcing',
      'Open kitchen concept for transparency and entertainment',
      'Chefs tasting menu with seasonal rotations',
      'Specialized cuisine underrepresented in the area'
    ]
  },
  'Retail Store': {
    baseSuccessProbability: 60,
    baseRoi: 30,
    breakEvenMonths: 30,
    populationWeight: 0.7,
    incomeWeight: 0.9,
    educationWeight: 0.4,
    competitorImpact: 0.7,
    resources: [
      { name: 'Retail Space', type: 'Physical', baseAvailability: 70, baseCost: 1200000, importance: 90 },
      { name: 'Inventory', type: 'Physical', baseAvailability: 85, baseCost: 1500000, importance: 95 },
      { name: 'Sales Staff', type: 'Human', baseAvailability: 80, baseCost: 500000, importance: 75 },
      { name: 'Store Fixtures', type: 'Physical', baseAvailability: 90, baseCost: 400000, importance: 70 },
      { name: 'Inventory Management System', type: 'Digital', baseAvailability: 85, baseCost: 200000, importance: 80 }
    ],
    riskFactors: [
      { name: 'E-commerce Competition', baseProbability: 85, baseImpact: 90, mitigation: 'Omnichannel strategy with unique in-store experiences' },
      { name: 'Inventory Management', baseProbability: 70, baseImpact: 75, mitigation: 'Just-in-time inventory and data-driven purchasing' },
      { name: 'Seasonal Fluctuations', baseProbability: 80, baseImpact: 60, mitigation: 'Diversified product mix and seasonal promotions' },
      { name: 'Theft and Shrinkage', baseProbability: 60, baseImpact: 50, mitigation: 'Security systems and inventory control procedures' }
    ],
    marketTrends: [
      { name: 'Experiential Retail', direction: 'Up', impact: 'Positive', description: 'Growing demand for unique in-store experiences', timeframe: '2-5 years' },
      { name: 'Omnichannel Shopping', direction: 'Up', impact: 'Neutral', description: 'Consumers expect seamless online and offline integration', timeframe: '1-3 years' },
      { name: 'Sustainable Products', direction: 'Up', impact: 'Positive', description: 'Increasing preference for eco-friendly and sustainable goods', timeframe: '3-7 years' },
      { name: 'Personalization', direction: 'Up', impact: 'Positive', description: 'Growing demand for personalized products and services', timeframe: '2-4 years' }
    ],
    competitiveAdvantages: [
      'Curated product selection not available at mass retailers',
      'In-store events and workshops to build community',
      'Personalized shopping assistance and styling services',
      'Flexible return policy compared to competitors',
      'Exclusive product lines or local artisan partnerships'
    ]
  },
  'Gym': {
    baseSuccessProbability: 70,
    baseRoi: 45,
    breakEvenMonths: 20,
    populationWeight: 0.8,
    incomeWeight: 0.7,
    educationWeight: 0.8,
    competitorImpact: 0.6,
    resources: [
      { name: 'Fitness Equipment', type: 'Physical', baseAvailability: 85, baseCost: 2500000, importance: 95 },
      { name: 'Qualified Trainers', type: 'Human', baseAvailability: 70, baseCost: 800000, importance: 90 },
      { name: 'Gym Space', type: 'Physical', baseAvailability: 65, baseCost: 1800000, importance: 85 },
      { name: 'Membership Management System', type: 'Digital', baseAvailability: 90, baseCost: 300000, importance: 75 },
      { name: 'Locker Room Facilities', type: 'Physical', baseAvailability: 80, baseCost: 600000, importance: 70 }
    ],
    riskFactors: [
      { name: 'Seasonal Membership Fluctuations', baseProbability: 80, baseImpact: 60, mitigation: 'Annual membership incentives and seasonal promotions' },
      { name: 'Equipment Maintenance', baseProbability: 70, baseImpact: 65, mitigation: 'Regular maintenance schedule and equipment warranties' },
      { name: 'Trainer Turnover', baseProbability: 60, baseImpact: 70, mitigation: 'Competitive compensation and professional development' },
      { name: 'Fitness Trend Changes', baseProbability: 75, baseImpact: 80, mitigation: 'Diverse class offerings and regular program updates' }
    ],
    marketTrends: [
      { name: 'Functional Fitness', direction: 'Up', impact: 'Positive', description: 'Growing interest in functional training and HIIT workouts', timeframe: '2-5 years' },
      { name: 'Digital Fitness Integration', direction: 'Up', impact: 'Neutral', description: 'Increasing demand for hybrid in-person and digital offerings', timeframe: '1-4 years' },
      { name: 'Wellness Focus', direction: 'Up', impact: 'Positive', description: 'Shift from pure fitness to overall wellness and recovery', timeframe: '3-6 Wellness Focus', direction: 'Up', impact: 'Positive', description: 'Shift from pure fitness to overall wellness and recovery', timeframe: '3-6 years' },
      
      { name: 'Community-Based Fitness', direction: 'Up', impact: 'Positive', description: 'Growing preference for community and group fitness experiences', timeframe: '2-5 years' }
    ],
    competitiveAdvantages: [
      'Specialized equipment or training methodology not available at other gyms',
      'Extended hours compared to competitors',
      'Comprehensive wellness services beyond just fitness',
      'Community events and challenges to increase engagement',
      'Personalized fitness tracking and progress monitoring'
    ]
  },
  'Coworking Space': {
    baseSuccessProbability: 75,
    baseRoi: 35,
    breakEvenMonths: 36,
    populationWeight: 0.6,
    incomeWeight: 0.9,
    educationWeight: 0.9,
    competitorImpact: 0.7,
    resources: [
      { name: 'Office Space', type: 'Physical', baseAvailability: 75, baseCost: 3000000, importance: 95 },
      { name: 'High-Speed Internet', type: 'Digital', baseAvailability: 90, baseCost: 500000, importance: 95 },
      { name: 'Office Furniture', type: 'Physical', baseAvailability: 95, baseCost: 1000000, importance: 85 },
      { name: 'Booking System', type: 'Digital', baseAvailability: 90, baseCost: 200000, importance: 80 },
      { name: 'Support Staff', type: 'Human', baseAvailability: 85, baseCost: 600000, importance: 75 }
    ],
    riskFactors: [
      { name: 'Remote Work Policies', baseProbability: 70, baseImpact: 85, mitigation: 'Target freelancers and small businesses, not just corporate remote workers' },
      { name: 'Long-Term Lease Commitments', baseProbability: 75, baseImpact: 90, mitigation: 'Flexible lease terms and subletting options' },
      { name: 'Technology Failures', baseProbability: 50, baseImpact: 80, mitigation: 'Redundant systems and backup internet connections' },
      { name: 'Occupancy Fluctuations', baseProbability: 65, baseImpact: 70, mitigation: 'Diverse membership options and event space rentals' }
    ],
    marketTrends: [
      { name: 'Hybrid Work Models', direction: 'Up', impact: 'Positive', description: 'Growing adoption of hybrid remote/office work arrangements', timeframe: '2-5 years' },
      { name: 'Suburban Coworking', direction: 'Up', impact: 'Positive', description: 'Increasing demand for coworking spaces outside city centers', timeframe: '3-6 years' },
      { name: 'Enterprise Coworking', direction: 'Up', impact: 'Positive', description: 'More corporations using flexible workspaces for distributed teams', timeframe: '2-4 years' },
      { name: 'Specialized Workspaces', direction: 'Up', impact: 'Positive', description: 'Growing demand for industry-specific coworking environments', timeframe: '3-7 years' }
    ],
    competitiveAdvantages: [
      'Industry-specific amenities and resources',
      'Premium technology infrastructure beyond basic internet',
      'Flexible 24/7 access compared to limited hours elsewhere',
      'Community programming and networking opportunities',
      'Partnerships with local businesses for member benefits'
    ]
  }
};

// Support programs data
const SUPPORT_PROGRAMS = [
  {
    name: 'MSME Business Loan Scheme',
    provider: 'Ministry of Micro, Small & Medium Enterprises',
    type: 'Government',
    benefit: 'Low-interest loans up to ₹2 Cr with minimal collateral requirements',
    eligibility: 'Registered MSMEs with 2+ years of operation',
    applicationProcess: 'Online application through MSME portal with business plan submission',
    contactInfo: {
      website: 'https://msme.gov.in',
      email: 'info@msme.gov.in',
      phone: '1800-111-555'
    }
  },
  {
    name: 'Startup India Seed Fund',
    provider: 'Department for Promotion of Industry and Internal Trade',
    type: 'Government',
    benefit: 'Seed funding up to ₹50 lakhs for early-stage startups',
    eligibility: 'DPIIT-recognized startups less than 2 years old',
    applicationProcess: 'Application through Startup India portal with pitch deck',
    contactInfo: {
      website: 'https://startupindia.gov.in',
      email: 'dipp-startups@gov.in',
      phone: '1800-115-565'
    }
  },
  {
    name: 'SIDBI Assistance to Micro Enterprises',
    provider: 'Small Industries Development Bank of India',
    type: 'Government',
    benefit: 'Term loans and working capital up to ₹50 lakhs',
    eligibility: 'Micro enterprises with viable business plans',
    applicationProcess: 'Apply through SIDBI portal or nearest branch',
    contactInfo: {
      website: 'https://sidbi.in',
      email: 'info@sidbi.in',
      phone: '1800-226-753'
    }
  },
  {
    name: 'Entrepreneurship Development Program',
    provider: 'National Institute for Entrepreneurship and Small Business Development',
    type: 'Government',
    benefit: 'Training, mentorship, and networking opportunities',
    eligibility: 'Aspiring and existing entrepreneurs',
    applicationProcess: 'Register for programs through NIESBUD website',
    contactInfo: {
      website: 'https://niesbud.nic.in',
      email: 'info@niesbud.nic.in',
      phone: '0120-2403051'
    }
  },
  {
    name: 'Business Accelerator Program',
    provider: 'TiE (The Indus Entrepreneurs)',
    type: 'Private',
    benefit: 'Mentorship, networking, and potential investor connections',
    eligibility: 'Early-stage businesses with growth potential',
    applicationProcess: 'Apply during cohort intake periods through TiE website',
    contactInfo: {
      website: 'https://tie.org',
      email: 'info@tie.org',
      phone: '080-4147-2222'
    }
  },
  {
    name: 'Women Entrepreneurship Platform',
    provider: 'NITI Aayog',
    type: 'Government',
    benefit: 'Incubation, funding access, and mentorship for women entrepreneurs',
    eligibility: 'Women-owned or women-led businesses',
    applicationProcess: 'Register on the WEP portal',
    contactInfo: {
      website: 'https://wep.gov.in',
      email: 'wep@gov.in',
      phone: '011-2309-6574'
    }
  },
  {
    name: 'Angel Investment Network',
    provider: 'Indian Angel Network',
    type: 'Private',
    benefit: 'Access to angel investors and funding opportunities',
    eligibility: 'Startups with innovative business models and growth potential',
    applicationProcess: 'Submit business plan through IAN website',
    contactInfo: {
      website: 'https://indianangelnetwork.com',
      email: 'info@indianangelnetwork.com',
      phone: '011-4232-6025'
    }
  },
  {
    name: 'Incubation Program',
    provider: 'T-Hub',
    type: 'Private',
    benefit: 'Workspace, mentorship, and investor connections',
    eligibility: 'Tech startups with innovative solutions',
    applicationProcess: 'Apply during cohort intake through T-Hub website',
    contactInfo: {
      website: 'https://t-hub.co',
      email: 'info@t-hub.co',
      phone: '040-4567-8300'
    }
  },
  {
    name: 'Business Development Services',
    provider: 'Federation of Indian Chambers of Commerce & Industry',
    type: 'NGO',
    benefit: 'Business advisory, market linkages, and policy advocacy',
    eligibility: 'FICCI members and SMEs',
    applicationProcess: 'Register through FICCI website',
    contactInfo: {
      website: 'https://ficci.in',
      email: 'ficci@ficci.com',
      phone: '011-2373-8760'
    }
  },
  {
    name: 'Entrepreneurship Research Program',
    provider: 'Indian Institute of Management',
    type: 'Academic',
    benefit: 'Research support, business model validation, and academic resources',
    eligibility: 'Innovative business concepts with research components',
    applicationProcess: 'Submit research proposal to relevant IIM',
    contactInfo: {
      website: 'https://iim.ac.in',
      email: 'research@iim.ac.in',
      phone: '080-2699-3000'
    }
  }
];

// Generate demographic data based on location
const generateDemographicData = (location: LocationData): DemographicData => {
  // Adjust age distribution based on location characteristics
  const youngAdultRatio = Math.min(0.4, 0.25 + (location.educationLevel / 200));
  const middleAgedRatio = Math.min(0.45, 0.3 + (location.avgIncome / 100000));
  const seniorRatio = Math.max(0.1, 1 - youngAdultRatio - middleAgedRatio);

  // Adjust income distribution based on location characteristics
  const highIncomeRatio = Math.min(0.3, location.avgIncome / 150000);
  const middleIncomeRatio = Math.min(0.5, 0.3 + (location.avgIncome / 100000));
  const lowIncomeRatio = Math.max(0.1, 1 - highIncomeRatio - middleIncomeRatio);

  // Adjust education distribution based on location characteristics
  const highEduRatio = location.educationLevel / 100;
  const mediumEduRatio = Math.min(0.5, (100 - location.educationLevel) / 150);
  const lowEduRatio = Math.max(0.1, 1 - highEduRatio - mediumEduRatio);

  return {
    age_groups: [
      { label: '18-24', value: Math.round(youngAdultRatio * 40) },
      { label: '25-34', value: Math.round(youngAdultRatio * 60) },
      { label: '35-44', value: Math.round(middleAgedRatio * 50) },
      { label: '45-54', value: Math.round(middleAgedRatio * 50) },
      { label: '55+', value: Math.round(seniorRatio * 100) }
    ],
    income_levels: [
      { label: 'Low', value: Math.round(lowIncomeRatio * 100) },
      { label: 'Medium', value: Math.round(middleIncomeRatio * 100) },
      { label: 'High', value: Math.round(highIncomeRatio * 100) }
    ],
    education_levels: [
      { label: 'Primary', value: Math.round(lowEduRatio * 100) },
      { label: 'Secondary', value: Math.round(mediumEduRatio * 100) },
      { label: 'Higher', value: Math.round(highEduRatio * 100) }
    ]
  };
};

// Generate resources based on business type and location
const generateResources = (businessType: string, location: LocationData): BusinessResource[] => {
  const businessData = BUSINESS_TYPE_DATA[businessType as keyof typeof BUSINESS_TYPE_DATA];
  
  return businessData.resources.map(resource => {
    // Adjust availability based on location characteristics
    const availabilityModifier = 
      (location.businessDensity / 10) * 0.1 + 
      (location.population / 500000) * 0.1 +
      (location.avgIncome / 50000) * 0.1;
    
    const availability = Math.min(100, Math.max(10, 
      Math.round(resource.baseAvailability * (0.8 + availabilityModifier))
    ));
    
    // Adjust cost based on location characteristics
    const costModifier = 
      (location.businessDensity / 10) * 0.2 + 
      (location.avgIncome / 50000) * 0.3;
    
    const cost = Math.round(resource.baseCost * (1 + costModifier));
    
    return {
      name: resource.name,
      type: resource.type as 'Financial' | 'Human' | 'Physical' | 'Intellectual' | 'Digital',
      availability,
      cost,
      importance: resource.importance
    };
  });
};

// Generate support programs based on business type and location
const generateSupportPrograms = (businessType: string, location: LocationData): SupportProgram[] => {
  // Select a subset of support programs based on business type and location
  const numPrograms = randomInRange(3, 6);
  const shuffledPrograms = [...SUPPORT_PROGRAMS].sort(() => 0.5 - Math.random());
  
  return shuffledPrograms.slice(0, numPrograms);
};

// Generate risk factors based on business type and location
const generateRiskFactors = (businessType: string, location: LocationData): RiskFactor[] => {
  const businessData = BUSINESS_TYPE_DATA[businessType as keyof typeof BUSINESS_TYPE_DATA];
  
  return businessData.riskFactors.map(risk => {
    // Adjust probability based on location characteristics
    const probabilityModifier = 
      (location.competitorCount / 5) * 0.1 + 
      (10 / location.businessDensity) * 0.1 -
      (location.avgIncome / 100000) * 0.1;
    
    const probability = Math.min(100, Math.max(10, 
      Math.round(risk.baseProbability * (1 + probabilityModifier))
    ));
    
    // Adjust impact based on location characteristics
    const impactModifier = 
      (location.competitorCount / 5) * 0.1 + 
      (10 / location.businessDensity) * 0.1;
    
    const impact = Math.min(100, Math.max(10, 
      Math.round(risk.baseImpact * (1 + impactModifier))
    ));
    
    return {
      name: risk.name,
      probability,
      impact,
      mitigationStrategy: risk.mitigation
    };
  });
};

// Generate market trends based on business type
const generateMarketTrends = (businessType: string): MarketTrend[] => {
  const businessData = BUSINESS_TYPE_DATA[businessType as keyof typeof BUSINESS_TYPE_DATA];
  return businessData.marketTrends;
};

// Generate competitor analysis based on business type and location
const generateCompetitorAnalysis = (businessType: string, location: LocationData): CompetitorAnalysis => {
  const totalCompetitors = location.competitorCount;
  const directCompetitors = Math.round(totalCompetitors * 0.6);
  const indirectCompetitors = totalCompetitors - directCompetitors;
  
  // Generate market leader data
  const marketLeaderShare = randomInRange(25, 40);
  
  // Select competitive advantages
  const businessData = BUSINESS_TYPE_DATA[businessType as keyof typeof BUSINESS_TYPE_DATA];
  const shuffledAdvantages = [...businessData.competitiveAdvantages].sort(() => 0.5 - Math.random());
  const selectedAdvantages = shuffledAdvantages.slice(0, randomInRange(3, 5));
  
  return {
    totalCompetitors,
    directCompetitors,
    indirectCompetitors,
    marketLeader: {
      name: `Leading ${businessType}`,
      marketShare: marketLeaderShare,
      strengths: [
        'Established brand recognition',
        'Prime location',
        'Loyal customer base'
      ],
      weaknesses: [
        'Higher pricing',
        'Limited innovation',
        'Inconsistent service quality'
      ]
    },
    competitiveAdvantage: selectedAdvantages
  };
};

// Calculate success probability based on business type and location
const calculateSuccessProbability = (businessType: string, location: LocationData): number => {
  const businessData = BUSINESS_TYPE_DATA[businessType as keyof typeof BUSINESS_TYPE_DATA];
  
  const populationScore = Math.min(location.population / 500000, 1) * businessData.populationWeight;
  const incomeScore = Math.min(location.avgIncome / 50000, 1) * businessData.incomeWeight;
  const educationScore = (location.educationLevel / 100) * businessData.educationWeight;
  const competitionScore = Math.max(0, 1 - (location.competitorCount / 10) * businessData.competitorImpact);
  const densityScore = Math.min(location.businessDensity / 20, 1);
  
  const baseScore = businessData.baseSuccessProbability;
  const locationScore = (populationScore + incomeScore + educationScore + competitionScore + densityScore) * 20;
  
  return Math.min(95, Math.max(5, Math.round(baseScore + locationScore - 50)));
};

// Calculate ROI based on business type and location
const calculateROI = (businessType: string, location: LocationData): { value: number, timeframe: string, breakEvenMonths: number } => {
  const businessData = BUSINESS_TYPE_DATA[businessType as keyof typeof BUSINESS_TYPE_DATA];
  
  const baseRoi = businessData.baseRoi;
  const baseBreakEven = businessData.breakEvenMonths;
  
  // Adjust ROI based on location characteristics
  const roiModifier = 
    (location.avgIncome / 50000) * 0.2 + 
    (location.population / 500000) * 0.1 -
    (location.competitorCount / 5) * 0.15 +
    (location.businessDensity / 10) * 0.1;
  
  const roi = Math.max(5, Math.round(baseRoi * (1 + roiModifier)));
  
  // Adjust break-even period based on location characteristics
  const breakEvenModifier = 
    (location.competitorCount / 5) * 0.2 - 
    (location.avgIncome / 50000) * 0.1 -
    (location.population / 500000) * 0.1;
  
  const breakEvenMonths = Math.max(6, Math.round(baseBreakEven * (1 + breakEvenModifier)));
  
  // Determine timeframe
  let timeframe = '1-2 years';
  if (breakEvenMonths <= 12) {
    timeframe = 'Under 1 year';
  } else if (breakEvenMonths <= 24) {
    timeframe = '1-2 years';
  } else if (breakEvenMonths <= 36) {
    timeframe = '2-3 years';
  } else {
    timeframe = '3+ years';
  }
  
  return { value: roi, timeframe, breakEvenMonths };
};

// Main function to generate business idea analysis
export function generateBusinessIdeaAnalysis(location: LocationData, businessType: string): BusinessIdeaAnalysis {
  const successProbability = calculateSuccessProbability(businessType, location);
  const resources = generateResources(businessType, location);
  const supportPrograms = generateSupportPrograms(businessType, location);
  const demographics = generateDemographicData(location);
  const roi = calculateROI(businessType, location);
  const riskFactors = generateRiskFactors(businessType, location);
  const marketTrends = generateMarketTrends(businessType);
  const competitorAnalysis = generateCompetitorAnalysis(businessType, location);
  
  return {
    businessType,
    location,
    successProbability,
    resources,
    supportPrograms,
    demographics,
    roi,
    riskFactors,
    marketTrends,
    competitorAnalysis
  };
}