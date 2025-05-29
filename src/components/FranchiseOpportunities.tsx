import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards, Autoplay } from 'swiper/modules';
import { Building2, Target, Shield, DollarSign, TrendingUp, MapPin, Mail, Phone, Globe, Star, Award, Clock, Users } from 'lucide-react';
import type { LocationData } from '../types';
import { fetchLocationAnalytics } from '../utils/locationAnalytics';
import toast from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

interface FranchiseOpportunitiesProps {
  location: LocationData;
}

// Comprehensive franchise data organized by categories
const FRANCHISE_DATA = {
  "Food & Beverage": [
    {
      name: "McDonald's",
      logo: "https://images.pexels.com/photos/2874780/pexels-photo-2874780.jpeg",
      category: "Food & Beverage",
      description: "Fast Food",
      investment: 4500000,
      roi: 70,
      marketMatch: 95,
      brandStrength: 95,
      requirements: [
        "3000+ sq ft space",
        "Prime location",
        "5+ years business experience",
        "Liquid capital of ₹2 Cr"
      ],
      contact: {
        phone: "+91-1800-456-7890",
        email: "franchise@mcdonalds.in",
        website: "https://www.mcdonalds.in/franchise",
        address: "McDonald's India, Mumbai"
      },
      advantages: [
        "Global brand presence",
        "Proven business model",
        "Extensive training",
        "Marketing support",
        "Supply chain excellence"
      ]
    },
    {
      name: "Subway",
      logo: "https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg",
      category: "Food & Beverage",
      description: "Sandwiches",
      investment: 2500000,
      roi: 75,
      marketMatch: 85,
      brandStrength: 85,
      requirements: [
        "500+ sq ft space",
        "Prime location",
        "2+ years business experience",
        "Liquid capital of ₹50 L"
      ],
      contact: {
        phone: "+91-1800-987-6543",
        email: "franchise@subway.in",
        website: "https://www.subway.co.in/franchise",
        address: "Subway India, Cyber City, Gurugram"
      },
      advantages: [
        "Low investment requirement",
        "Quick ROI",
        "Strong supply chain",
        "Technology support",
        "Brand recognition"
      ]
    },
    {
      name: "Starbucks",
      logo: "https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg",
      category: "Food & Beverage",
      description: "Coffeehouse",
      investment: 5000000,
      roi: 65,
      marketMatch: 82,
      brandStrength: 94,
      requirements: [
        "1800+ sq ft space",
        "Premium location",
        "5+ years business experience",
        "Liquid capital of ₹2.5 Cr"
      ],
      contact: {
        phone: "+91-1800-111-2222",
        email: "franchise@starbucks.in",
        website: "https://www.starbucks.in/franchise",
        address: "Starbucks India, Mumbai"
      },
      advantages: [
        "Premium global brand",
        "Loyal customer base",
        "Innovative product lineup",
        "Strong corporate values",
        "Community engagement"
      ]
    },
    {
      name: "Dunkin'",
      logo: "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg",
      category: "Food & Beverage",
      description: "Coffee & Donuts",
      investment: 3000000,
      roi: 68,
      marketMatch: 80,
      brandStrength: 88,
      requirements: [
        "1200+ sq ft space",
        "High traffic location",
        "3+ years business experience",
        "Liquid capital of ₹1 Cr"
      ],
      contact: {
        phone: "+91-1800-333-4444",
        email: "franchise@dunkin.in",
        website: "https://www.dunkin.in/franchise",
        address: "Dunkin' India, Mumbai"
      },
      advantages: [
        "Dual revenue streams",
        "Strong breakfast market",
        "Established brand",
        "Comprehensive training",
        "Marketing support"
      ]
    },
    {
      name: "KFC",
      logo: "https://images.pexels.com/photos/5920637/pexels-photo-5920637.jpeg",
      category: "Food & Beverage",
      description: "Fried Chicken",
      investment: 3800000,
      roi: 78,
      marketMatch: 88,
      brandStrength: 92,
      requirements: [
        "2500+ sq ft space",
        "High traffic location",
        "4+ years business experience",
        "Liquid capital of ₹1.5 Cr"
      ],
      contact: {
        phone: "+91-1800-222-3333",
        email: "franchise@kfc.in",
        website: "https://www.kfc.co.in/franchise",
        address: "KFC India, Gurugram"
      },
      advantages: [
        "Iconic global brand",
        "Proprietary recipes",
        "Strong marketing support",
        "Operational excellence",
        "Continuous innovation"
      ]
    },
    {
      name: "Pizza Hut",
      logo: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg",
      category: "Food & Beverage",
      description: "Pizza",
      investment: 3500000,
      roi: 72,
      marketMatch: 86,
      brandStrength: 90,
      requirements: [
        "2000+ sq ft space",
        "High visibility location",
        "3+ years business experience",
        "Liquid capital of ₹1.2 Cr"
      ],
      contact: {
        phone: "+91-1800-444-5555",
        email: "franchise@pizzahut.in",
        website: "https://www.pizzahut.co.in/franchise",
        address: "Pizza Hut India, Gurugram"
      },
      advantages: [
        "Global brand recognition",
        "Diverse menu options",
        "Strong delivery model",
        "Marketing support",
        "Operational training"
      ]
    },
    {
      name: "Taco Bell",
      logo: "https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg",
      category: "Food & Beverage",
      description: "Mexican-Inspired Fast Food",
      investment: 3200000,
      roi: 70,
      marketMatch: 78,
      brandStrength: 85,
      requirements: [
        "1800+ sq ft space",
        "High traffic location",
        "3+ years business experience",
        "Liquid capital of ₹1 Cr"
      ],
      contact: {
        phone: "+91-1800-555-6666",
        email: "franchise@tacobell.in",
        website: "https://www.tacobell.co.in/franchise",
        address: "Taco Bell India, Gurugram"
      },
      advantages: [
        "Unique cuisine category",
        "Strong youth appeal",
        "Innovative menu",
        "Global brand support",
        "Marketing assistance"
      ]
    },
    {
      name: "Burger King",
      logo: "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg",
      category: "Food & Beverage",
      description: "Fast Food",
      investment: 4000000,
      roi: 75,
      marketMatch: 88,
      brandStrength: 90,
      requirements: [
        "2500+ sq ft space",
        "High visibility location",
        "4+ years business experience",
        "Liquid capital of ₹1.5 Cr"
      ],
      contact: {
        phone: "+91-1800-666-7777",
        email: "franchise@burgerking.in",
        website: "https://www.burgerking.in/franchise",
        address: "Burger King India, Mumbai"
      },
      advantages: [
        "Global brand recognition",
        "Signature menu items",
        "Comprehensive training",
        "Marketing support",
        "Supply chain excellence"
      ]
    },
    {
      name: "Domino's Pizza",
      logo: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
      category: "Food & Beverage",
      description: "Pizza Delivery",
      investment: 3240000,
      roi: 84,
      marketMatch: 90,
      brandStrength: 90,
      requirements: [
        "2000+ sq ft space",
        "High street location",
        "3+ years business experience",
        "Liquid capital of ₹1 Cr"
      ],
      contact: {
        phone: "+91-1800-123-4567",
        email: "franchise@dominos.in",
        website: "https://www.dominos.co.in/franchise",
        address: "Domino's Pizza India, DLF Phase-3, Gurugram"
      },
      advantages: [
        "Global brand recognition",
        "Proven business model",
        "Comprehensive training program",
        "Supply chain support",
        "Marketing assistance"
      ]
    },
    {
      name: "Chick-fil-A",
      logo: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
      category: "Food & Beverage",
      description: "Chicken Sandwiches",
      investment: 3800000,
      roi: 80,
      marketMatch: 85,
      brandStrength: 88,
      requirements: [
        "2200+ sq ft space",
        "High traffic location",
        "4+ years business experience",
        "Liquid capital of ₹1.3 Cr"
      ],
      contact: {
        phone: "+91-1800-777-8888",
        email: "franchise@chickfila.in",
        website: "https://www.chickfila.in/franchise",
        address: "Chick-fil-A India, Bangalore"
      },
      advantages: [
        "Quality-focused brand",
        "Strong customer loyalty",
        "Closed on Sundays policy",
        "Comprehensive training",
        "Marketing support"
      ]
    }
  ],
  "Retail": [
    {
      name: "7-Eleven",
      logo: "https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg",
      category: "Retail",
      description: "Convenience Stores",
      investment: 2800000,
      roi: 72,
      marketMatch: 80,
      brandStrength: 88,
      requirements: [
        "1200+ sq ft space",
        "Corner location preferred",
        "2+ years retail experience",
        "Liquid capital of ₹80 L"
      ],
      contact: {
        phone: "+91-1800-777-1111",
        email: "franchise@7eleven.in",
        website: "https://www.7eleven.in/franchise",
        address: "7-Eleven India, Delhi"
      },
      advantages: [
        "24/7 operation model",
        "Proven convenience store concept",
        "Proprietary inventory system",
        "Recognized global brand",
        "Multiple revenue streams"
      ]
    },
    {
      name: "Ace Hardware",
      logo: "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg",
      category: "Retail",
      description: "Hardware Retail",
      investment: 3500000,
      roi: 65,
      marketMatch: 75,
      brandStrength: 80,
      requirements: [
        "5000+ sq ft space",
        "Accessible location",
        "Retail experience preferred",
        "Liquid capital of ₹1.2 Cr"
      ],
      contact: {
        phone: "+91-1800-222-3333",
        email: "franchise@acehardware.in",
        website: "https://www.acehardware.in/franchise",
        address: "Ace Hardware India, Mumbai"
      },
      advantages: [
        "Established brand name",
        "Comprehensive inventory",
        "Training and support",
        "Marketing assistance",
        "Cooperative business model"
      ]
    },
    {
      name: "The UPS Store",
      logo: "https://images.pexels.com/photos/6169/woman-hand-smartphone-desk.jpg",
      category: "Retail",
      description: "Shipping & Printing Services",
      investment: 2500000,
      roi: 68,
      marketMatch: 78,
      brandStrength: 85,
      requirements: [
        "1000+ sq ft space",
        "Commercial location",
        "Business experience preferred",
        "Liquid capital of ₹70 L"
      ],
      contact: {
        phone: "+91-1800-333-4444",
        email: "franchise@upsstore.in",
        website: "https://www.upsstore.in/franchise",
        address: "The UPS Store India, Delhi"
      },
      advantages: [
        "Recognized global brand",
        "Multiple revenue streams",
        "Comprehensive training",
        "Marketing support",
        "Established business model"
      ]
    },
    {
      name: "GNC",
      logo: "https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg",
      category: "Retail",
      description: "Health & Nutrition Products",
      investment: 2200000,
      roi: 70,
      marketMatch: 75,
      brandStrength: 82,
      requirements: [
        "800+ sq ft space",
        "Mall or high street location",
        "Retail experience preferred",
        "Liquid capital of ₹60 L"
      ],
      contact: {
        phone: "+91-1800-444-5555",
        email: "franchise@gnc.in",
        website: "https://www.gnc.in/franchise",
        address: "GNC India, Mumbai"
      },
      advantages: [
        "Established brand in health sector",
        "Proprietary product lines",
        "Training and education",
        "Marketing support",
        "Growing market segment"
      ]
    },
    {
      name: "Pet Supplies Plus",
      logo: "https://images.pexels.com/photos/1350591/pexels-photo-1350591.jpeg",
      category: "Retail",
      description: "Pet Retail",
      investment: 2800000,
      roi: 68,
      marketMatch: 72,
      brandStrength: 78,
      requirements: [
        "3000+ sq ft space",
        "Accessible location",
        "Retail experience preferred",
        "Liquid capital of ₹80 L"
      ],
      contact: {
        phone: "+91-1800-555-6666",
        email: "franchise@petsuppliesplus.in",
        website: "https://www.petsuppliesplus.in/franchise",
        address: "Pet Supplies Plus India, Bangalore"
      },
      advantages: [
        "Growing pet care market",
        "Multiple revenue streams",
        "Training and support",
        "Marketing assistance",
        "Community engagement opportunities"
      ]
    }
  ],
  "Health & Fitness": [
    {
      name: "Anytime Fitness",
      logo: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
      category: "Health & Fitness",
      description: "24-Hour Fitness Centers",
      investment: 3500000,
      roi: 68,
      marketMatch: 75,
      brandStrength: 82,
      requirements: [
        "3500+ sq ft space",
        "Accessible location",
        "Fitness industry experience preferred",
        "Liquid capital of ₹1 Cr"
      ],
      contact: {
        phone: "+91-1800-444-5555",
        email: "franchise@anytimefitness.in",
        website: "https://www.anytimefitness.in/franchise",
        address: "Anytime Fitness India, Bangalore"
      },
      advantages: [
        "24/7 access model",
        "Low staffing requirements",
        "Global support network",
        "Proprietary training systems",
        "Multiple revenue streams"
      ]
    },
    {
      name: "Planet Fitness",
      logo: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
      category: "Health & Fitness",
      description: "Fitness Centers",
      investment: 4000000,
      roi: 65,
      marketMatch: 72,
      brandStrength: 85,
      requirements: [
        "10000+ sq ft space",
        "Accessible location",
        "Business experience required",
        "Liquid capital of ₹1.5 Cr"
      ],
      contact: {
        phone: "+91-1800-666-7777",
        email: "franchise@planetfitness.in",
        website: "https://www.planetfitness.in/franchise",
        address: "Planet Fitness India, Delhi"
      },
      advantages: [
        "High-volume, low-price model",
        "Strong brand recognition",
        "Comprehensive training",
        "Marketing support",
        "Proven business model"
      ]
    },
    {
      name: "Snap Fitness",
      logo: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
      category: "Health & Fitness",
      description: "Fitness Centers",
      investment: 3000000,
      roi: 70,
      marketMatch: 78,
      brandStrength: 80,
      requirements: [
        "3000+ sq ft space",
        "Accessible location",
        "Business experience preferred",
        "Liquid capital of ₹90 L"
      ],
      contact: {
        phone: "+91-1800-777-8888",
        email: "franchise@snapfitness.in",
        website: "https://www.snapfitness.in/franchise",
        address: "Snap Fitness India, Mumbai"
      },
      advantages: [
        "24/7 access model",
        "Compact, efficient spaces",
        "Comprehensive training",
        "Marketing support",
        "Technology-driven operations"
      ]
    },
    {
      name: "Orangetheory Fitness",
      logo: "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg",
      category: "Health & Fitness",
      description: "Group Fitness Training",
      investment: 3800000,
      roi: 72,
      marketMatch: 76,
      brandStrength: 83,
      requirements: [
        "3000+ sq ft space",
        "Accessible location",
        "Business experience required",
        "Liquid capital of ₹1.2 Cr"
      ],
      contact: {
        phone: "+91-1800-888-9999",
        email: "franchise@orangetheory.in",
        website: "https://www.orangetheory.in/franchise",
        address: "Orangetheory Fitness India, Bangalore"
      },
      advantages: [
        "Unique workout methodology",
        "Technology-driven experience",
        "Strong brand recognition",
        "Comprehensive training",
        "Marketing support"
      ]
    },
    {
      name: "Jazzercise",
      logo: "https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg",
      category: "Health & Fitness",
      description: "Dance Fitness Programs",
      investment: 1500000,
      roi: 75,
      marketMatch: 70,
      brandStrength: 75,
      requirements: [
        "1500+ sq ft space",
        "Accessible location",
        "Fitness experience preferred",
        "Liquid capital of ₹40 L"
      ],
      contact: {
        phone: "+91-1800-999-0000",
        email: "franchise@jazzercise.in",
        website: "https://www.jazzercise.in/franchise",
        address: "Jazzercise India, Delhi"
      },
      advantages: [
        "Low investment requirement",
        "Established fitness brand",
        "Comprehensive training",
        "Marketing support",
        "Flexible location options"
      ]
    }
  ],
  "Education & Child Services": [
    {
      name: "Kumon",
      logo: "https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg",
      category: "Education & Child Services",
      description: "Math & Reading Tutoring",
      investment: 1500000,
      roi: 65,
      marketMatch: 72,
      brandStrength: 80,
      requirements: [
        "800+ sq ft space",
        "Residential area preferred",
        "Education background preferred",
        "Liquid capital of ₹30 L"
      ],
      contact: {
        phone: "+91-1800-102-3030",
        email: "franchise@kumon.in",
        website: "https://www.kumon.in/franchise",
        address: "Kumon India, Delhi"
      },
      advantages: [
        "Proven educational method",
        "Global curriculum support",
        "Low overhead costs",
        "Recurring revenue model",
        "Meaningful community impact"
      ]
    },
    {
      name: "Sylvan Learning",
      logo: "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg",
      category: "Education & Child Services",
      description: "Supplemental Education",
      investment: 2000000,
      roi: 62,
      marketMatch: 70,
      brandStrength: 78,
      requirements: [
        "1200+ sq ft space",
        "Accessible location",
        "Education background preferred",
        "Liquid capital of ₹50 L"
      ],
      contact: {
        phone: "+91-1800-111-2222",
        email: "franchise@sylvanlearning.in",
        website: "https://www.sylvanlearning.in/franchise",
        address: "Sylvan Learning India, Mumbai"
      },
      advantages: [
        "Established educational brand",
        "Proprietary curriculum",
        "Comprehensive training",
        "Marketing support",
        "Multiple revenue streams"
      ]
    },
    {
      name: "The Goddard School",
      logo: "https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg",
      category: "Education & Child Services",
      description: "Early Childhood Education",
      investment: 3500000,
      roi: 60,
      marketMatch: 68,
      brandStrength: 82,
      requirements: [
        "5000+ sq ft space",
        "Residential area preferred",
        "Education background required",
        "Liquid capital of ₹1 Cr"
      ],
      contact: {
        phone: "+91-1800-222-3333",
        email: "franchise@goddardschool.in",
        website: "https://www.goddardschool.in/franchise",
        address: "The Goddard School India, Bangalore"
      },
      advantages: [
        "Established educational brand",
        "Proprietary curriculum",
        "Comprehensive training",
        "Marketing support",
        "Real estate assistance"
      ]
    },
    {
      name: "Huntington Learning Center",
      logo: "https://images.pexels.com/photos/3769981/pexels-photo-3769981.jpeg",
      category: "Education & Child Services",
      description: "Academic Tutoring",
      investment: 2200000,
      roi: 64,
      marketMatch: 72,
      brandStrength: 76,
      requirements: [
        "1500+ sq ft space",
        "Accessible location",
        "Education background preferred",
        "Liquid capital of ₹60 L"
      ],
      contact: {
        phone: "+91-1800-333-4444",
        email: "franchise@huntingtonlearning.in",
        website: "https://www.huntingtonlearning.in/franchise",
        address: "Huntington Learning Center India, Delhi"
      },
      advantages: [
        "Established educational brand",
        "Comprehensive training",
        "Marketing support",
        "Multiple revenue streams",
        "Proprietary curriculum"
      ]
    },
    {
      name: "Mathnasium",
      logo: "https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg",
      category: "Education & Child Services",
      description: "Math Tutoring",
      investment: 1800000,
      roi: 68,
      marketMatch: 75,
      brandStrength: 78,
      requirements: [
        "1000+ sq ft space",
        "Accessible location",
        "Education background preferred",
        "Liquid capital of ₹45 L"
      ],
      contact: {
        phone: "+91-1800-444-5555",
        email: "franchise@mathnasium.in",
        website: "https://www.mathnasium.in/franchise",
        address: "Mathnasium India, Mumbai"
      },
      advantages: [
        "Specialized math curriculum",
        "Comprehensive training",
        "Marketing support",
        "Low overhead costs",
        "Recurring revenue model"
      ]
    }
  ],
  "Automotive": [
    {
      name: "Midas",
      logo: "https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg",
      category: "Automotive",
      description: "Auto Repair & Maintenance",
      investment: 3000000,
      roi: 72,
      marketMatch: 78,
      brandStrength: 80,
      requirements: [
        "3000+ sq ft space",
        "Accessible location",
        "Automotive experience preferred",
        "Liquid capital of ₹80 L"
      ],
      contact: {
        phone: "+91-1800-555-6666",
        email: "franchise@midas.in",
        website: "https://www.midas.in/franchise",
        address: "Midas India, Delhi"
      },
      advantages: [
        "Established automotive brand",
        "Comprehensive training",
        "Marketing support",
        "Multiple revenue streams",
        "National vendor relationships"
      ]
    },
    {
      name: "Jiffy Lube",
      logo: "https://images.pexels.com/photos/3807349/pexels-photo-3807349.jpeg",
      category: "Automotive",
      description: "Oil Change Services",
      investment: 2500000,
      roi: 75,
      marketMatch: 80,
      brandStrength: 82,
      requirements: [
        "2000+ sq ft space",
        "Accessible location",
        "Automotive experience preferred",
        "Liquid capital of ₹70 L"
      ],
      contact: {
        phone: "+91-1800-666-7777",
        email: "franchise@jiffylube.in",
        website: "https://www.jiffylube.in/franchise",
        address: "Jiffy Lube India, Mumbai"
      },
      advantages: [
        "Focused service model",
        "Quick customer turnover",
        "Comprehensive training",
        "Marketing support",
        "Established brand name"
      ]
    },
    {
      name: "AAMCO Transmissions",
      logo: "https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg",
      category: "Automotive",
      description: "Transmission Repair",
      investment: 3500000,
      roi: 70,
      marketMatch: 75,
      brandStrength: 78,
      requirements: [
        "3500+ sq ft space",
        "Accessible location",
        "Automotive experience required",
        "Liquid capital of ₹1 Cr"
      ],
      contact: {
        phone: "+91-1800-777-8888",
        email: "franchise@aamco.in",
        website: "https://www.aamco.in/franchise",
        address: "AAMCO India, Delhi"
      },
      advantages: [
        "Specialized service offering",
        "Comprehensive training",
        "Marketing support",
        "Technical assistance",
        "Established brand name"
      ]
    },
    {
      name: "Meineke Car Care Centers",
      logo: "https://images.pexels.com/photos/3807349/pexels-photo-3807349.jpeg",
      category: "Automotive",
      description: "Auto Repair Services",
      investment: 3200000,
      roi: 72,
      marketMatch: 78,
      brandStrength: 80,
      requirements: [
        "3000+ sq ft space",
        "Accessible location",
        "Automotive experience preferred",
        "Liquid capital of ₹90 L"
      ],
      contact: {
        phone: "+91-1800-888-9999",
        email: "franchise@meineke.in",
        website: "https://www.meineke.in/franchise",
        address: "Meineke India, Mumbai"
      },
      advantages: [
        "Comprehensive service offering",
        "Training and support",
        "Marketing assistance",
        "Multiple revenue streams",
        "Established brand name"
      ]
    },
    {
      name: "Ziebart",
      logo: "https://images.pexels.com/photos/3807349/pexels-photo-3807349.jpeg",
      category: "Automotive",
      description: "Automotive Appearance & Protection Services",
      investment: 2800000,
      roi: 74,
      marketMatch: 76,
      brandStrength: 75,
      requirements: [
        "2500+ sq ft space",
        "Accessible location",
        "Automotive experience preferred",
        "Liquid capital of ₹75 L"
      ],
      contact: {
        phone: "+91-1800-999-0000",
        email: "franchise@ziebart.in",
        website: "https://www.ziebart.in/franchise",
        address: "Ziebart India, Delhi"
      },
      advantages: [
        "Specialized service offering",
        "Comprehensive training",
        "Marketing support",
        "Multiple revenue streams",
        "Proprietary products"
      ]
    }
  ],
  "Home Services": [
    {
      name: "Servpro",
      logo: "https://images.pexels.com/photos/3807349/pexels-photo-3807349.jpeg",
      category: "Home Services",
      description: "Fire & Water Cleanup and Restoration",
      investment: 2800000,
      roi: 75,
      marketMatch: 78,
      brandStrength: 82,
      requirements: [
        "2000+ sq ft space",
        "Accessible location",
        "Business experience required",
        "Liquid capital of ₹80 L"
      ],
      contact: {
        phone: "+91-1800-111-2222",
        email: "franchise@servpro.in",
        website: "https://www.servpro.in/franchise",
        address: "Servpro India, Mumbai"
      },
      advantages: [
        "Specialized service offering",
        "Comprehensive training",
        "Marketing support",
        "Emergency service model",
        "Corporate account access"
      ]
    },
    {
      name: "Merry Maids",
      logo: "https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg",
      category: "Home Services",
      description: "Residential Cleaning Services",
      investment: 1500000,
      roi: 78,
      marketMatch: 82,
      brandStrength: 78,
      requirements: [
        "500+ sq ft office space",
        "Accessible location",
        "Business experience preferred",
        "Liquid capital of ₹40 L"
      ],
      contact: {
        phone: "+91-1800-222-3333",
        email: "franchise@merrymaids.in",
        website: "https://www.merrymaids.in/franchise",
        address: "Merry Maids India, Delhi"
      },
      advantages: [
        "Low overhead costs",
        "Recurring revenue model",
        "Comprehensive training",
        "Marketing support",
        "Established brand name"
      ]
    },
    {
      name: "Mr. Handyman",
      logo: "https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg",
      category: "Home Services",
      description: "Home Repair Services",
      investment: 2000000,
      roi: 75,
      marketMatch: 80,
      brandStrength: 80,
      requirements: [
        "500+ sq ft office space",
        "Accessible location",
        "Business experience required",
        "Liquid capital of ₹50 L"
      ],
      contact: {
        phone: "+91-1800-333-4444",
        email: "franchise@mrhandyman.in",
        website: "https://www.mrhandyman.in/franchise",
        address: "Mr. Handyman India, Mumbai"
      },
      advantages: [
        "Multiple service offerings",
        "Comprehensive training",
        "Marketing support",
        "Recurring revenue potential",
        "Established brand name"
      ]
    },
    {
      name: "The Maids",
      logo: "https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg",
      category: "Home Services",
      description: "Residential Cleaning Services",
      investment: 1600000,
      roi: 76,
      marketMatch: 80,
      brandStrength: 76,
      requirements: [
        "500+ sq ft office space",
        "Accessible location",
        "Business experience preferred",
        "Liquid capital of ₹45 L"
      ],
      contact: {
        phone: "+91-1800-444-5555",
        email: "franchise@themaids.in",
        website: "https://www.themaids.in/franchise",
        address: "The Maids India, Delhi"
      },
      advantages: [
        "Team cleaning approach",
        "Comprehensive training",
        "Marketing support",
        "Recurring revenue model",
        "Established brand name"
      ]
    },
    {
      name: "Molly Maid",
      logo: "https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg",
      category: "Home Services",
      description: "Home Cleaning Services",
      investment: 1400000,
      roi: 78,
      marketMatch: 82,
      brandStrength: 75,
      requirements: [
        "500+ sq ft office space",
        "Accessible location",
        "Business experience preferred",
        "Liquid capital of ₹35 L"
      ],
      contact: {
        phone: "+91-1800-555-6666",
        email: "franchise@mollymaid.in",
        website: "https://www.mollymaid.in/franchise",
        address: "Molly Maid India, Mumbai"
      },
      advantages: [
        "Low overhead costs",
        "Recurring revenue model",
        "Comprehensive training",
        "Marketing support",
        "Established brand name"
      ]
    }
  ],
  "Business Services": [
    {
      name: "Jan-Pro",
      logo: "https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg",
      category: "Business Services",
      description: "Commercial Cleaning Services",
      investment: 2000000,
      roi: 78,
      marketMatch: 82,
      brandStrength: 78,
      requirements: [
        "500+ sq ft office space",
        "Accessible location",
        "Business experience preferred",
        "Liquid capital of ₹50 L"
      ],
      contact: {
        phone: "+91-1800-666-7777",
        email: "franchise@janpro.in",
        website: "https://www.janpro.in/franchise",
        address: "Jan-Pro India, Delhi"
      },
      advantages: [
        "Recurring revenue model",
        "Comprehensive training",
        "Marketing support",
        "Multiple client types",
        "Established brand name"
      ]
    },
    {
      name: "FastSigns",
      logo: "https://images.pexels.com/photos/1051747/pexels-photo-1051747.jpeg",
      category: "Business Services",
      description: "Sign and Graphics Solutions",
      investment: 2500000,
      roi: 72,
      marketMatch: 76,
      brandStrength: 80,
      requirements: [
        "1500+ sq ft space",
        "Accessible location",
        "Business experience required",
        "Liquid capital of ₹70 L"
      ],
      contact: {
        phone: "+91-1800-777-8888",
        email: "franchise@fastsigns.in",
        website: "https://www.fastsigns.in/franchise",
        address: "FastSigns India, Mumbai"
      },
      advantages: [
        "B2B service model",
        "Comprehensive training",
        "Marketing support",
        "Multiple revenue streams",
        "Established brand name"
      ]
    },
    {
      name: "Minuteman Press",
      logo: "https://images.pexels.com/photos/1051747/pexels-photo-1051747.jpeg",
      category: "Business Services",
      description: "Printing & Marketing Services",
      investment: 2200000,
      roi: 74,
      marketMatch: 78,
      brandStrength: 82,
      requirements: [
        "1200+ sq ft space",
        "Accessible location",
        "Business experience preferred",
        "Liquid capital of ₹60 L"
      ],
      contact: {
        phone: "+91-1800-888-9999",
        email: "franchise@minutemanpress.in",
        website: "https://www.minutemanpress.in/franchise",
        address: "Minuteman Press India, Delhi"
      },
      advantages: [
        "B2B service model",
        "Comprehensive training",
        "Marketing support",
        "Multiple revenue streams",
        "Established brand name"
      ]
    },
    {
      name: "PostNet",
      logo: "https://images.pexels.com/photos/1051747/pexels-photo-1051747.jpeg",
      category: "Business Services",
      description: "Printing & Shipping Services",
      investment: 2000000,
      roi: 75,
      marketMatch: 80,
      brandStrength: 78,
      requirements: [
        "1000+ sq ft space",
        "Accessible location",
        "Business experience preferred",
        "Liquid capital of ₹55 L"
      ],
      contact: {
        phone: "+91-1800-999-0000",
        email: "franchise@postnet.in",
        website: "https://www.postnet.in/franchise",
        address: "PostNet India, Mumbai"
      },
      advantages: [
        "Multiple service offerings",
        "Comprehensive training",
        "Marketing support",
        "B2B and B2C revenue streams",
        "Established brand name"
      ]
    },
    {
      name: "AlphaGraphics",
      logo: "https://images.pexels.com/photos/1051747/pexels-photo-1051747.jpeg",
      category: "Business Services",
      description: "Print and Marketing Solutions",
      investment: 2300000,
      roi: 72,
      marketMatch: 76,
      brandStrength: 80,
      requirements: [
        "1200+ sq ft space",
        "Accessible location",
        "Business experience required",
        "Liquid capital of ₹65 L"
      ],
      contact: {
        phone: "+91-1800-111-2222",
        email: "franchise@alphagraphics.in",
        website: "https://www.alphagraphics.in/franchise",
        address: "AlphaGraphics India, Delhi"
      },
      advantages: [
        "B2B service model",
        "Comprehensive training",
        "Marketing support",
        "Multiple revenue streams",
        "Established brand name"
      ]
    }
  ],
  "Hospitality": [
    {
      name: "Marriott International",
      logo: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      category: "Hospitality",
      description: "Hotel & Lodging",
      investment: 50000000,
      roi: 55,
      marketMatch: 70,
      brandStrength: 95,
      requirements: [
        "50000+ sq ft space",
        "Prime location",
        "Hospitality experience required",
        "Liquid capital of ₹10 Cr"
      ],
      contact: {
        phone: "+91-1800-222-3333",
        email: "franchise@marriott.in",
        website: "https://www.marriott.in/franchise",
        address: "Marriott International India, Mumbai"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive support system",
        "Reservation system access",
        "Marketing support",
        "Multiple brand options"
      ]
    },
    {
      name: "Hilton Hotels & Resorts",
      logo: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      category: "Hospitality",
      description: "Hotel & Lodging",
      investment: 45000000,
      roi: 58,
      marketMatch: 72,
      brandStrength: 92,
      requirements: [
        "45000+ sq ft space",
        "Prime location",
        "Hospitality experience required",
        "Liquid capital of ₹8 Cr"
      ],
      contact: {
        phone: "+91-1800-333-4444",
        email: "franchise@hilton.in",
        website: "https://www.hilton.in/franchise",
        address: "Hilton Hotels India, Delhi"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive support system",
        "Reservation system access",
        "Marketing support",
        "Multiple brand options"
      ]
    },
    {
      name: "Holiday Inn",
      logo: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      category: "Hospitality",
      description: "Hotel & Lodging",
      investment: 35000000,
      roi: 60,
      marketMatch: 75,
      brandStrength: 88,
      requirements: [
        "35000+ sq ft space",
        "Accessible location",
        "Hospitality experience required",
        "Liquid capital of ₹6 Cr"
      ],
      contact: {
        phone: "+91-1800-444-5555",
        email: "franchise@holidayinn.in",
        website: "https://www.holidayinn.in/franchise",
        address: "Holiday Inn India, Mumbai"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive support system",
        "Reservation system access",
        "Marketing support",
        "Multiple brand options"
      ]
    },
    {
      name: "Best Western",
      logo: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      category: "Hospitality",
      description: "Hotel & Lodging",
      investment: 30000000,
      roi: 62,
      marketMatch: 78,
      brandStrength: 85,
      requirements: [
        "30000+ sq ft space",
        "Accessible location",
        "Hospitality experience required",
        "Liquid capital of ₹5 Cr"
      ],
      contact: {
        phone: "+91-1800-555-6666",
        email: "franchise@bestwestern.in",
        website: "https://www.bestwestern.in/franchise",
        address: "Best Western India, Delhi"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive support system",
        "Reservation system access",
        "Marketing support",
        "Multiple brand options"
      ]
    },
    {
      name: "Comfort Inn",
      logo: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      category: "Hospitality",
      description: "Hotel & Lodging",
      investment: 25000000,
      roi: 65,
      marketMatch: 80,
      brandStrength: 82,
      requirements: [
        "25000+ sq ft space",
        "Accessible location",
        "Hospitality experience required",
        "Liquid capital of ₹4 Cr"
      ],
      contact: {
        phone: "+91-1800-666-7777",
        email: "franchise@comfortinn.in",
        website: "https://www.comfortinn.in/franchise",
        address: "Comfort Inn India, Mumbai"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive support system",
        "Reservation system access",
        "Marketing support",
        "Multiple brand options"
      ]
    }
  ],
  "Real Estate": [
    {
      name: "RE/MAX",
      logo: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg",
      category: "Real Estate",
      description: "Real Estate Brokerage",
      investment: 2500000,
      roi: 70,
      marketMatch: 78,
      brandStrength: 88,
      requirements: [
        "1000+ sq ft office space",
        "Accessible location",
        "Real estate experience required",
        "Liquid capital of ₹70 L"
      ],
      contact: {
        phone: "+91-1800-777-8888",
        email: "franchise@remax.in",
        website: "https://www.remax.in/franchise",
        address: "RE/MAX India, Delhi"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Agent recruitment assistance"
      ]
    },
    {
      name: "Keller Williams Realty",
      logo: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg",
      category: "Real Estate",
      description: "Real Estate Brokerage",
      investment: 2800000,
      roi: 68,
      marketMatch: 76,
      brandStrength: 85,
      requirements: [
        "1200+ sq ft office space",
        "Accessible location",
        "Real estate experience required",
        "Liquid capital of ₹80 L"
      ],
      contact: {
        phone: "+91-1800-888-9999",
        email: "franchise@kellerwilliams.in",
        website: "https://www.kellerwilliams.in/franchise",
        address: "Keller Williams Realty India, Mumbai"
      },
      advantages: [
        "Profit sharing model",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Agent recruitment assistance"
      ]
    },
    {
      name: "Century 21",
      logo: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg",
      category: "Real Estate",
      description: "Real Estate Brokerage",
      investment: 2600000,
      roi: 72,
      marketMatch: 80,
      brandStrength: 86,
      requirements: [
        "1000+ sq ft office space",
        "Accessible location",
        "Real estate experience required",
        "Liquid capital of ₹75 L"
      ],
      contact: {
        phone: "+91-1800-999-0000",
        email: "franchise@century21.in",
        website: "https://www.century21.in/franchise",
        address: "Century 21 India, Delhi"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Agent recruitment assistance"
      ]
    },
    {
      name: "Coldwell Banker",
      logo: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg",
      category: "Real Estate",
      description: "Real Estate Brokerage",
      investment: 2700000,
      roi: 70,
      marketMatch: 78,
      brandStrength: 84,
      requirements: [
        "1100+ sq ft office space",
        "Accessible location",
        "Real estate experience required",
        "Liquid capital of ₹75 L"
      ],
      contact: {
        phone: "+91-1800-111-2222",
        email: "franchise@coldwellbanker.in",
        website: "https://www.coldwellbanker.in/franchise",
        address: "Coldwell Banker India, Mumbai"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Agent recruitment assistance"
      ]
    },
    {
      name: "ERA Real Estate",
      logo: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg",
      category: "Real Estate",
      description: "Real Estate Brokerage",
      investment: 2400000,
      roi: 72,
      marketMatch: 78,
      brandStrength: 82,
      requirements: [
        "1000+ sq ft office space",
        "Accessible location",
        "Real estate experience required",
        "Liquid capital of ₹65 L"
      ],
      contact: {
        phone: "+91-1800-222-3333",
        email: "franchise@era.in",
        website: "https://www.era.in/franchise",
        address: "ERA Real Estate India, Delhi"
      },
      advantages: [
        "Global brand recognition",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Agent recruitment assistance"
      ]
    }
  ],
  "Financial Services": [
    {
      name: "H&R Block",
      logo: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
      category: "Financial Services",
      description: "Tax Preparation Services",
      investment: 1800000,
      roi: 75,
      marketMatch: 82,
      brandStrength: 85,
      requirements: [
        "800+ sq ft office space",
        "Accessible location",
        "Financial background preferred",
        "Liquid capital of ₹50 L"
      ],
      contact: {
        phone: "+91-1800-333-4444",
        email: "franchise@hrblock.in",
        website: "https://www.hrblock.in/franchise",
        address: "H&R Block India, Mumbai"
      },
      advantages: [
        "Seasonal business model",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Established brand name"
      ]
    },
    {
      name: "Jackson Hewitt Tax Service",
      logo: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
      category: "Financial Services",
      description: "Tax Preparation Services",
      investment: 1600000,
      roi: 78,
      marketMatch: 80,
      brandStrength: 82,
      requirements: [
        "700+ sq ft office space",
        "Accessible location",
        "Financial background preferred",
        "Liquid capital of ₹45 L"
      ],
      contact: {
        phone: "+91-1800-444-5555",
        email: "franchise@jacksonhewitt.in",
        website: "https://www.jacksonhewitt.in/franchise",
        address: "Jackson Hewitt Tax Service India, Delhi"
      },
      advantages: [
        "Seasonal business model",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Established brand name"
      ]
    },
    {
      name: "Liberty Tax Service",
      logo: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
      category: "Financial Services",
      description: "Tax Preparation Services",
      investment: 1500000,
      roi: 80,
      marketMatch: 82,
      brandStrength: 80,
      requirements: [
        "600+ sq ft office space",
        "Accessible location",
        "Financial background preferred",
        "Liquid capital of ₹40 L"
      ],
      contact: {
        phone: "+91-1800-555-6666",
        email: "franchise@libertytax.in",
        website: "https://www.libertytax.in/franchise",
        address: "Liberty Tax Service India, Mumbai"
      },
      advantages: [
        "Seasonal business model",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Established brand name"
      ]
    },
    {
      name: "Edward Jones",
      logo: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
      category: "Financial Services",
      description: "Financial Advisory Services",
      investment: 2500000,
      roi: 68,
      marketMatch: 75,
      brandStrength: 85,
      requirements: [
        "800+ sq ft office space",
        "Accessible location",
        "Financial background required",
        "Liquid capital of ₹70 L"
      ],
      contact: {
        phone: "+91-1800-666-7777",
        email: "franchise@edwardjones.in",
        website: "https://www.edwardjones.in/franchise",
        address: "Edward Jones India, Delhi"
      },
      advantages: [
        "Established financial brand",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Ongoing support system"
      ]
    },
    {
      name: "Primerica",
      logo: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
      category: "Financial Services",
      description: "Financial Services & Insurance",
      investment: 2000000,
      roi: 72,
      marketMatch: 78,
      brandStrength: 82,
      requirements: [
        "700+ sq ft office space",
        "Accessible location",
        "Financial background required",
        "Liquid capital of ₹55 L"
      ],
      contact: {
        phone: "+91-1800-777-8888",
        email: "franchise@primerica.in",
        website: "https://www.primerica.in/franchise",
        address: "Primerica India, Mumbai"
      },
      advantages: [
        "Multiple revenue streams",
        "Comprehensive training",
        "Marketing support",
        "Technology platform",
        "Established brand name"
      ]
    }
  ]
};

