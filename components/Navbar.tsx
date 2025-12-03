'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/lib/translations';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'si', label: 'සිංහල' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900">{t('appName')}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Language Switcher */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                      language === lang.code
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Menu Button for Desktop */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="Open menu"
              >
                <span className="font-medium text-sm">Menu</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop Blur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center px-4 h-20 border-b bg-primary-600 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold">{t('appName')}</span>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Language Switcher */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Language</h3>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      language === lang.code
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              {user ? (
                <>
                  <Link
                    href="/"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {t('homeLink')}
                  </Link>
                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard'}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/admin/dashboard' || pathname === '/donor/dashboard'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {t('dashboard')}
                  </Link>
                  <Link
                    href="/submissions"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/submissions'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t('browseLink')}
                  </Link>
                  <Link
                    href="/map"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/map'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {t('districtMapLink')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeSidebar();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {t('homeLink')}
                  </Link>
                  <Link
                    href="/submissions"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/submissions'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t('browseLink')}
                  </Link>
                  <Link
                    href="/map"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/map'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {t('districtMapLink')}
                  </Link>
                  <Link
                    href="/student/submit"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/student/submit'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('studentForm')}
                  </Link>
                  <Link
                    href="/donor/login"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/donor/login'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {t('donorLogin')}
                  </Link>
                  <Link
                    href="/donor/register"
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === '/donor/register'
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {t('donorRegister')}
                  </Link>
                </>
              )}
            </div>

            {/* User Info (if logged in) */}
            {user && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-1">{t('loggedInAs')}</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
