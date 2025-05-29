import React from 'react';
import { MapPin, Brain, TrendingUp, Users, Building2, Zap, BarChart as ChartBar, Target, Shield, Globe } from 'lucide-react';

export function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Powerful Features for Smart Decisions
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Discover our comprehensive suite of tools designed to help you make data-driven location decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8">
              <div className="text-indigo-600 mb-6">
                <MapPin className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Location Intelligence</h3>
              <p className="text-gray-600 mb-6">
                Advanced location analytics powered by real-time data and machine learning algorithms.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Demographic Analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Foot Traffic Patterns
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Competitor Mapping
                </li>
              </ul>
            </div>

            <div className="glass-card p-8">
              <div className="text-indigo-600 mb-6">
                <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600 mb-6">
                Machine learning algorithms that analyze multiple data points to provide actionable insights.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Predictive Analytics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Success Probability
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Risk Assessment
                </li>
              </ul>
            </div>

            <div className="glass-card p-8">
              <div className="text-indigo-600 mb-6">
                <ChartBar className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Market Analysis</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive market research and competitor analysis tools.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Market Size Estimation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Competitor Analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Growth Potential
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Additional Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6">
              <div className="text-indigo-600 mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Investor Network</h3>
              <p className="text-gray-600">
                Connect with potential investors and explore business opportunities.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="text-indigo-600 mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Franchise Opportunities</h3>
              <p className="text-gray-600">
                Discover and analyze franchise opportunities in your target location.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="text-indigo-600 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
              <p className="text-gray-600">
                Comprehensive risk analysis and mitigation strategies.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="text-indigo-600 mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Coverage</h3>
              <p className="text-gray-600">
                Access data and insights from multiple cities worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Integrations & APIs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-3">Data Sources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Government Census Data</li>
                <li>Real Estate Markets</li>
                <li>Consumer Behavior</li>
                <li>Economic Indicators</li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-3">API Access</h3>
              <ul className="space-y-2 text-gray-600">
                <li>RESTful API</li>
                <li>Real-time Updates</li>
                <li>Custom Integrations</li>
                <li>Developer Tools</li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-3">Export Options</h3>
              <ul className="space-y-2 text-gray-600">
                <li>PDF Reports</li>
                <li>Excel Spreadsheets</li>
                <li>API Responses</li>
                <li>Custom Formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}