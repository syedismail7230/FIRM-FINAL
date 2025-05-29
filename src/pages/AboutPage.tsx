import React from 'react';
import { Users, Target, Award, Zap, Building2, Brain } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              About Firm AI
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              We're revolutionizing how businesses choose their locations through AI-powered insights and data-driven decision making.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600">
              To empower entrepreneurs and businesses with data-driven insights for making confident location decisions, ultimately increasing their chances of success in today's competitive market.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="text-indigo-600 mb-4 flex justify-center">
                <Target className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accuracy</h3>
              <p className="text-gray-600">
                We prioritize precise, reliable data to ensure our recommendations are trustworthy and actionable.
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-indigo-600 mb-4 flex justify-center">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously evolve our technology to provide cutting-edge solutions for our users.
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-indigo-600 mb-4 flex justify-center">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Our success is measured by the success of our customers and their businesses.
              </p>
            </div>
          </div>
        </div>
      </div>

      
      {/* Stats Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10+</div>
              <p className="text-gray-600">Businesses Analyzed</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
              <p className="text-gray-600">Cities Covered</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}