// Flatten all franchises into a single array
const ALL_FRANCHISES = Object.values(FRANCHISE_DATA).flat();

export function FranchiseOpportunities({ location }: FranchiseOpportunitiesProps) {
  const [franchises, setFranchises] = useState(ALL_FRANCHISES);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadFranchises();
  }, [location]);

  const loadFranchises = async () => {
    try {
      setLoading(true);
      const analytics = await fetchLocationAnalytics(location.lat, location.lng, location.radius || 1);
      
      // Adjust market match based on location analytics
      const adjustedFranchises = ALL_FRANCHISES.map(franchise => {
        const locationFactor = (location.avgIncome / 50000) * (location.population / 100000);
        const adjustedMarketMatch = Math.min(100, franchise.marketMatch * (0.8 + locationFactor * 0.4));
        const adjustedRoi = Math.min(100, franchise.roi * (0.9 + locationFactor * 0.2));

        return {
          ...franchise,
          marketMatch: Math.round(adjustedMarketMatch),
          roi: Math.round(adjustedRoi)
        };
      });

      setFranchises(adjustedFranchises.sort((a, b) => b.marketMatch - a.marketMatch));
    } catch (error) {
      console.error('Error loading franchises:', error);
      toast.error('Failed to load franchise opportunities');
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    return Object.keys(FRANCHISE_DATA);
  };

  const filteredFranchises = selectedCategory 
    ? franchises.filter(f => f.category === selectedCategory)
    : franchises;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Franchise Opportunities</h2>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCategory === null 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {getCategories().map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, EffectCards, Autoplay]}
        effect="cards"
        grabCursor={true}
        navigation
        pagination={{ clickable: true }}
        className="franchise-swiper py-8"
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
      >
        {filteredFranchises.map((franchise, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${franchise.logo})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white">{franchise.name}</h3>
                    <div className="mt-2 flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(franchise.brandStrength / 20)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="absolute top-4 right-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {franchise.category}
                </span>
                <span className="absolute bottom-4 left-4 px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium">
                  {franchise.description}
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Investment Required</p>
                        <p className="font-semibold">₹{franchise.investment.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Expected ROI</p>
                        <p className="font-semibold">{franchise.roi}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Break-even Period</p>
                        <p className="font-semibold">{Math.round(100 / franchise.roi * 12)} months</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Market Match</span>
                        <span className="text-sm font-medium">{franchise.marketMatch}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${franchise.marketMatch}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Brand Strength</span>
                        <span className="text-sm font-medium">{franchise.brandStrength}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${franchise.brandStrength}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Recognition</p>
                        <p className="font-semibold">
                          {franchise.brandStrength > 90 ? 'Global Leader' : 
                           franchise.brandStrength > 80 ? 'Industry Leader' : 
                           franchise.brandStrength > 70 ? 'Well Established' : 'Growing Brand'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Key Requirements
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {franchise.requirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg"
                      >
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href={`tel:${franchise.contact.phone}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{franchise.contact.phone}</span>
                    </a>
                    <a
                      href={`mailto:${franchise.contact.email}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{franchise.contact.email}</span>
                    </a>
                    <a
                      href={franchise.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Visit Website</span>
                    </a>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm truncate">{franchise.contact.address}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Key Advantages
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {franchise.advantages.map((advantage, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded-lg"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {advantage}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {filteredFranchises.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-indigo-600 w-4' : 'bg-gray-300'
            }`}
            onClick={() => {
              const swiper = document.querySelector('.franchise-swiper')?.swiper;
              if (swiper) {
                swiper.slideTo(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}