'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('aboutPageTitle')}</h1>
        <div className="prose max-w-none text-gray-600">
          <p className="text-lg leading-relaxed">
            {t('aboutPageContent')}
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-3">{t('empoweringEducation')}</h3>
              <p>{t('heroSubtitle')}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-purple-900 mb-3">{t('transparentProcess')}</h3>
              <p>{t('adminReviewsDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
