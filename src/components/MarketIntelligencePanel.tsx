import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Users,
  DollarSign,
  BarChart as ChartIcon,
  Activity,
  Zap
} from 'lucide-react';
import { marketIntelligence } from '../utils/marketIntelligence';
import type { LocationData } from '../types';
import toast from 'react-hot-toast';

interface MarketIntelligencePanelProps {
  location: LocationData;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

export function MarketIntelligencePanel({ location }: MarketIntelligencePanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const analyzeMarket = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await marketIntelligence.analyzeLocation(location);
        
        if (mounted) {
          setAnalysis(result);
        }
      } catch (error) {
        console.error('Error analyzing market:', error);
        if (mounted) {
          setError('Failed to analyze market data');
          toast.error('Market analysis failed');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    analyzeMarket();

    return () => {
      mounted = false;
    };
  }, [location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <h3 className="text-red-800 font-medium">Analysis Failed</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const { segment, demand, risk, recommendations } = analysis;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Market Intelligence Analysis</h2>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Market Segment</h3>
          </div>
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {segment + 1}
          </div>
          <p className="text-sm text-gray-600">
            Based on demographic and economic factors
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Market Demand</h3>
          </div>
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {demand.value.toFixed(1)}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Confidence:</div>
            <div className="text-sm font-medium">{demand.confidence.toFixed(1)}%</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Risk Assessment</h3>
          </div>
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {risk.level}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Probability:</div>
            <div className="text-sm font-medium">{risk.probability.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Demand Factors */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">Demand Factors</h3>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demand.factors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="importance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">Risk Factors</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risk.factors.map((factor, index) => (
            <div
              key={factor.factor}
              className={`p-4 rounded-lg border ${
                factor.impact > 66
                  ? 'border-red-200 bg-red-50'
                  : factor.impact > 33
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{factor.factor}</div>
                <div className={`text-sm font-medium ${
                  factor.impact > 66
                    ? 'text-red-700'
                    : factor.impact > 33
                    ? 'text-yellow-700'
                    : 'text-green-700'
                }`}>
                  {factor.impact}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    factor.impact > 66
                      ? 'bg-red-500'
                      : factor.impact > 33
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${factor.impact}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Market Recommendations</h3>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{rec.type}</div>
                  <div className="text-sm font-medium text-indigo-600">
                    {rec.score}% Match
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Investment: ₹{rec.investment.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    ROI: {(rec.profit / rec.investment * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}