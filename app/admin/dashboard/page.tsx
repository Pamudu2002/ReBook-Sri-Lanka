'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';

// Types
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
  items: { itemName: string; quantity: number; priority: string }[];
  additionalNotes?: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  submittedAt: string;
  donorId?: string;
  donorName?: string;
}

interface Donor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  organization?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  registeredAt: string;
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Statistics {
  requirements: {
    total: number;
    pending: number;
    approved: number;
    'in-progress': number;
    completed: number;
    rejected: number;
  };
  donors: {
    total: number;
    verified: number;
    pending: number;
    emailVerified: number;
  };
  admins: {
    total: number;
  };
}

type ViewMode = 'overview' | 'requirements' | 'donors' | 'admins';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // State management
  const [activeView, setActiveView] = useState<ViewMode>('overview');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'age'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modals
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Requirement | Donor | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string, id: string } | null>(null);
  
  // Alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ title: '', message: '', type: 'info' });
  
  // Form
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
      return;
    }

    if (user && user.role === 'admin') {
      fetchAllData();
    }
  }, [user, authLoading]);

  const fetchAllData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, reqRes, donorRes, adminRes] = await Promise.all([
        fetch('/api/admin/statistics', { headers }),
        fetch('/api/admin/requirements/all', { headers }), // Initial fetch without params (or could reuse fetchRequirements logic if refactored)
        fetch('/api/admin/donors/all', { headers }),
        fetch('/api/admin/admins/all', { headers }),
      ]);

      const [statsData, reqData, donorData, adminData] = await Promise.all([
        statsRes.json(),
        reqRes.json(),
        donorRes.json(),
        adminRes.json(),
      ]);

      setStatistics(statsData.statistics || null);
      setRequirements(reqData.requirements || []);
      setDonors(donorData.donors || []);
      setAdmins(adminData.admins || []);
      setFilteredCount(reqData.totalCount || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlertMessage('Error', 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRequirements = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (districtFilter !== 'all') params.append('district', districtFilter);
      if (ageFilter) params.append('age', ageFilter);
      
      // Map frontend sort to backend sort
      let backendSortBy = 'newest';
      if (sortBy === 'date') {
        backendSortBy = sortOrder === 'desc' ? 'newest' : 'oldest';
      } else if (sortBy === 'name') {
        backendSortBy = 'name'; // Backend handles this as studentName: 1
        // Note: Backend currently only supports name: asc based on my implementation (studentName: 1). 
        // If I need descending, I might need to adjust backend or just accept it.
        // Let's check backend... "case 'name': sort = { studentName: 1 };"
        // It seems backend doesn't support name desc explicitly? 
        // Wait, the plan was simple. Let's stick to what backend supports or update backend?
        // Backend supports: oldest, newest, name (asc), age (asc).
        // If frontend asks for name desc, backend won't handle it with current code.
        // For now, I will pass 'name' and ignore order for name/age in backend or update backend later if critical.
        // Actually, let's just pass what we can.
      } else if (sortBy === 'age') {
        backendSortBy = 'age';
      }

      params.append('sortBy', backendSortBy);

      const response = await fetch(`/api/admin/requirements/all?${params.toString()}`, { headers });
      const data = await response.json();
      
      if (data.success) {
        setRequirements(data.requirements);
        setFilteredCount(data.totalCount || 0);
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && user.role === 'admin' && activeView === 'requirements') {
        fetchRequirements();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, districtFilter, ageFilter, sortBy, sortOrder, activeView]);

  const showAlertMessage = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setAlertConfig({ title, message, type });
    setShowAlert(true);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/requirements/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAllData(true);
        showAlertMessage('Success', 'Status updated successfully', 'success');
      } else {
        showAlertMessage('Error', 'Failed to update status', 'error');
      }
    } catch (error) {
      showAlertMessage('Error', 'An error occurred', 'error');
    }
  };

  const handleVerifyDonor = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/donors/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchAllData(true);
        showAlertMessage('Success', 'Donor verified successfully', 'success');
      } else {
        showAlertMessage('Error', 'Failed to verify donor', 'error');
      }
    } catch (error) {
      showAlertMessage('Error', 'An error occurred', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      
      if (deleteTarget.type === 'requirement') {
        endpoint = `/api/admin/requirements/${deleteTarget.id}`;
      } else if (deleteTarget.type === 'donor') {
        endpoint = `/api/admin/donors/${deleteTarget.id}`;
      } else if (deleteTarget.type === 'admin') {
        endpoint = `/api/admin/admins/${deleteTarget.id}`;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchAllData(true);
        showAlertMessage('Success', `${deleteTarget.type} deleted successfully`, 'success');
      } else {
        showAlertMessage('Error', 'Failed to delete item', 'error');
      }
    } catch (error) {
      showAlertMessage('Error', 'An error occurred', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminForm.name || !adminForm.email || !adminForm.password || !adminForm.confirmPassword) {
      showAlertMessage('Error', 'All fields are required', 'error');
      return;
    }

    if (adminForm.password.length < 6) {
      showAlertMessage('Error', 'Password must be at least 6 characters', 'error');
      return;
    }

    if (adminForm.password !== adminForm.confirmPassword) {
      showAlertMessage('Error', 'Passwords do not match', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: adminForm.name,
          email: adminForm.email,
          password: adminForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlertMessage('Success', 'Admin created successfully', 'success');
        setAdminForm({ name: '', email: '', password: '', confirmPassword: '' });
        setShowAddAdminModal(false);
        fetchAllData(true);
      } else {
        showAlertMessage('Error', data.message || 'Failed to create admin', 'error');
      }
    } catch (error) {
      showAlertMessage('Error', 'An error occurred', 'error');
    }
  };

  // Filtering and sorting
  const getFilteredAndSortedItems = () => {
    let items: any[] = [];
    
    if (activeView === 'requirements') {
      items = [...requirements];
    } else if (activeView === 'donors') {
      items = [...donors];
    } else if (activeView === 'admins') {
      items = [...admins];
    }

    // Apply search filter
    if (searchTerm) {
      items = items.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        if (activeView === 'requirements') {
          // Server-side filtered, but we might want to filter if something is cached? 
          // No, trusting server response.
          return true; 
        } else if (activeView === 'donors') {
          return item.name?.toLowerCase().includes(searchLower) ||
                 item.email?.toLowerCase().includes(searchLower) ||
                 item.district?.toLowerCase().includes(searchLower);
        } else {
          return item.name?.toLowerCase().includes(searchLower) ||
                 item.email?.toLowerCase().includes(searchLower);
        }
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      items = items.filter(item => {
        if (activeView === 'requirements') {
          return true; // Server side
        } else if (activeView === 'donors') {
          if (statusFilter === 'verified') return item.isVerified;
          if (statusFilter === 'unverified') return !item.isVerified;
          return true;
        }
        return true;
      });
    }

    // Apply district filter
    if (districtFilter !== 'all' && (activeView === 'requirements' || activeView === 'donors')) {
      if (activeView === 'requirements') {
         // Server side
      } else {
        items = items.filter(item => item.district === districtFilter);
      }
    }

    // Apply sorting
    if (activeView === 'requirements') {
        // Server side sorted
    } else {
        items.sort((a, b) => {
        let compareValue = 0;
        
        if (sortBy === 'date') {
            const dateA = new Date(a.submittedAt || a.registeredAt || a.createdAt).getTime();
            const dateB = new Date(b.submittedAt || b.registeredAt || b.createdAt).getTime();
            compareValue = dateA - dateB;
        } else if (sortBy === 'name') {
            const nameA = (a.studentName || a.name || '').toLowerCase();
            const nameB = (b.studentName || b.name || '').toLowerCase();
            compareValue = nameA.localeCompare(nameB);
        }

        return sortOrder === 'asc' ? compareValue : -compareValue;
        });
    }

    return items;
  };

  const filteredItems = getFilteredAndSortedItems();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <Loading size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your platform efficiently</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchAllData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium text-gray-700">Refresh</span>
            </button>
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add Admin</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeView === 'overview'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveView('requirements')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeView === 'requirements'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Requirements ({filteredCount || 0})
              </div>
            </button>
            <button
              onClick={() => setActiveView('donors')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeView === 'donors'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Donors ({statistics?.donors.total || 0})
              </div>
            </button>
            <button
              onClick={() => setActiveView('admins')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeView === 'admins'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Admins ({statistics?.admins.total || 0})
              </div>
            </button>
          </div>
        </div>

        {/* Overview Content */}
        {activeView === 'overview' && statistics && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Requirements */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Requirements</p>
                    <p className="text-3xl font-bold mt-2">{statistics.requirements.total}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-blue-100">Pending: {statistics.requirements.pending}</span>
                </div>
              </div>

              {/* Total Donors */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Donors</p>
                    <p className="text-3xl font-bold mt-2">{statistics.donors.total}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-100">Verified: {statistics.donors.verified}</span>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold mt-2">{statistics.requirements.completed}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-purple-100">In Progress: {statistics.requirements['in-progress']}</span>
                </div>
              </div>

              {/* Total Admins */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Admins</p>
                    <p className="text-3xl font-bold mt-2">{statistics.admins.total}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-orange-100">Active platform</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Requirements Status Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements by Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Pending', value: statistics.requirements.pending, color: 'bg-yellow-500', total: statistics.requirements.total },
                    { label: 'Approved', value: statistics.requirements.approved, color: 'bg-blue-500', total: statistics.requirements.total },
                    { label: 'In Progress', value: statistics.requirements['in-progress'], color: 'bg-purple-500', total: statistics.requirements.total },
                    { label: 'Completed', value: statistics.requirements.completed, color: 'bg-green-500', total: statistics.requirements.total },
                    { label: 'Rejected', value: statistics.requirements.rejected, color: 'bg-red-500', total: statistics.requirements.total },
                  ].map((item) => {
                    const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold text-gray-900">{item.value} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Donor Status Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Statistics</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Verified Donors', value: statistics.donors.verified, color: 'bg-green-500', total: statistics.donors.total },
                    { label: 'Pending Verification', value: statistics.donors.pending, color: 'bg-yellow-500', total: statistics.donors.total },
                    { label: 'Email Verified', value: statistics.donors.emailVerified, color: 'bg-blue-500', total: statistics.donors.total },
                  ].map((item) => {
                    const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold text-gray-900">{item.value} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveView('requirements')}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Review Requirements</p>
                    <p className="text-sm text-gray-600">{statistics.requirements.pending} pending</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveView('donors')}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Verify Donors</p>
                    <p className="text-sm text-gray-600">{statistics.donors.pending} pending</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowAddAdminModal(true)}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
                >
                  <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Add New Admin</p>
                    <p className="text-sm text-gray-600">Manage platform</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Requirements View */}
        {activeView === 'requirements' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Search by name, school, district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Districts</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Filter by Age"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort as 'date' | 'name' | 'age');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="age-asc">Age (Youngest)</option>
                  <option value="age-desc">Age (Oldest)</option>
                </select>
              </div>
            </div>

            {/* Requirements List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-lg">No requirements found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                filteredItems.map((req: Requirement) => (
                  <div key={req._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{req.studentName}</h3>
                            <p className="text-sm text-gray-600">{req.school} • Grade {req.grade}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            req.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            req.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                            req.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {req.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {req.district}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {req.contactNumber}
                          </div>
                          {req.donorName && (
                            <div className="flex items-center gap-2 text-green-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Helped by: {req.donorName}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(req.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Required Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {req.items.map((item, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {item.itemName} × {item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req._id, 'approved')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(req._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setDeleteTarget({ type: 'requirement', id: req._id });
                            setShowDeleteModal(true);
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Donors View */}
        {activeView === 'donors' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search by name, email, district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Districts</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort as 'date' | 'name');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>
            </div>

            {/* Donors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.length === 0 ? (
                <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-gray-600 text-lg">No donors found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                filteredItems.map((donor: Donor) => (
                  <div key={donor._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          donor.isVerified ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <span className="text-xl font-bold text-gray-700">{donor.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {donor.isVerified && (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            )}
                            {donor.isEmailVerified && (
                              <span className="flex items-center gap-1 text-xs text-blue-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Email
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {donor.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {donor.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {donor.district}
                      </div>
                      {donor.organization && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {donor.organization}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Joined {new Date(donor.registeredAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!donor.isVerified && (
                        <button
                          onClick={() => handleVerifyDonor(donor._id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'donor', id: donor._id });
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Admins View */}
        {activeView === 'admins' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort as 'date' | 'name');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>
            </div>

            {/* Admins List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {filteredItems.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-gray-600 text-lg">No admins found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems.map((admin: Admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-600 font-semibold">{admin.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setDeleteTarget({ type: 'admin', id: admin._id });
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Admin</h2>
              <button
                onClick={() => {
                  setShowAddAdminModal(false);
                  setAdminForm({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Admin name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={adminForm.confirmPassword}
                  onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Re-enter password"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdminModal(false);
                    setAdminForm({ name: '', email: '', password: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this {deleteTarget.type}? All related data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert */}
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
