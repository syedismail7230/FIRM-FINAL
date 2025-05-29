import React from 'react';
import { Cookie, Shield, Settings, AlertTriangle } from 'lucide-react';

export function CookiesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-indigo-600 mb-4">
              <Cookie className="w-12 h-12 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-gray-600">
              Last updated: March 15, 2025
            </p>
          </div>

          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
              <p className="text-gray-600">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us make your experience better by remembering your preferences and providing essential functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-gray-600">
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Settings className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Preference Cookies</h3>
                    <p className="text-gray-600">
                      These cookies remember your settings and preferences to enhance your experience and customize content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-gray-600">
                      These cookies collect information about how you use our website, helping us understand and improve our services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Browser settings to block or delete cookies</li>
                <li>Our cookie consent tool to customize preferences</li>
                <li>Third-party browser plugins to manage tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div className="glass p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Session Cookies</h3>
                  <p className="text-gray-600">
                    Temporary cookies that expire when you close your browser.
                  </p>
                </div>
                <div className="glass p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                  <p className="text-gray-600">
                    Cookies that stay on your device for a set period.
                  </p>
                </div>
                <div className="glass p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Third-Party Cookies</h3>
                  <p className="text-gray-600">
                    Cookies placed by external services we use.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about our Cookie Policy, please contact us:
              </p>
              <div className="mt-4">
                <p className="text-gray-600">Email: privacy@firmai.com</p>
                <p className="text-gray-600">Phone: +91 123 456 7890</p>
                <p className="text-gray-600">Address: 123 Business Street, New Delhi, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}