import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Mail, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, User as UserIcon, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface Proposal {
  id: string;
  title: string;
  description: string;
  investment_required: number;
  expected_returns: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  investor: {
    id: string;
    full_name: string;
    contact_info: {
      email: string;
      phone: string;
    };
  };
}

interface SentProposalsViewProps {
  user: User;
}

export function SentProposalsView({ user }: SentProposalsViewProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, [user.id]);

  async function loadProposals() {
    try {
      setLoading(true);
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('business_proposals')
        .select(`
          *,
          investor:profiles!business_proposals_investor_id_fkey (
            id,
            full_name,
            contact_info
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (proposalsError) throw proposalsError;
      setProposals(proposalsData || []);
    } catch (error) {
      console.error('Error loading sent proposals:', error);
      toast.error('Failed to load sent proposals');
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No proposals sent</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't sent any business proposals yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{proposal.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(proposal.status)}`}>
              {getStatusText(proposal.status)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Sent to</p>
              <p className="font-medium">{proposal.investor?.full_name || 'Unknown Investor'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Sent on</p>
                <p className="font-medium">
                  {new Date(proposal.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Investment Required</p>
                <p className="font-medium">₹{proposal.investment_required.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Expected Returns</p>
                <p className="font-medium">{proposal.expected_returns}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="font-medium">{proposal.timeline}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{proposal.description}</p>
          </div>

          {proposal.investor?.contact_info && proposal.status === 'accepted' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${proposal.investor.contact_info.email}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                      {proposal.investor.contact_info.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${proposal.investor.contact_info.phone}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                      {proposal.investor.contact_info.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}