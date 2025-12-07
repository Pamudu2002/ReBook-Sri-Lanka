'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022')",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 py-32 pt-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">{t('empoweringEducation')}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-16">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{t('verifiedStudents')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{t('transparentProcess')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{t('securePlatform')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="text-xs font-medium">{t('scrollToExplore')}</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Browse Requirements Card */}
              <Link href="/submissions" className="group">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-600 hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('browseRequirementsCard')}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {t('browseRequirementsCardDesc')}
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    {t('learnMore')}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Student Submit Card */}
              <Link href="/student/submit" className="group">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-600 hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                    <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('studentSubmitCard')}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {t('studentSubmitCardDesc')}
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    {t('submitNow')}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Donor Register Card */}
              <Link href="/donor/register" className="group">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-600 hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                    <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('donorRegisterCard')}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {t('donorRegisterCardDesc')}
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    {t('getStarted')}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-16 bg-white relative z-10">
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
              {t('howItWorks')}
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
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 text-center">{t('studentsSubmit')}</h3>
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                  {t('studentsSubmitDesc')}
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
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 text-center">{t('adminReviews')}</h3>
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                  {t('adminReviewsDesc')}
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
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 text-center">{t('donorsHelp')}</h3>
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                  {t('donorsHelpDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 md:mb-12">
              {t('makingDifference')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">25</div>
                <p className="text-sm md:text-base text-blue-100">{t('districtsCovered')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
                <p className="text-sm md:text-base text-blue-100">{t('transparentProcess')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <p className="text-sm md:text-base text-blue-100">{t('supportAvailable')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
