import React from 'react';
import { Shield, Lock, FileText } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-indigo-600 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-600">
              Last updated: March 15, 2025
            </p>
          </div>

          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                Welcome to Firm AI. By accessing our website and using our services, you agree to these terms and conditions. Please read them carefully before proceeding to use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>"Service" refers to the Firm AI platform and all its features</li>
                <li>"User" refers to any individual or entity using our Service</li>
                <li>"Content" refers to all data, analyses, and reports generated through our Service</li>
                <li>"Account" refers to your registered profile on our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>
              <p className="text-gray-600 mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Maintaining the confidentiality of their account credentials</li>
                <li>Providing accurate information when using our services</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Using the service in a manner that doesn't disrupt other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Service Usage</h2>
              <p className="text-gray-600 mb-4">
                Our service is provided "as is" and "as available." While we strive for accuracy, we cannot guarantee:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>100% accuracy of all data and analyses</li>
                <li>Uninterrupted access to the service</li>
                <li>Success of business decisions based on our analyses</li>
                <li>Availability of all features at all times</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-gray-600">
                All content, features, and functionality of our service are owned by Firm AI and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Privacy & Data</h2>
              <p className="text-gray-600">
                We collect and process personal data as outlined in our Privacy Policy. By using our service, you consent to such processing and warrant that all data provided by you is accurate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
              <p className="text-gray-600">
                We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4">
                <p className="text-gray-600">Email: legal@firmai.com</p>
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