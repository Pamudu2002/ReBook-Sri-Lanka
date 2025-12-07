'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gray-900 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-slate-50/10 z-10 translate-y-[1px]"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070')",
            }}
          ></div>
          {/* Animated Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-blue-100 text-sm font-medium tracking-wide uppercase">{t('appName')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            {t('aboutPageTitle')}
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            {t('aboutPageContent')}
          </p>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24 -mt-24 relative z-30">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-7xl mx-auto">
          {/* Mission Card */}
          <div className="group bg-white p-8 md:p-12 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 h-full flex flex-col">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">{t('ourMission')}</h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg flex-grow">
              {t('ourMissionDesc')}
            </p>
          </div>

          {/* Vision Card */}
          <div className="group bg-white p-8 md:p-12 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 h-full flex flex-col">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">{t('ourVision')}</h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg flex-grow">
              {t('ourVisionDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-white py-16 md:py-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-32 z-0"></div>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
               <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 aspect-[4/3] group">
                  <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500"></div>
                  <img 
                    src="/about-problem.png" 
                    alt="Students studying in a classroom" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
               </div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3 block">{t('theProblem')}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">{t('heroTitle')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 text-justify md:text-left">
                {t('theProblemDesc')}
              </p>
              <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
             <span className="text-purple-600 font-bold tracking-wider uppercase text-sm mb-2 block">{t('howItWorks')}</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">{t('howPlatformWorks')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('whatWeDoDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -z-10 rounded-full"></div>

            {/* Step 1 */}
            <div className="group relative flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 z-10 border-4 border-blue-50 group-hover:border-blue-100 group-hover:scale-105">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-blue-700">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('howStep1')}</h3>
              <p className="text-gray-600 leading-relaxed px-4">{t('howStep1Desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="group relative flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 z-10 border-4 border-purple-50 group-hover:border-purple-100 group-hover:scale-105">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-purple-700">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('howStep2')}</h3>
              <p className="text-gray-600 leading-relaxed px-4">{t('howStep2Desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="group relative flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 z-10 border-4 border-green-50 group-hover:border-green-100 group-hover:scale-105">
                 <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-700">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('howStep3')}</h3>
              <p className="text-gray-600 leading-relaxed px-4">{t('howStep3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-900 py-24 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">{t('ourValues')}</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300 h-full">
              <h3 className="text-xl font-bold text-blue-400 mb-4">{t('transparency')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">{t('transparencyDesc')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300 h-full">
              <h3 className="text-xl font-bold text-purple-400 mb-4">{t('compassion')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">{t('compassionDesc')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300 h-full">
              <h3 className="text-xl font-bold text-green-400 mb-4">{t('integrity')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">{t('integrityDesc')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300 h-full">
              <h3 className="text-xl font-bold text-orange-400 mb-4">{t('community')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">{t('communityDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 py-24 max-w-5xl text-center">
        <div className="group relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.5rem] p-12 md:p-20 overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">{t('contactUsCta')}</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
              {t('contactUsCtaDesc')}
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-full transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transform hover:-translate-y-1"
            >
              {t('contactButton')}
              <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
