import React from 'react';
import { Building2, Store, Users, Clock, AlertTriangle, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import type { StoreAnalysis } from './types';

interface BusinessAnalysisProps {
  analysis: StoreAnalysis;
}

export function BusinessAnalysis({ analysis }: BusinessAnalysisProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold">{analysis.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Market Score:</span>
          <span className="text-lg font-bold text-indigo-600">{analysis.marketPotential}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Business Overview</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-500" />
              <span>Type: {analysis.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Customer Base: {analysis.customerBase}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Peak Hours: {analysis.peakHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gray-500" />
              <span>Competition Level: {analysis.competitionLevel}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Market Metrics</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Market Potential</span>
                <span>{analysis.marketPotential}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${analysis.marketPotential}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>Revenue Potential: High</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span>Growth Trend: Positive</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Strengths</h4>
          <ul className="space-y-1">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Weaknesses</h4>
          <ul className="space-y-1">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Opportunities</h4>
          <ul className="space-y-1">
            {analysis.opportunities.map((opportunity, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                {opportunity}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Threats</h4>
          <ul className="space-y-1">
            {analysis.threats.map((threat, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                {threat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendedActions.map((action, index) => (
            <div key={index} className="flex items-center gap-2 bg-indigo-50 p-3 rounded-lg">
              <ArrowRight className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-gray-700">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}