'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            {t('heroSubtitle')}
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link
              href="/submissions"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Browse Requirements
            </Link>
            <Link
              href="/student/submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              {t('studentCTA')}
            </Link>
            <Link
              href="/donor/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              {t('donorCTA')}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('aboutTitle')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('aboutDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Students Submit</h3>
              <p className="text-gray-600">
                Students or guardians submit their stationery requirements without needing to register
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Admin Reviews</h3>
              <p className="text-gray-600">
                Our team verifies and approves legitimate requirements to prevent misuse
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Donors Help</h3>
              <p className="text-gray-600">
                Verified donors view requirements and commit to helping students in need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">{t('appName')}</p>
          <p className="text-gray-400">{t('appTagline')}</p>
          <p className="text-gray-500 mt-4">© 2025 ReBook Sri Lanka. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
