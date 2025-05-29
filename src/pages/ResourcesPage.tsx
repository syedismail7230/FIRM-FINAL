import React from 'react';
import { FileText, Download, Book, Video, HelpCircle } from 'lucide-react';

export function ResourcesPage() {
  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using Firm AI for location analysis",
      type: "Guide",
      icon: Book,
      link: "#"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      type: "Video",
      icon: Video,
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      type: "Documentation",
      icon: FileText,
      link: "#"
    },
    {
      title: "Case Studies",
      description: "Real-world success stories and examples",
      type: "PDF",
      icon: Download,
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12">Resources</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.link}
                className="glass-card p-6 hover:scale-105 transition-transform"
              >
                <div className="text-indigo-600 mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {resource.type}
                </span>
              </a>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold">Need Help?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                Browse FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}