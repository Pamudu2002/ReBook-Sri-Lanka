'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('contactPageTitle')}</h1>
        <div className="max-w-2xl">
          <p className="text-lg text-gray-600 mb-8">
            {t('contactPageContent')}
          </p>
          
          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-600">support@rebooksrilanka.lk</p>
                <p className="text-gray-600">info@rebooksrilanka.lk</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-600">+94 11 234 5678</p>
                <p className="text-sm text-gray-500 mt-1">Mon - Fri, 9am to 5pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
