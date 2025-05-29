import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { ProfileForm } from '../components/ProfileForm';
import { BusinessInterestForm } from '../components/BusinessInterestForm';
import { ProposalsView } from '../components/ProposalsView';
import { SentProposalsView } from '../components/SentProposalsView';
import { ArrowLeft, UserCircle, Building2, Mail, Send } from 'lucide-react';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'interests' | 'proposals' | 'sent-proposals'>('profile');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <Link
              to="/"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>

          <div className="glass-card">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap gap-2 p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('interests')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'interests'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  Business Interest
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'proposals'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  Received Proposals
                </button>
                <button
                  onClick={() => setActiveTab('sent-proposals')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'sent-proposals'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Sent Proposals
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  <ProfileForm user={user} />
                </div>
              )}

              {activeTab === 'interests' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Business Interest</h2>
                  <BusinessInterestForm user={user} />
                </div>
              )}

              {activeTab === 'proposals' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Received Proposals</h2>
                  <ProposalsView user={user} />
                </div>
              )}

              {activeTab === 'sent-proposals' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Sent Proposals</h2>
                  <SentProposalsView user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}