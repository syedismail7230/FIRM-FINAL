import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-indigo-600 mb-4">
              <Lock className="w-12 h-12 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-600">
              Last updated: March 15, 2025
            </p>
          </div>

          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                At Firm AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Name and contact information</li>
                      <li>Account credentials</li>
                      <li>Business information</li>
                      <li>Payment information</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Database className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Usage Data</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Location analyses performed</li>
                      <li>Features accessed</li>
                      <li>Time spent on platform</li>
                      <li>Technical information about your device</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-600 mb-4">
                    We implement appropriate technical and organizational security measures to protect your personal information, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>End-to-end encryption for sensitive data</li>
                    <li>Regular security assessments</li>
                    <li>Secure data storage practices</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-600 mb-4">
                    We may share your information with:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Service providers and business partners</li>
                    <li>Law enforcement when required by law</li>
                    <li>Other users with your explicit consent</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to delete your data</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600">
                  Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us:
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