import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, MapPin, Users, DollarSign, Shield, ExternalLink, RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cybersecurityAPI, type BreachData } from '@/services/cybersecurityAPI';

interface BreachData {
  id: string;
  title: string;
  date: string;
  location: string;
  country: string;
  organization: string;
  sector: string;
  affectedUsers: string;
  estimatedLoss: string;
  breachType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  source: string;
  sourceUrl?: string;
  isRecent: boolean;
}

const CybersecurityBreaches: React.FC = () => {
  const [breaches, setBreaches] = useState<BreachData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState(false);

  // Mock data for African cybersecurity breaches (in real implementation, this would come from AI/API)
  const mockBreaches: BreachData[] = [
    {
      id: '1',
      title: 'Kenya Revenue Authority Data Breach',
      date: '2025-01-15',
      location: 'Nairobi',
      country: 'Kenya',
      organization: 'Kenya Revenue Authority (KRA)',
      sector: 'Government/Tax',
      affectedUsers: '2.5 million taxpayers',
      estimatedLoss: '$12 million',
      breachType: 'Data Breach',
      severity: 'Critical',
      description: 'Sophisticated cyberattack compromised taxpayer personal information including IDs, financial records, and tax returns.',
      source: 'Kenya Cyber Security Authority',
      sourceUrl: 'https://csa.gov.ke',
      isRecent: true
    },
    {
      id: '2',
      title: 'South African Banking Consortium Attack',
      date: '2024-12-28',
      location: 'Johannesburg',
      country: 'South Africa',
      organization: 'Multiple Banks (FNB, Standard Bank)',
      sector: 'Financial Services',
      affectedUsers: '1.8 million customers',
      estimatedLoss: '$25 million',
      breachType: 'Ransomware',
      severity: 'Critical',
      description: 'Coordinated ransomware attack targeting multiple South African banks, disrupting services for 72 hours.',
      source: 'South African Reserve Bank',
      isRecent: true
    },
    {
      id: '3',
      title: 'Nigerian Telecom Infrastructure Breach',
      date: '2024-12-10',
      location: 'Lagos',
      country: 'Nigeria',
      organization: 'MTN Nigeria',
      sector: 'Telecommunications',
      affectedUsers: '45 million subscribers',
      estimatedLoss: '$18 million',
      breachType: 'Network Intrusion',
      severity: 'High',
      description: 'Advanced persistent threat (APT) group infiltrated telecom infrastructure, accessing customer communications data.',
      source: 'Nigerian Communications Commission',
      isRecent: true
    },
    {
      id: '4',
      title: 'Ghana Health Service Ransomware',
      date: '2024-11-22',
      location: 'Accra',
      country: 'Ghana',
      organization: 'Ghana Health Service',
      sector: 'Healthcare',
      affectedUsers: '3.2 million patients',
      estimatedLoss: '$8 million',
      breachType: 'Ransomware',
      severity: 'High',
      description: 'Healthcare systems encrypted by ransomware, compromising patient records and disrupting medical services.',
      source: 'Ghana Cyber Security Authority',
      isRecent: false
    },
    {
      id: '5',
      title: 'Ethiopian Airlines Customer Data Leak',
      date: '2024-10-15',
      location: 'Addis Ababa',
      country: 'Ethiopia',
      organization: 'Ethiopian Airlines',
      sector: 'Aviation',
      affectedUsers: '2.1 million passengers',
      estimatedLoss: '$15 million',
      breachType: 'Data Leak',
      severity: 'High',
      description: 'Misconfigured database exposed passenger personal information, booking details, and payment data.',
      source: 'Ethiopian Civil Aviation Authority',
      isRecent: false
    },
    {
      id: '6',
      title: 'Morocco Government Portal Hack',
      date: '2024-09-08',
      location: 'Rabat',
      country: 'Morocco',
      organization: 'Ministry of Interior',
      sector: 'Government',
      affectedUsers: '5.5 million citizens',
      estimatedLoss: '$22 million',
      breachType: 'SQL Injection',
      severity: 'Critical',
      description: 'Government portal compromised through SQL injection, exposing citizen identification and administrative data.',
      source: 'Morocco National Cybersecurity Directorate',
      isRecent: false
    }
  ];

  // Simulate AI-powered data fetching
  const fetchLatestBreaches = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, this would call an AI service or cybersecurity API
    setBreaches(mockBreaches);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLatestBreaches();
    
    // Auto-refresh every 30 minutes (in real implementation)
    const interval = setInterval(fetchLatestBreaches, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const displayedBreaches = showAll ? breaches : breaches.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">
              African Cybersecurity Breaches
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Real-time monitoring of cybersecurity incidents across Africa. Stay informed about the latest threats and breaches affecting the continent.
          </p>
          
          {/* AI Update Status */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI-Powered Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <Button
              onClick={fetchLatestBreaches}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Fetching latest cybersecurity incidents...</p>
          </div>
        )}

        {/* Breaches Grid */}
        {!isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayedBreaches.map((breach) => (
              <div
                key={breach.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(breach.severity)}`}>
                      {breach.severity}
                    </span>
                    {breach.isRecent && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Recent
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {breach.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {breach.description}
                  </p>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{formatDate(breach.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{breach.location}, {breach.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{breach.affectedUsers}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{breach.estimatedLoss}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{breach.organization}</p>
                        <p className="text-xs text-gray-500">{breach.sector}</p>
                      </div>
                      {breach.sourceUrl && (
                        <a
                          href={breach.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <span>Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {!isLoading && breaches.length > 3 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowAll(!showAll)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold"
            >
              {showAll ? 'Show Less' : `Show All ${breaches.length} Incidents`}
              <TrendingUp className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Statistics Summary */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            African Cybersecurity Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{breaches.length}</div>
              <div className="text-sm text-gray-600">Total Incidents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {breaches.filter(b => b.isRecent).length}
              </div>
              <div className="text-sm text-gray-600">Recent Breaches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {new Set(breaches.map(b => b.country)).size}
              </div>
              <div className="text-sm text-gray-600">Countries Affected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {breaches.filter(b => b.severity === 'Critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Incidents</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CybersecurityBreaches;
