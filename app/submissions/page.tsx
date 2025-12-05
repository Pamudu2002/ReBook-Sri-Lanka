'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ title: '', message: '', type: 'info' });

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  useEffect(() => {
    fetchRequirements();
  }, [user, currentPage, filter, selectedDistrict]);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status: filter,
        district: selectedDistrict
      });
      
      const response = await fetch(`/api/requirements/browse?${params}`, { headers });
      const data = await response.json();
      setRequirements(data.requirements || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.totalCount || 0);
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
        setAlertConfig({
          title: t('success'),
          message: t('commitmentSuccess'),
          type: 'success',
        });
        setShowAlert(true);
      } else {
        const data = await response.json();
        setAlertConfig({
          title: t('error'),
          message: data.message || 'Failed to commit',
          type: 'error',
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error committing:', error);
      setAlertConfig({
        title: t('error'),
        message: t('errorOccurred'),
        type: 'error',
      });
      setShowAlert(true);
    }
  };

  // Filtering now handled by API, so we use requirements directly
  const filteredRequirements = requirements;

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
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <Loading size="lg" text={t('loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
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
              onClick={() => { setFilter('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('allSubmissions')} {filter === 'all' && `(${totalCount})`}
            </button>
            <button
              onClick={() => { setFilter('open'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'open'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('openStatus')} {filter === 'open' && `(${totalCount})`}
            </button>
            <button
              onClick={() => { setFilter('in-progress'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('inProgressStatus')} {filter === 'in-progress' && `(${totalCount})`}
            </button>
            <button
              onClick={() => { setFilter('completed'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('completedStatus')} {filter === 'completed' && `(${totalCount})`}
            </button>
          </div>

          {/* District Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('district')}:
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
            >
              <option value="all">{t('allDistricts')}</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            {selectedDistrict !== 'all' && (
              <button
                onClick={() => { setSelectedDistrict('all'); setCurrentPage(1); }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t('clearFilter')}
              </button>
            )}
          </div>
        </div>

        {/* Requirements Grid */}
        {filteredRequirements.length === 0 ? (
          <div className="bg-white rounded shadow-md p-12 text-center">
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
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-800 truncate flex-1 min-w-0">{req.studentName}</h3>
                    <div className="flex-shrink-0">
                      {getStatusBadge(req.status)}
                    </div>
                  </div>
                  {req.status !== 'pending' && (
                    <div className="flex items-center gap-1 mb-1">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-blue-600">Verified</span>
                    </div>
                  )}
                  <p className="text-gray-600 text-xs truncate">
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
                    {(req.status === 'in-progress' || req.status === 'completed') && req.donorName && (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequirement && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded max-w-lg w-full max-h-[90vh] flex flex-col shadow-lg">
            {/* Header */}
            <div className="bg-blue-50 border-b border-blue-100 px-5 py-4 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRequirement.studentName}</h3>
                  <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {selectedRequirement.school} <span className="text-blue-600">•</span> Grade {selectedRequirement.grade}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRequirement(null)}
                  className="text-gray-500 hover:text-gray-700 bg-white hover:bg-blue-100 p-1.5 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                {getStatusBadge(selectedRequirement.status)}
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedRequirement.age} yrs
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedRequirement.district}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Contact Info - Only for logged-in donors on open submissions */}
              {user && user.role === 'donor' && (selectedRequirement.status === 'open' || selectedRequirement.status === 'approved') && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {t('contactInformation')}
                  </h4>
                  <div className="bg-gray-50 rounded p-3 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-900 leading-relaxed">{selectedRequirement.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-gray-900">{selectedRequirement.contactNumber}</p>
                    </div>
                    {selectedRequirement.guardianName && (
                      <>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">{t('guardianName')}</p>
                          <p className="text-gray-900">{selectedRequirement.guardianName}</p>
                        </div>
                        {selectedRequirement.guardianContact && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
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
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {t('requiredItems')}
                </h4>
                <div className="space-y-2">
                  {selectedRequirement.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
                      <span className="text-gray-900">{item.itemName}</span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedRequirement.additionalNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    {t('additionalNotes')}
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded leading-relaxed">{selectedRequirement.additionalNotes}</p>
                </div>
              )}

              {/* Helper Info */}
              {(selectedRequirement.status === 'in-progress' || selectedRequirement.status === 'completed') && selectedRequirement.donorName && (
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{t('helpedBy')}:</span> {selectedRequirement.donorName}
                  </p>
                </div>
              )}
            </div>

            {/* Footer with Action Buttons */}
            <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 flex-shrink-0">
              <div className="flex gap-2">
                {user && user.role === 'donor' && (selectedRequirement.status === 'open' || selectedRequirement.status === 'approved') && (
                  <button
                    onClick={() => {
                      handleCommit(selectedRequirement._id);
                      setSelectedRequirement(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                  >
                    {t('commitToHelp')}
                  </button>
                )}
                {!user && (selectedRequirement.status === 'open' || selectedRequirement.status === 'approved') && (
                  <button
                    onClick={() => router.push('/donor/login')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold transition-colors"
                  >
                    {t('loginToHelp')}
                  </button>
                )}
                <button
                  onClick={() => setSelectedRequirement(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-semibold transition-colors text-sm"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <Alert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
}
