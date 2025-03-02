
import React from 'react';
import { motion } from 'framer-motion';

const IntroSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-karmic-800 mb-4">
        EXPLORADOR DA MATRIZ KÁRMICA
      </h1>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-karmic-800 mb-6">
          Descubra sua jornada espiritual através dos números
        </h2>
        
        <p className="text-lg text-karmic-700 mb-4">
          A matriz kármica revela os padrões energéticos que influenciam sua vida atual,
          baseados em experiências de vidas passadas e potenciais futuros. Descubra os
          oito elementos principais que moldam sua jornada espiritual.
        </p>
      </div>
      
      <div className="my-8 border-t border-karmic-200 w-24 mx-auto"></div>
    </motion.div>
  );
};

export default IntroSection;
