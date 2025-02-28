
import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-16 px-4">
      <span className="inline-block px-4 py-1 mb-4 text-xs font-medium text-karmic-700 bg-karmic-100 rounded-full">
        EXPLORADOR DA MATRIZ KÁRMICA
      </span>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-karmic-800 mb-6">
        Descubra sua jornada espiritual através dos números
      </h1>
      
      <p className="text-lg text-karmic-600 mb-8">
        A matriz kármica revela os padrões energéticos que influenciam sua vida atual, baseados em 
        experiências de vidas passadas e potenciais futuros. Descubra os quatro elementos principais 
        que moldam sua jornada espiritual.
      </p>
      
      <div className="border-b border-karmic-200 w-24 mx-auto mb-8" />
    </div>
  );
};

export default IntroSection;
