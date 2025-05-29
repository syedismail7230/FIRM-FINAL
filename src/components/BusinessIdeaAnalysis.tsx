import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line
} from 'recharts';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Users,
  Briefcase,
  Building,
  Award,
  Clock,
  DollarSign,
  Shield,
  Target,
  BarChart as ChartIcon,
  Map,
  Zap,
  HelpCircle,
  Sparkles,
  Brain,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Store,
  Dumbbell
} from 'lucide-react';
import type {
  BusinessIdeaAnalysis as BusinessIdeaAnalysisType,
  LocationData
} from '../types';
import { generateBusinessIdeaAnalysis } from '../utils/businessIdeaAnalyzer';

interface BusinessIdeaAnalysisProps {
  location: LocationData;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

const BusinessTypeCard = ({ type, icon: Icon, description, selected, onClick }: any) => (
  <div
    className={`relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer rounded-xl p-6 ${
      selected 
        ? 'bg-indigo-600 text-white transform scale-105 shadow-xl' 
        : 'bg-white hover:bg-indigo-50'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3 mb-2">
      <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-indigo-600'}`} />
      <h3 className="text-lg font-semibold">{type}</h3>
    </div>
    <p className={`text-sm ${selected ? 'text-indigo-100' : 'text-gray-600'}`}>
      {description}
    </p>
    {selected && (
      <div className="absolute bottom-2 right-2">
        <CheckCircle2 className="w-5 h-5 text-white" />
      </div>
    )}
  </div>
);

export function BusinessIdeaAnalysis({ location }: BusinessIdeaAnalysisProps) {
  const [businessType, setBusinessType] = useState('Café');
  const [analysis, setAnalysis] = useState<BusinessIdeaAnalysisType | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const businessTypes = [
    {
      type: 'Café',
      icon: Briefcase,
      description: 'Start a cozy café serving specialty coffee and light meals'
    },
    {
      type: 'Restaurant',
      icon: Building,
      description: 'Open a full-service restaurant with unique cuisine'
    },
    {
      type: 'Retail Store',
      icon: Store,
      description: 'Launch a retail store with curated products'
    },
    {
      type: 'Gym',
      icon: Dumbbell,
      description: 'Establish a modern fitness center with latest equipment'
    },
    {
      type: 'Coworking Space',
      icon: Users,
      description: 'Create a flexible workspace for professionals'
    }
  ];

  const handleAnalyze = async () => {
    setShowAnalysis(true);
    setAnimationStep(0);
    
    const result = generateBusinessIdeaAnalysis(location, businessType);
    setAnalysis(result);
    
    // Animate sections appearing one by one
    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnimationStep(i);
    }
  };

  if (!showAnalysis) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">Business Idea Analysis</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-semibold">What's your business idea?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {businessTypes.map((bt) => (
                <BusinessTypeCard
                  key={bt.type}
                  {...bt}
                  selected={businessType === bt.type}
                  onClick={() => setBusinessType(bt.type)}
                />
              ))}
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Map className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold">Selected Location</h4>
              </div>
              <p className="text-gray-700">{location.name}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-gray-600">Population:</span>
                  <span className="ml-2 font-medium">{location.population.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg. Income:</span>
                  <span className="ml-2 font-medium">₹{location.avgIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Rocket className="w-5 h-5" />
              Analyze Business Potential
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">Analysis Results</h2>
        </div>
        <button
          onClick={() => setShowAnalysis(false)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
        >
          <ArrowRight className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      <div className={`transition-opacity duration-500 ${animationStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        {/* Success Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">{businessType} in {location.name}</h3>
                <p className="text-gray-600">Overall Business Potential Analysis</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-600 mb-1">
                  {analysis.successProbability}%
                </div>
                <div className="text-sm text-gray-600">Success Probability</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-semibold">ROI Potential</h4>
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {analysis.roi.value}%
                </div>
                <p className="text-sm text-gray-600">
                  Expected in {analysis.roi.timeframe}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-semibold">Market Size</h4>
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {location.population.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">
                  Potential Customers
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-semibold">Competition</h4>
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {analysis.competitorAnalysis.totalCompetitors}
                </div>
                <p className="text-sm text-gray-600">
                  Direct Competitors
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your existing analysis sections with animation steps */}
      {/* ... */}
    </div>
  );
}