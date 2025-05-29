import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Building2, Wallet, TrendingUp, MapPin, Mail, Phone, Send, Briefcase, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface InvestorProfile {
  id: string;
  full_name: string;
  contact_info: {
    email: string;
    phone: string;
    preferred_contact_method: 'email' | 'phone';
  };
  business_interests: {
    id: string;
    business_type: string;
    investment_amount: number;
    expected_roi: number;
    location_preference: string;
    experience: string;
  };
}

interface ProposalFormData {
  title: string;
  description: string;
  investment_required: number;
  expected_returns: number;
  timeline: string;
  type: 'business' | 'franchise' | 'partnership';
}

interface InvestorsSwiperProps {
  investors: InvestorProfile[];
  loading: boolean;
}

export function InvestorsSwiper({ investors, loading }: InvestorsSwiperProps) {
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [proposalForm, setProposalForm] = useState<ProposalFormData>({
    title: '',
    description: '',
    investment_required: 0,
    expected_returns: 0,
    timeline: '',
    type: 'business'
  });

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestor) return;

    try {
      setSubmitting(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Please sign in to send proposals');

      const { error } = await supabase
        .from('business_proposals')
        .insert({
          investor_id: selectedInvestor.id,
          user_id: user.id,
          title: proposalForm.title,
          description: proposalForm.description,
          investment_required: proposalForm.investment_required,
          expected_returns: proposalForm.expected_returns,
          timeline: proposalForm.timeline,
          type: proposalForm.type,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Proposal sent successfully!');
      setSelectedInvestor(null);
      setProposalForm({
        title: '',
        description: '',
        investment_required: 0,
        expected_returns: 0,
        timeline: '',
        type: 'business'
      });
    } catch (error: any) {
      console.error('Error sending proposal:', error);
      toast.error(error.message || 'Failed to send proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="investors-swiper-container">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="investors-swiper"
      >
        {investors.map((investor) => (
          <SwiperSlide key={investor.id}>
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">{investor.full_name}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Investment Amount</p>
                    <p className="font-semibold">₹{investor.business_interests.investment_amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Expected ROI</p>
                    <p className="font-semibold">{investor.business_interests.expected_roi}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location Preference</p>
                    <p className="font-semibold">{investor.business_interests.location_preference}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Business Type</p>
                    <p className="font-semibold">{investor.business_interests.business_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">{investor.business_interests.experience}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedInvestor(investor)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Proposal
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedInvestor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">
              Send Proposal to {selectedInvestor.full_name}
            </h3>
            
            <form onSubmit={handleSendProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proposal Title
                </label>
                <input
                  type="text"
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Investment Required (₹)
                </label>
                <input
                  type="number"
                  value={proposalForm.investment_required}
                  onChange={(e) => setProposalForm({ ...proposalForm, investment_required: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expected Returns (%)
                </label>
                <input
                  type="number"
                  value={proposalForm.expected_returns}
                  onChange={(e) => setProposalForm({ ...proposalForm, expected_returns: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timeline
                </label>
                <input
                  type="text"
                  value={proposalForm.timeline}
                  onChange={(e) => setProposalForm({ ...proposalForm, timeline: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., 6 months"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proposal Type
                </label>
                <select
                  value={proposalForm.type}
                  onChange={(e) => setProposalForm({ ...proposalForm, type: e.target.value as 'business' | 'franchise' | 'partnership' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="business">Business</option>
                  <option value="franchise">Franchise</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Proposal'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvestor(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}