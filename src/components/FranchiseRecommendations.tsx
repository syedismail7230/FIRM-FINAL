import React from 'react';
import { Building2, TrendingUp, Users, Wallet, Phone, Mail, Globe, MapPin } from 'lucide-react';
import type { FranchiseRecommendation } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FranchiseRecommendationsProps {
  recommendations: FranchiseRecommendation[];
}

export function FranchiseRecommendations({ recommendations }: FranchiseRecommendationsProps) {
  return (
    <div className="franchise-swiper-container">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="franchise-swiper"
      >
        {recommendations.map((franchise, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">{franchise.name}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Investment Required</p>
                    <p className="font-semibold">₹{franchise.investment.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Expected ROI</p>
                    <p className="font-semibold">{franchise.roi}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Market Match</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${franchise.marketMatch}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Key Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {franchise.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold mb-3">Contact Information:</h4>
                <div className="space-y-2">
                  {franchise.contact && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${franchise.contact.phone}`} className="hover:text-indigo-600">
                          {franchise.contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${franchise.contact.email}`} className="hover:text-indigo-600">
                          {franchise.contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a href={franchise.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                          Visit Website
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {franchise.contact.address}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold mb-3">Key Advantages:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  {franchise.advantages?.map((advantage, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}