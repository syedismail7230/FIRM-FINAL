import React from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={6}
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="glass-card p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">info@firmai.com</p>
                      <p className="text-gray-600">support@firmai.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">+91 123 456 7890</p>
                      <p className="text-gray-600">+91 098 765 4321</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600">
                        Oxford Towers, Kodihalli, 
                        <br />
                        Bengaluru 560008
                        <br />
                        Karnataka, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold">Business Hours</h2>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}