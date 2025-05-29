import React, { useState } from 'react';
import { Search, Book, FileText, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: "Getting Started",
      icon: Book,
      articles: [
        "How to create an account",
        "Understanding the dashboard",
        "Your first location analysis",
        "Reading analysis reports"
      ]
    },
    {
      title: "Features & Tools",
      icon: FileText,
      articles: [
        "Location intelligence basics",
        "Using the map interface",
        "Understanding traffic analysis",
        "Working with recommendations"
      ]
    },
    {
      title: "Account & Billing",
      icon: MessageCircle,
      articles: [
        "Managing your subscription",
        "Payment methods",
        "Billing FAQ",
        "Upgrading your plan"
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">How can we help you?</h1>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="glass-card p-6">
                <div className="text-indigo-600 mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                <ul className="space-y-2">
                  {category.articles.map((article, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <div className="text-indigo-600 mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Available Monday to Friday, 9am to 6pm IST
              </p>
              <a
                href="tel:+911234567890"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                +91 123 456 7890
              </a>
            </div>

            <div className="glass-card p-6">
              <div className="text-indigo-600 mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                We'll respond within 24 hours
              </p>
              <a
                href="mailto:support@firmai.com"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                support@firmai.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}