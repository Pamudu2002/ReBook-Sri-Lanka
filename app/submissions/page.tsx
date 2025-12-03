'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';

interface Requirement {
  _id: string;
  studentName: string;
  age: number;
  school: string;
  grade: string;
  address?: string;
  district: string;
  contactNumber?: string;
  guardianName?: string;
  guardianContact?: string;
  items: {
    itemName: string;
    quantity: number;
    priority: string;
  }[];
  additionalNotes?: string;
  status: string;
  submittedAt: string;
  donorId?: string;
  donorName?: string;
}

export default function SubmissionsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  useEffect(() => {
    fetchRequirements();
  }, [user]);

  const fetchRequirements = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/requirements/browse', { headers });
      const data = await response.json();
      setRequirements(data.requirements || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async (requirementId: string) => {
    if (!user || user.role !== 'donor') {
      router.push('/donor/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/requirements/${requirementId}/commit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchRequirements();
        alert(t('commitmentSuccess'));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to commit');
      }
    } catch (error) {
      console.error('Error committing:', error);
      alert('An error occurred');
    }
  };

  const filteredRequirements = requirements.filter(req => {
    // Status filter
    if (filter !== 'all') {
      if (filter === 'open' && !(req.status === 'open' || req.status === 'approved')) {
        return false;
      }
      if (filter !== 'open' && req.status !== filter) {
        return false;
      }
    }
    
    // District filter
    if (selectedDistrict !== 'all' && req.district !== selectedDistrict) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    // Normalize 'approved' to 'open' for display
    const normalizedStatus = status === 'approved' ? 'open' : status;
    const badges = {
      'open': 'bg-green-100 text-green-800 border-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      'completed': 'bg-gray-100 text-gray-800 border-gray-300',
    };
    const labels = {
      'open': t('openStatus'),
      'in-progress': t('inProgressStatus'),
      'completed': t('completedStatus'),
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[normalizedStatus as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[normalizedStatus as keyof typeof labels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Loading size="lg" text={t('loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('studentRequirements')}
          </h1>
          <p className="text-gray-600">
            {t('browseRequirementsDesc')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('allSubmissions')} ({requirements.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'open'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('openStatus')} ({requirements.filter(r => r.status === 'open' || r.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('inProgressStatus')} ({requirements.filter(r => r.status === 'in-progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('completedStatus')} ({requirements.filter(r => r.status === 'completed').length})
            </button>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">{t('district')}:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{t('allDistricts')}</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            {selectedDistrict !== 'all' && (
              <button
                onClick={() => setSelectedDistrict('all')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('clearFilter')}
              </button>
            )}
          </div>
        </div>

        {/* Requirements Grid */}
        {filteredRequirements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg">{t('noRequirementsFound')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRequirements.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
              >
                {/* Card Header */}
                <div className="bg-blue-50 border-b border-blue-100 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-gray-800 line-clamp-1">{req.studentName}</h3>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-gray-600 text-xs">
                    {req.school}
                  </p>
                  <p className="text-gray-500 text-xs">Grade {req.grade}</p>
                </div>

                {/* Card Body */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-600 text-xs">
                      <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{req.district}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </div>
                    {req.status === 'in-progress' && req.donorName && (
                      <div className="flex items-center text-blue-600 text-xs font-medium">
                        <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">{t('helpedBy')}: {req.donorName}</span>
                      </div>
                    )}
                  </div>

                  {/* Required Items */}
                  <div className="mb-3 flex-1">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">{t('requiredItems')}:</h4>
                    <div className="space-y-1">
                      {req.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs">
                          <span className="text-gray-700 truncate flex-1">{item.itemName}</span>
                          <span className="text-xs font-semibold text-primary-700 ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                      {req.items.length > 2 && (
                        <p className="text-xs text-gray-500 text-center py-0.5">
                          +{req.items.length - 2} {t('moreItems')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedRequirement(req)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded text-sm font-semibold transition-colors mt-auto"
                  >
                    {t('viewDetails')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-primary-600 text-white p-5 rounded-t-lg border-b border-primary-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedRequirement.studentName}</h2>
                  <p className="text-primary-100">{selectedRequirement.school} • Grade {selectedRequirement.grade}</p>
                </div>
                <button
                  onClick={() => setSelectedRequirement(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-gray-600">{t('status')}</label>
                <div className="mt-1">
                  {getStatusBadge(selectedRequirement.status)}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">{t('age')}</label>
                  <p className="text-gray-900 mt-1">{selectedRequirement.age}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">{t('district')}</label>
                  <p className="text-gray-900 mt-1">{selectedRequirement.district}</p>
                </div>
              </div>

              {/* Contact Info - Only for logged-in donors on open submissions */}
              {user && user.role === 'donor' && (selectedRequirement.status === 'open' || selectedRequirement.status === 'approved') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t('contactInformation')}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">{t('address')}</label>
                      <p className="text-gray-900">{selectedRequirement.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">{t('contactNumber')}</label>
                      <p className="text-gray-900">{selectedRequirement.contactNumber}</p>
                    </div>
                    {selectedRequirement.guardianName && (
                      <>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">{t('guardianName')}</label>
                          <p className="text-gray-900">{selectedRequirement.guardianName}</p>
                        </div>
                        {selectedRequirement.guardianContact && (
                          <div>
                            <label className="text-sm font-semibold text-gray-600">{t('guardianContact')}</label>
                            <p className="text-gray-900">{selectedRequirement.guardianContact}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Required Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t('requiredItems')}</h3>
                <div className="space-y-2">
                  {selectedRequirement.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                      <span className="text-gray-900 font-medium">{item.itemName}</span>
                      <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedRequirement.additionalNotes && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">{t('additionalNotes')}</label>
                  <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">{selectedRequirement.additionalNotes}</p>
                </div>
              )}

              {/* Helper Info */}
              {selectedRequirement.status === 'in-progress' && selectedRequirement.donorName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900">
                    <span className="font-semibold">{t('helpedBy')}:</span> {selectedRequirement.donorName}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {user && user.role === 'donor' && (selectedRequirement.status === 'open' || selectedRequirement.status === 'approved') && (
                  <button
                    onClick={() => {
                      handleCommit(selectedRequirement._id);
                      setSelectedRequirement(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {t('commitToHelp')}
                  </button>
                )}
                {!user && (selectedRequirement.status === 'open' || selectedRequirement.status === 'approved') && (
                  <button
                    onClick={() => router.push('/donor/login')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {t('loginToHelp')}
                  </button>
                )}
                <button
                  onClick={() => setSelectedRequirement(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
