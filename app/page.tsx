'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-12 px-4">
              {t('heroSubtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
              <Link
                href="/submissions"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-lg text-base font-semibold transition-all shadow-sm hover:shadow-md"
              >
                Browse Requirements
              </Link>
              <Link
                href="/student/submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-lg text-base font-semibold transition-all shadow-sm hover:shadow-md"
              >
                {t('studentCTA')}
              </Link>
              <Link
                href="/donor/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-lg text-base font-semibold transition-all shadow-sm hover:shadow-md"
              >
                {t('donorCTA')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              {t('aboutTitle')}
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed px-4">
              {t('aboutDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  1
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 text-center">Students Submit</h3>
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                  Students or guardians submit their stationery requirements without needing to register
                </p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  2
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 text-center">Admin Reviews</h3>
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                  Our team verifies and approves legitimate requirements to prevent misuse
                </p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  3
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 text-center">Donors Help</h3>
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                  Verified donors view requirements and commit to helping students in need
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 md:mb-12">
              Making a Difference Together
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">25</div>
                <p className="text-sm md:text-base text-blue-100">Districts Covered</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
                <p className="text-sm md:text-base text-blue-100">Transparent Process</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <p className="text-sm md:text-base text-blue-100">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl font-semibold mb-2">{t('appName')}</p>
            <p className="text-sm md:text-base text-gray-400 mb-4">{t('appTagline')}</p>
            <p className="text-xs md:text-sm text-gray-500">© 2025 ReBook Sri Lanka. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
