import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { LocationData, BusinessRecommendation } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  contact_info: {
    email: string;
    phone: string;
    preferred_contact_method: string;
  };
}

interface ReportData {
  location: LocationData;
  analytics: any;
  recommendations: BusinessRecommendation[];
  streets: any[];
  traffic: any[];
  user: User;
  profile: Profile;
  timestamp: string;
}

export async function generateReport(data: ReportData): Promise<Blob> {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 10;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPos);
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
  };

  const addSection = (text: string) => {
    checkPageBreak();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPos);
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
  };

  const addText = (text: string) => {
    checkPageBreak();
    doc.text(text, margin, yPos);
    yPos += lineHeight;
  };

  const checkPageBreak = () => {
    if (yPos > doc.internal.pageSize.height - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  const addDataRow = (label: string, value: string) => {
    checkPageBreak();
    doc.setFont('helvetica', 'bold');
    doc.text(label + ': ', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + doc.getTextWidth(label + ': '), yPos);
    yPos += lineHeight;
  };

  // Report Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Business Location Analysis Report', margin, yPos);
  yPos += lineHeight * 2;

  // Report Metadata
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  addDataRow('Generated On', format(new Date(), 'PPpp'));
  addDataRow('Location', data.location.name);
  yPos += lineHeight;

  // User Profile Section
  addSection('User Profile');
  addDataRow('Name', data.profile.full_name);
  addDataRow('Email', data.profile.contact_info.email);
  addDataRow('Phone', data.profile.contact_info.phone);
  addDataRow('Preferred Contact', data.profile.contact_info.preferred_contact_method);
  yPos += lineHeight;

  // Location Analytics Section
  addSection('Location Analytics');
  addDataRow('Population', data.location.population.toLocaleString());
  addDataRow('Average Income', `₹${data.location.avgIncome.toLocaleString()}`);
  addDataRow('Business Density', `${data.location.businessDensity}/km²`);
  addDataRow('Education Level', `${data.location.educationLevel}%`);
  yPos += lineHeight;

  // Best Streets Section
  addSection('Top Business Streets');
  if (data.streets && data.streets.length > 0) {
    data.streets.forEach((street, index) => {
      checkPageBreak();
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${street.name}`, margin, yPos);
      yPos += lineHeight;
      doc.setFont('helvetica', 'normal');
      addDataRow('  Score', street.score.toString());
      addDataRow('  Business Density', `${street.businessDensity.toFixed(1)}/km²`);
      addDataRow('  Daily Traffic', street.traffic.toLocaleString());
      addDataRow('  Type', street.type);
      yPos += lineHeight/2;
    });
  }
  yPos += lineHeight;

  // Business Recommendations
  addSection('Business Recommendations');
  if (data.recommendations && data.recommendations.length > 0) {
    data.recommendations.forEach((rec, index) => {
      checkPageBreak();
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${rec.type}`, margin, yPos);
      yPos += lineHeight;
      doc.setFont('helvetica', 'normal');
      addDataRow('  Success Probability', `${rec.successProbability}%`);
      addDataRow('  Investment Required', `₹${rec.investment.toLocaleString()}`);
      addDataRow('  Expected Revenue', `₹${rec.revenue.toLocaleString()}`);
      addDataRow('  Risk Level', rec.risk);
      yPos += lineHeight/2;
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      doc.internal.pageSize.height - margin
    );
  }

  return doc.output('blob');
}

export async function downloadReport(
  location: LocationData,
  analytics: any,
  recommendations: BusinessRecommendation[],
  streets: any[],
  traffic: any[],
  user: User
): Promise<void> {
  try {
    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    const reportData: ReportData = {
      location,
      analytics,
      recommendations,
      streets,
      traffic,
      user,
      profile,
      timestamp: new Date().toISOString()
    };

    const blob = await generateReport(reportData);
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `business-analysis-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}