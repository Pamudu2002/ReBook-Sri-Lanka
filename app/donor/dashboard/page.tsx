'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';
import Confirm from '@/components/Confirm';

interface Requirement {
  _id: string;
  studentName: string;
  age: number;
  school: string;
  grade: string;
  address: string;
  district: string;
  contactNumber: string;
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
}

export default function DonorDashboard() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myCommitments, setMyCommitments] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ title: '', message: '', type: 'info' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'donor')) {
      router.push('/donor/login');
      return;
    }

    if (user && user.role === 'donor') {
      fetchMyCommitments();
    }
  }, [user, authLoading]);

  const fetchMyCommitments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/donor/commitments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMyCommitments(data.requirements || []);
    } catch (error) {
      console.error('Error fetching commitments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (requirementId: string) => {
    setConfirmAction(() => async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/requirements/${requirementId}/complete`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          fetchMyCommitments();
          setSelectedRequirement(null);
          setAlertConfig({
            title: t('success'),
            message: t('completionSuccess'),
            type: 'success',
          });
          setShowAlert(true);
        } else {
          const data = await response.json();
          setAlertConfig({
            title: t('error'),
            message: data.message || 'Failed to complete',
            type: 'error',
          });
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error completing requirement:', error);
        setAlertConfig({
          title: t('error'),
          message: t('errorOccurred'),
          type: 'error',
        });
        setShowAlert(true);
      }
    });
    setShowConfirm(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
    };
    const labels = {
      'in-progress': t('inProgressStatus'),
      'completed': t('completedStatus'),
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (authLoading || loading) {
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
            {t('myCommitments')}
          </h1>
          <p className="text-gray-600">
            {t('myCommitmentsDesc')}
          </p>
        </div>

        {/* Browse More Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/submissions')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('browseMoreRequirements')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t('totalCommitments')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{myCommitments.length}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t('inProgress')}</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {myCommitments.filter(r => r.status === 'in-progress').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t('completed')}</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {myCommitments.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements List */}
        {myCommitments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">{t('noCommitmentsYet')}</p>
            <button
              onClick={() => router.push('/submissions')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('browseRequirements')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {myCommitments.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
              >
                {/* Card Header */}
                <div className={`p-3 text-white border-b ${
                  req.status === 'completed' 
                    ? 'bg-green-600 border-green-700' 
                    : 'bg-blue-600 border-blue-700'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold line-clamp-1">{req.studentName}</h3>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-white text-opacity-90 text-xs">
                    {req.school}
                  </p>
                  <p className="text-white text-opacity-80 text-xs">Grade {req.grade}</p>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="truncate">{req.contactNumber}</span>
                    </div>
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

                  {/* Action Buttons */}
                  <div className="space-y-1.5 mt-auto">
                    <button
                      onClick={() => setSelectedRequirement(req)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded text-sm font-semibold transition-colors"
                    >
                      {t('viewDetails')}
                    </button>
                    {req.status === 'in-progress' && (
                      <button
                        onClick={() => handleComplete(req._id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold transition-colors"
                      >
                        {t('markAsCompleted')}
                      </button>
                    )}
                  </div>
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
            <div className={`sticky top-0 text-white p-5 rounded-t-lg border-b ${
              selectedRequirement.status === 'completed'
                ? 'bg-green-600 border-green-700'
                : 'bg-blue-600 border-blue-700'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedRequirement.studentName}</h2>
                  <p className="text-white text-opacity-90">{selectedRequirement.school} • Grade {selectedRequirement.grade}</p>
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

              {/* Contact Info */}
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

              {/* Required Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t('requiredItems')}</h3>
                <div className="space-y-2">
                  {selectedRequirement.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                      <span className="text-gray-900 font-medium">{item.itemName}</span>
                      <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {t('quantity')}: {item.quantity}
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedRequirement.status === 'in-progress' && (
                  <button
                    onClick={() => handleComplete(selectedRequirement._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {t('markAsCompleted')}
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

      {/* Custom Alert */}
      <Alert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />

      {/* Custom Confirm Dialog */}
      <Confirm
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => confirmAction && confirmAction()}
        title={t('confirmCompletion')}
        message={t('areYouSure')}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        type="warning"
      />
    </div>
  );
}

