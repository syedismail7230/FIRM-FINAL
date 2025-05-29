import React from 'react';
import { TrendingUp, AlertTriangle, Clock, Users, Wallet, BarChart as ChartBar } from 'lucide-react';
import type { BusinessRecommendation } from '../types';

interface BusinessCardProps {
  recommendation: BusinessRecommendation;
}

export function BusinessCard({ recommendation }: BusinessCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSuccessProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'bg-green-600';
    if (probability >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">{recommendation.type}</h3>
        <div className="text-2xl font-bold text-indigo-600">{recommendation.score}%</div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Wallet className="w-4 h-4" />
            Initial Investment
          </p>
          <p className="text-lg font-semibold">₹{recommendation.investment.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Annual Revenue
          </p>
          <p className="text-lg font-semibold">₹{recommendation.revenue.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <ChartBar className="w-4 h-4" />
            Annual Profit
          </p>
          <p className="text-lg font-semibold">₹{recommendation.profit.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Users className="w-4 h-4" />
            Competitors
          </p>
          <p className="text-lg font-semibold">{recommendation.competitorCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">Success Probability</span>
            <span className="text-sm font-medium">{recommendation.successProbability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getSuccessProbabilityColor(recommendation.successProbability)}`}
              style={{ width: `${recommendation.successProbability}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Break-even: {recommendation.breakEven} months</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className={`w-4 h-4 ${getRiskColor(recommendation.risk)}`} />
            <span className={`text-sm font-medium ${getRiskColor(recommendation.risk)}`}>
              {recommendation.risk} Risk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}