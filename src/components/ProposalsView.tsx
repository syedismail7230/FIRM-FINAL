import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Mail, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Phone } from 'lucide-react';
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
  user_id: string;
  user?: {
    full_name?: string;
    contact_info?: {
      email?: string;
      phone?: string;
    };
  };
}

interface ProposalsViewProps {
  user: User;
}

export function ProposalsView({ user }: ProposalsViewProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, [user.id]);

  async function loadProposals() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_proposals')
        .select(`
          *,
          user:profiles!business_proposals_user_id_fkey (
            full_name,
            contact_info
          )
        `)
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (proposalId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('business_proposals')
        .update({ status: newStatus })
        .eq('id', proposalId);

      if (error) throw error;

      toast.success(`Proposal ${newStatus} successfully`);
      loadProposals();
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal status');
    }
  };

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
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No proposals received</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't received any business proposals yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{proposal.title}</h3>
              <p className="text-sm text-gray-600">From: {proposal.user?.full_name || 'Unknown User'}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(proposal.status)}
              <span className="text-sm font-medium">{getStatusText(proposal.status)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Received on</p>
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

          {proposal.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus(proposal.id, 'accepted')}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Accept Proposal
              </button>
              <button
                onClick={() => handleUpdateStatus(proposal.id, 'rejected')}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject Proposal
              </button>
            </div>
          )}

          {proposal.status === 'accepted' && proposal.user?.contact_info && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposal.user.contact_info.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${proposal.user.contact_info.email}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                        {proposal.user.contact_info.email}
                      </a>
                    </div>
                  </div>
                )}
                {proposal.user.contact_info.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${proposal.user.contact_info.phone}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                        {proposal.user.contact_info.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}