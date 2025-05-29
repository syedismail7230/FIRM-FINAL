import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminProposals() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_proposals')
        .select(`
          *,
          profiles!business_proposals_user_id_fkey (
            full_name,
            email
          ),
          investor:profiles!business_proposals_investor_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('business_proposals')
        .update({ status })
        .eq('id', proposalId);

      if (error) throw error;

      toast.success(`Proposal ${status} successfully`);
      loadProposals();
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Business Proposals</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Total: {proposals.length}
          </span>
          <span className="text-sm text-gray-600">
            Pending: {proposals.filter(p => p.status === 'pending').length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proposals.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {proposal.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {proposal.type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {proposal.profiles?.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {proposal.profiles?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {proposal.investor?.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {proposal.investor?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₹{proposal.investment_required.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {proposal.expected_returns}% ROI
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    proposal.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : proposal.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {proposal.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(proposal.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedProposal(proposal)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {proposal.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(proposal.id, 'accepted')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(proposal.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Proposal Details Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">Proposal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1">{selectedProposal.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1">{selectedProposal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">From</label>
                  <p className="mt-1">{selectedProposal.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">{selectedProposal.profiles?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <p className="mt-1">{selectedProposal.investor?.full_name}</p>
                  <p className="text-sm text-gray-500">{selectedProposal.investor?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Investment Required</label>
                  <p className="mt-1">₹{selectedProposal.investment_required.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Returns</label>
                  <p className="mt-1">{selectedProposal.expected_returns}%</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeline</label>
                <p className="mt-1">{selectedProposal.timeline}</p>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                {selectedProposal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedProposal.id, 'accepted');
                        setSelectedProposal(null);
                      }}
                      className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedProposal.id, 'rejected');
                        setSelectedProposal(null);
                      }}
                      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}