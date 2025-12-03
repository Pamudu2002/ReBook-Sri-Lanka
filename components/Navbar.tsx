'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/lib/translations';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'si', label: 'සිංහල' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <nav className="bg-primary-600 text-white shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold">{t('appName')}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Language Switcher */}
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1 rounded transition-colors text-sm ${
                      language === lang.code
                        ? 'bg-white text-primary-600 font-semibold'
                        : 'bg-primary-700 hover:bg-primary-500'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Navigation Links */}
              {user ? (
                <>
                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard'}
                    className="hover:text-primary-200 transition-colors"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/submissions"
                    className="hover:text-primary-200 transition-colors"
                  >
                    Browse Requirements
                  </Link>
                  <Link
                    href="/map"
                    className="hover:text-primary-200 transition-colors"
                  >
                    District Map
                  </Link>
                  <Link
                    href="/student/submit"
                    className="hover:text-primary-200 transition-colors"
                  >
                    {t('studentForm')}
                  </Link>
                  <Link
                    href="/donor/login"
                    className="hover:text-primary-200 transition-colors"
                  >
                    {t('donorLogin')}
                  </Link>
                  <Link
                    href="/admin/login"
                    className="bg-primary-700 hover:bg-primary-500 px-4 py-2 rounded transition-colors"
                  >
                    {t('adminLogin')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-700 transition-colors"
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
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-4 border-b bg-primary-600 text-white">
            <span className="text-xl font-bold">{t('appName')}</span>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
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
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Language</h3>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      language === lang.code
                        ? 'bg-primary-600 text-white'
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
                    href={user.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard'}
                    onClick={closeSidebar}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeSidebar();
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors font-medium"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/submissions"
                    onClick={closeSidebar}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  >
                    Browse Requirements
                  </Link>
                  <Link
                    href="/map"
                    onClick={closeSidebar}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  >
                    District Map
                  </Link>
                  <Link
                    href="/student/submit"
                    onClick={closeSidebar}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  >
                    {t('studentForm')}
                  </Link>
                  <Link
                    href="/donor/login"
                    onClick={closeSidebar}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  >
                    {t('donorLogin')}
                  </Link>
                  <Link
                    href="/donor/register"
                    onClick={closeSidebar}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                  >
                    {t('donorRegister')}
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={closeSidebar}
                    className="block px-4 py-3 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors font-medium"
                  >
                    {t('adminLogin')}
                  </Link>
                </>
              )}
            </div>

            {/* User Info (if logged in) */}
            {user && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-1">Logged in as</p>
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
