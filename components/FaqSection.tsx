'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const FaqItem = ({ 
  question, 
  answer, 
  isOpen, 
  onClick,
  index 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
  index: number;
}) => {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ 
        scale: 1.01,
        transition: { type: "spring" as const, stiffness: 400, damping: 25 }
      }}
      className="group"
    >
      <div className={`
        border rounded-xl mb-4 overflow-hidden bg-white
        transition-all duration-500 ease-out
        ${isOpen 
          ? 'border-blue-400 shadow-lg shadow-blue-100/50' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}>
        <button
          onClick={onClick}
          className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 rounded-xl transition-colors duration-300"
        >
          <motion.span 
            className={`text-lg font-semibold pr-8 transition-colors duration-300 ${isOpen ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'}`}
            layout
          >
            {question}
          </motion.span>
          <motion.span 
            className={`
              flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
              transition-all duration-500 ease-out
              ${isOpen 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200' 
                : 'bg-gray-100 group-hover:bg-blue-100'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg 
              className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </motion.svg>
          </motion.span>
        </button>
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.4,
                  },
                  opacity: {
                    duration: 0.25,
                    delay: 0.1,
                  },
                },
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.3,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              }}
            >
              <motion.div 
                className="px-6 pb-6"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15,
                  delay: 0.1 
                }}
              >
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-4" />
                <p className="text-gray-600 leading-relaxed text-base">
                  {answer}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Create FAQs using translations
  const faqs = [
    { question: t('faqQ1'), answer: t('faqA1') },
    { question: t('faqQ2'), answer: t('faqA2') },
    { question: t('faqQ3'), answer: t('faqA3') },
    { question: t('faqQ4'), answer: t('faqA4') },
    { question: t('faqQ5'), answer: t('faqA5') },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Animated header section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          <motion.span 
            className="inline-block text-blue-600 font-bold tracking-wider uppercase text-sm mb-3 px-4 py-1.5 bg-blue-50 rounded-full"
            variants={headerVariants}
          >
            {t('faqCommonQuestions')}
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight"
            variants={headerVariants}
          >
            {t('faqTitle')}
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            variants={headerVariants}
          >
            {t('faqSubtitle')}
          </motion.p>
        </motion.div>

        {/* Animated FAQ items container */}
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              index={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
