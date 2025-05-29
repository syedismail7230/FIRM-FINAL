import type { LocationData, PeakHoursData, WeeklyData, MonthlyData } from '../types';
import { addHours, format } from 'date-fns';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function generateTrafficData(
  location: LocationData,
  type: 'daily' | 'weekly' | 'monthly'
): Promise<(PeakHoursData | WeeklyData | MonthlyData)[]> {
  const baseTraffic = Math.floor(location.population / 1000);
  const businessFactor = location.businessDensity / 5;
  const incomeFactor = location.avgIncome / 50000;

  switch (type) {
    case 'daily':
      return generateDailyData(baseTraffic, businessFactor, incomeFactor);
    case 'weekly':
      return generateWeeklyData(baseTraffic, businessFactor, incomeFactor);
    case 'monthly':
      return generateMonthlyData(baseTraffic, businessFactor, incomeFactor);
  }
}

function generateDailyData(
  baseTraffic: number,
  businessFactor: number,
  incomeFactor: number
): PeakHoursData[] {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  return Array.from({ length: 24 }, (_, i) => {
    const hour = addHours(startDate, i);
    let multiplier = 1;
    let pedestrianRatio = 0.6;
    
    // Morning peak (8-10 AM)
    if (i >= 8 && i <= 10) {
      multiplier = 2.5 * businessFactor;
      pedestrianRatio = 0.7;
    }
    // Lunch peak (12-2 PM)
    else if (i >= 12 && i <= 14) {
      multiplier = 2 * businessFactor;
      pedestrianRatio = 0.8;
    }
    // Evening peak (5-7 PM)
    else if (i >= 17 && i <= 19) {
      multiplier = 3 * businessFactor;
      pedestrianRatio = 0.6;
    }
    // Night (11 PM-5 AM)
    else if (i >= 23 || i <= 5) {
      multiplier = 0.3;
      pedestrianRatio = 0.3;
    }

    // Add some randomness
    multiplier *= (0.8 + Math.random() * 0.4);
    
    // Apply income factor
    multiplier *= (0.5 + incomeFactor * 0.5);

    const totalTraffic = Math.floor(baseTraffic * multiplier);
    const pedestrian = Math.floor(totalTraffic * pedestrianRatio);
    const vehicle = totalTraffic - pedestrian;

    return {
      hour: format(hour, 'HH:mm'),
      traffic: totalTraffic,
      pedestrian,
      vehicle
    };
  });
}

function generateWeeklyData(
  baseTraffic: number,
  businessFactor: number,
  incomeFactor: number
): WeeklyData[] {
  return DAYS.map(day => {
    let multiplier = 1;
    let pedestrianRatio = 0.6;

    // Weekend peaks
    if (day === 'Saturday') {
      multiplier = 2 * businessFactor;
      pedestrianRatio = 0.8;
    }
    else if (day === 'Sunday') {
      multiplier = 1.8 * businessFactor;
      pedestrianRatio = 0.9;
    }
    // Friday evening rush
    else if (day === 'Friday') {
      multiplier = 1.5 * businessFactor;
      pedestrianRatio = 0.7;
    }

    // Add randomness and income factor
    multiplier *= (0.8 + Math.random() * 0.4) * (0.5 + incomeFactor * 0.5);
    
    const totalTraffic = Math.floor(baseTraffic * multiplier * 24);
    const pedestrian = Math.floor(totalTraffic * pedestrianRatio);
    const vehicle = totalTraffic - pedestrian;

    return {
      day,
      traffic: totalTraffic,
      pedestrian,
      vehicle
    };
  });
}

function generateMonthlyData(
  baseTraffic: number,
  businessFactor: number,
  incomeFactor: number
): MonthlyData[] {
  return MONTHS.map(month => {
    let multiplier = 1;
    let pedestrianRatio = 0.6;
    
    // Festival/Holiday seasons
    if (['Oct', 'Nov', 'Dec'].includes(month)) {
      multiplier = 1.5 * businessFactor;
      pedestrianRatio = 0.8;
    }
    // Summer months
    else if (['Jun', 'Jul', 'Aug'].includes(month)) {
      multiplier = 0.8 * businessFactor;
      pedestrianRatio = 0.5;
    }
    
    // Add randomness and income factor
    multiplier *= (0.8 + Math.random() * 0.4) * (0.5 + incomeFactor * 0.5);
    
    const totalTraffic = Math.floor(baseTraffic * multiplier * 30 * 24);
    const pedestrian = Math.floor(totalTraffic * pedestrianRatio);
    const vehicle = totalTraffic - pedestrian;

    return {
      month,
      traffic: totalTraffic,
      pedestrian,
      vehicle
    };
  });
}