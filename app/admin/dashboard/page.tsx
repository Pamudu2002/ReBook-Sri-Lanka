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
  address: string;
  district: string;
  contactNumber: string;
  items: { itemName: string; quantity: number }[];
  additionalNotes?: string;
  status: string;
  submittedAt: string;
}

interface Donor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  organization?: string;
  registeredAt: string;
}

interface Statistics {
  requirements: {
    total: number;
    pending: number;
    approved: number;
    fulfilled: number;
  };
  donors: {
    total: number;
    verified: number;
    pending: number;
  };
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'donors'>('overview');
  const [pendingRequirements, setPendingRequirements] = useState<Requirement[]>([]);
  const [pendingDonors, setPendingDonors] = useState<Donor[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
      return;
    }

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [reqRes, donorRes, statsRes] = await Promise.all([
        fetch('/api/admin/requirements/pending', { headers }),
        fetch('/api/admin/donors/pending', { headers }),
        fetch('/api/admin/statistics', { headers }),
      ]);

      const reqData = await reqRes.json();
      const donorData = await donorRes.json();
      const statsData = await statsRes.json();

      setPendingRequirements(reqData.requirements || []);
      setPendingDonors(donorData.donors || []);
      setStatistics(statsData.statistics || null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequirementAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/requirements/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating requirement:', error);
    }
  };

  const handleVerifyDonor = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/donors/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error verifying donor:', error);
    }
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('adminDashboard')}
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('statistics')}
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'requirements'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('pendingRequirements')} ({pendingRequirements.length})
          </button>
          <button
            onClick={() => setActiveTab('donors')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'donors'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('pendingDonors')} ({pendingDonors.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && statistics && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Requirements</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('totalRequirements')}:</span>
                  <span className="font-semibold">{statistics.requirements.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pending')}:</span>
                  <span className="font-semibold text-yellow-600">{statistics.requirements.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('approved')}:</span>
                  <span className="font-semibold text-green-600">{statistics.requirements.approved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('fulfilled')}:</span>
                  <span className="font-semibold text-blue-600">{statistics.requirements.fulfilled}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Donors</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('totalDonors')}:</span>
                  <span className="font-semibold">{statistics.donors.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified:</span>
                  <span className="font-semibold text-green-600">{statistics.donors.verified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('pending')}:</span>
                  <span className="font-semibold text-yellow-600">{statistics.donors.pending}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('requirements')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors"
                >
                  Review Requirements
                </button>
                <button
                  onClick={() => setActiveTab('donors')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  Verify Donors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Requirements Tab */}
        {activeTab === 'requirements' && (
          <div className="space-y-4">
            {pendingRequirements.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No pending requirements</p>
              </div>
            ) : (
              pendingRequirements.map((req) => (
                <div key={req._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{req.studentName}</h3>
                      <p className="text-gray-600">{req.school} - Grade {req.grade}</p>
                      <p className="text-gray-600">Age: {req.age} | District: {req.district}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Contact: {req.contactNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(req.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-2">Required Items:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {req.items.map((item, idx) => (
                          <li key={idx}>{item.itemName} (Qty: {item.quantity})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {req.additionalNotes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">Additional Notes:</p>
                      <p className="text-gray-600">{req.additionalNotes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleRequirementAction(req._id, 'reject')}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {t('reject')}
                    </button>
                    <button
                      onClick={() => handleRequirementAction(req._id, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {t('approve')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending Donors Tab */}
        {activeTab === 'donors' && (
          <div className="space-y-4">
            {pendingDonors.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No pending donor verifications</p>
              </div>
            ) : (
              pendingDonors.map((donor) => (
                <div key={donor._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{donor.name}</h3>
                      <p className="text-gray-600">Email: {donor.email}</p>
                      <p className="text-gray-600">Phone: {donor.phone}</p>
                      <p className="text-gray-600">District: {donor.district}</p>
                      {donor.organization && (
                        <p className="text-gray-600">Organization: {donor.organization}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600">Address:</p>
                      <p className="font-medium text-gray-800">{donor.address}</p>
                      <p className="text-sm text-gray-500 mt-3">
                        Registered: {new Date(donor.registeredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleVerifyDonor(donor._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg transition-colors"
                    >
                      {t('verify')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
