
import React, { useEffect, useState } from 'react';
import { getInterpretation, renderHTML } from '@/lib/interpretations';
import { motion } from 'framer-motion';

interface KarmicMatrixProps {
  karmicData: {
    karmicSeal: number;
    destinyCall: number;
    karmaPortal: number;
    karmicInheritance: number;
    karmicReprogramming: number;
    cycleProphecy: number;
    spiritualMark: number;
    manifestationEnigma: number;
  } | undefined;
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeImage, setActiveImage] = useState(backgroundImage);
  
  // Local fallback images - usando a imagem enviada pelo usuário como principal fallback
  const userProvidedFallback = "/lovable-uploads/bc3594b2-13d4-4e7f-b1ce-0650cc3d8bc8.png"; // Nova imagem enviada
  const uploadedFallbackImage = "/lovable-uploads/f6b1f486-1d12-46d1-965d-ea69190f56e7.png";
  const additionalFallback = "/lovable-uploads/e5125d57-cbc7-4202-b746-eb90da348d92.png";
  const finalFallbackImage = "/lovable-uploads/e3827c66-0547-4aea-8e5d-403dd2ac4af2.png"; 
  
  useEffect(() => {
    // Reset states when component mounts or backgroundImage changes
    setImageLoaded(false);
    setHasError(false);
    setActiveImage(backgroundImage);
    
    console.log("Tentando carregar imagem da matriz:", backgroundImage);
    
    const img = new Image();
    
    img.onload = () => {
      console.log("✓ Matrix image loaded successfully:", backgroundImage);
      setImageLoaded(true);
      setActiveImage(backgroundImage);
    };
    
    img.onerror = () => {
      console.error("✗ Error loading matrix image:", backgroundImage);
      setHasError(true);
      // Tentar o primeiro fallback imediatamente
      tryFallbackImage(userProvidedFallback);
    };
    
    // Try to load the image directly
    img.src = backgroundImage;
    
    // Fallback if image doesn't load in 3 seconds
    const timeout = setTimeout(() => {
      if (!imageLoaded) {
        console.warn("⚠️ Timeout loading matrix image. Using fallback.");
        setHasError(true);
        tryFallbackImage(userProvidedFallback);
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [backgroundImage]);
  
  // Função para tentar carregar imagens de fallback em cascata
  const tryFallbackImage = (fallbackSrc: string) => {
    console.log("Tentando carregar fallback:", fallbackSrc);
    
    const fallbackImg = new Image();
    fallbackImg.onload = () => {
      console.log("✓ Fallback image loaded successfully:", fallbackSrc);
      setActiveImage(fallbackSrc);
      setImageLoaded(true);
    };
    
    fallbackImg.onerror = () => {
      console.error("✗ Fallback image failed to load:", fallbackSrc);
      
      // Cascata de fallbacks
      if (fallbackSrc === userProvidedFallback) {
        tryFallbackImage(uploadedFallbackImage);
      } else if (fallbackSrc === uploadedFallbackImage) {
        tryFallbackImage(additionalFallback);
      } else if (fallbackSrc === additionalFallback) {
        tryFallbackImage(finalFallbackImage);
      } else {
        console.error("✗ All fallback images failed to load");
        // Usar um último recurso - uma cor de fundo em último caso
        setImageLoaded(true);
      }
    };
    
    fallbackImg.src = fallbackSrc;
  };
  
  // Accurate positions for each specific number
  const numberPositions = {
    karmicSeal: { top: "22%", left: "26%" },
    destinyCall: { top: "72%", left: "73%" },
    karmaPortal: { top: "47%", left: "21%" },
    karmicInheritance: { top: "47%", left: "77%" },
    karmicReprogramming: { top: "72%", left: "26%" },
    cycleProphecy: { top: "75%", left: "50%" },
    spiritualMark: { top: "22%", left: "73%" },
    manifestationEnigma: { top: "20%", left: "50%" }
  };

  // Matrix background rendering with improved fallback strategy
  const renderBackground = () => {
    return (
      <div className="relative w-full h-full" style={{ minHeight: "500px" }}>
        <img 
          src={activeImage} 
          alt="Karmic Matrix 2025"
          className="w-full h-auto transition-opacity duration-300"
          style={{ maxWidth: '100%' }}
          onLoad={() => console.log("✓ Matrix image rendered successfully:", activeImage)}
          onError={() => {
            console.error("✗ Error rendering matrix image in DOM:", activeImage);
            // Fallback já foi tratado no useEffect, então aqui apenas mostramos a mensagem
          }}
        />
        {hasError && (
          <div className="absolute bottom-0 left-0 right-0 bg-amber-50 bg-opacity-80 p-2 text-center text-sm text-karmic-800">
            Usando imagem alternativa
          </div>
        )}
      </div>
    );
  };

  // If karmicData is undefined, show only background image
  if (!karmicData) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div 
          className="w-full h-auto relative rounded-lg overflow-hidden"
          style={{ 
            minHeight: "400px",
            backgroundColor: '#EFDED0',
            border: '1px solid #D5C7B8',
            borderRadius: '8px',
            boxShadow: 'inset 0 0 20px rgba(180, 160, 140, 0.1)'
          }}
        >
          {renderBackground()}
          
          {/* Loading spinner */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-karmic-800"></div>
            </div>
          )}
        </div>
        <div className="text-center mt-4 text-karmic-600">
          Dados da matriz não disponíveis. Por favor, verifique seu perfil.
        </div>
      </div>
    );
  }

  // Map to use values directly
  const numbersToDisplay = [
    { key: 'karmicSeal', value: karmicData.karmicSeal, title: "Selo Kármico 2025" },
    { key: 'destinyCall', value: karmicData.destinyCall, title: "Chamado do Destino 2025" },
    { key: 'karmaPortal', value: karmicData.karmaPortal, title: "Portal do Karma 2025" },
    { key: 'karmicInheritance', value: karmicData.karmicInheritance, title: "Herança Kármica 2025" },
    { key: 'karmicReprogramming', value: karmicData.karmicReprogramming, title: "Códex da Reprogramação 2025" },
    { key: 'cycleProphecy', value: karmicData.cycleProphecy, title: "Profecia dos Ciclos 2025" },
    { key: 'spiritualMark', value: karmicData.spiritualMark, title: "Marca Espiritual 2025" },
    { key: 'manifestationEnigma', value: karmicData.manifestationEnigma, title: "Enigma da Manifestação 2025" }
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Background matrix container */}
      <div 
        className="w-full h-auto relative rounded-lg overflow-hidden"
        style={{ 
          minHeight: "400px",
          backgroundColor: '#EFDED0',
          border: '1px solid #D5C7B8',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 20px rgba(180, 160, 140, 0.1)'
        }}
      >
        {renderBackground()}
        
        {/* Loading spinner */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-karmic-800"></div>
          </div>
        )}
      </div>
      
      {/* Numbers overlay */}
      {numbersToDisplay.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="absolute print:!opacity-100"
          style={{ 
            top: numberPositions[item.key as keyof typeof numberPositions].top, 
            left: numberPositions[item.key as keyof typeof numberPositions].left,
            transform: "translate(-50%, -50%)",
            zIndex: 10
          }}
        >
          <div className="flex items-center justify-center">
            <span className="bg-white bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-sm border border-amber-100 print:shadow-none print:border print:border-karmic-300">
              {item.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KarmicMatrix;
