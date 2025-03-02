
import React from 'react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '@/lib/auth';

const IntroSection: React.FC = () => {
  // Get current user email if logged in
  const currentUserEmail = getCurrentUser();
  
  return (
    <motion.div 
      className="max-w-3xl mx-auto text-center mb-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.span 
        className="inline-block px-4 py-1 mb-4 text-xs font-medium text-karmic-700 bg-karmic-100 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        EXPLORADOR DA MATRIZ KÁRMICA
      </motion.span>
      
      {currentUserEmail && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <span className="text-sm text-karmic-600 bg-karmic-50 px-3 py-1.5 rounded-md border border-karmic-200">
            E-mail de compra: <strong>{currentUserEmail}</strong>
          </span>
        </motion.div>
      )}
      
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-karmic-800 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Descubra sua jornada espiritual através dos números
      </motion.h1>
      
      <motion.p 
        className="text-lg text-karmic-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        A matriz kármica revela os padrões energéticos que influenciam sua vida atual, baseados em 
        experiências de vidas passadas e potenciais futuros. Descubra os quatro elementos principais 
        que moldam sua jornada espiritual.
      </motion.p>
      
      <motion.div 
        className="border-b border-karmic-200 w-24 mx-auto mb-8"
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </motion.div>
  );
};

export default IntroSection;
