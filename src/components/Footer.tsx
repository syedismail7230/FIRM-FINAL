import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="glass mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Firm AI
            </h3>
            <p className="text-gray-600 mb-4">
              Making data-driven business location decisions simple and accurate with AI-powered insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Oxford Towers, Kodihalli, Bengaluru 560008</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5 text-indigo-600" />
                <a href="tel:+911234567890" className="hover:text-indigo-600 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5 text-indigo-600" />
                <a href="mailto:info@firmai.com" className="hover:text-indigo-600 transition-colors">
                  info@firmai.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Firm AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}