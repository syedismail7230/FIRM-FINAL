import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Clock, Users, Car, TrendingUp } from 'lucide-react';
import type { PeakHoursData, WeeklyData, MonthlyData, LocationData } from '../types';
import { generateTrafficData } from '../utils/trafficAnalyzer.ts';
import toast from 'react-hot-toast';

interface TrafficChartProps {
  location: LocationData;
  type: 'daily' | 'weekly' | 'monthly';
}

export function TrafficChart({ location, type }: TrafficChartProps) {
  const [data, setData] = useState<(PeakHoursData | WeeklyData | MonthlyData)[]>([]);
  const [loading, setLoading] = useState(true);
  const [peakHours, setPeakHours] = useState<{ time: string; traffic: number }[]>([]);
  const [trafficTrend, setTrafficTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    const updateTrafficData = async () => {
      try {
        setLoading(true);
        const newData = await generateTrafficData(location, type);
        setData(newData);

        // Calculate peak hours
        if (type === 'daily') {
          const sortedByTraffic = [...newData].sort((a, b) => 
            (b as PeakHoursData).traffic - (a as PeakHoursData).traffic
          );
          setPeakHours(sortedByTraffic.slice(0, 3).map(hour => ({
            time: (hour as PeakHoursData).hour,
            traffic: (hour as PeakHoursData).traffic
          })));
        }

        // Calculate trend
        const firstHalf = newData.slice(0, Math.floor(newData.length / 2));
        const secondHalf = newData.slice(Math.floor(newData.length / 2));
        const firstAvg = firstHalf.reduce((sum, item) => sum + item.traffic, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, item) => sum + item.traffic, 0) / secondHalf.length;
        
        setTrafficTrend(
          secondAvg > firstAvg * 1.1 ? 'up' :
          secondAvg < firstAvg * 0.9 ? 'down' : 
          'stable'
        );

      } catch (error) {
        console.error('Error updating traffic data:', error);
        toast.error('Failed to update traffic data');
      } finally {
        setLoading(false);
      }
    };

    updateTrafficData();

    // Set up real-time updates
    const interval = setInterval(updateTrafficData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [location, type]);

  const getXAxisKey = () => {
    switch (type) {
      case 'daily': return 'hour';
      case 'weekly': return 'day';
      case 'monthly': return 'month';
    }
  };

  const getTrendColor = () => {
    switch (trafficTrend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Peak Hours</h3>
          </div>
          <div className="space-y-2">
            {peakHours.map((peak, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{peak.time}</span>
                <span className="font-medium">{peak.traffic.toLocaleString()} visitors</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium">Traffic Composition</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pedestrian</span>
              <span className="font-medium">
                {Math.round(data.reduce((sum, d) => sum + d.pedestrian, 0) / data.length).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vehicle</span>
              <span className="font-medium">
                {Math.round(data.reduce((sum, d) => sum + d.vehicle, 0) / data.length).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${getTrendColor()}`} />
            <h3 className="font-medium">Traffic Trend</h3>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${getTrendColor()}`}>
              {trafficTrend === 'up' ? '↑' : trafficTrend === 'down' ? '↓' : '→'}
            </p>
            <p className="text-sm text-gray-600">
              {trafficTrend === 'up' ? 'Increasing' : trafficTrend === 'down' ? 'Decreasing' : 'Stable'}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getXAxisKey()} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="pedestrian"
              name="Pedestrian"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="vehicle"
              name="Vehicle"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}