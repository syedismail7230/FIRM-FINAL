import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
import type { BusinessRecommendation } from '../types';
import { BusinessCard } from './BusinessCard';
import { Lightbulb } from 'lucide-react';

interface BusinessRecommendationsSwiperProps {
  recommendations: BusinessRecommendation[];
}

export function BusinessRecommendationsSwiper({ recommendations }: BusinessRecommendationsSwiperProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Recommended Business Types</h2>
        </div>
        <div className="text-sm text-gray-600">
          Based on location analysis
        </div>
      </div>

      <div className="business-swiper-container max-w-4xl mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, EffectCards]}
          effect="cards"
          grabCursor={true}
          navigation
          pagination={{ clickable: true }}
          className="business-swiper py-8"
          centeredSlides={true}
        >
          {recommendations.map((recommendation, index) => (
            <SwiperSlide key={index} className="!w-full max-w-2xl">
              <BusinessCard recommendation={recommendation} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}