
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
  
  // Imagem local como fallback
  const fallbackImage = "/placeholder.svg";
  
  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    
    const img = new Image();
    
    img.onload = () => {
      console.log("✓ Imagem da matriz carregada com sucesso!");
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      console.error("✗ Erro ao carregar a imagem da matriz.");
      setHasError(true);
    };
    
    img.crossOrigin = "anonymous"; // Permitir carregamento cross-origin
    img.src = backgroundImage;
    
    // Adicionar imagem na página para pré-carregamento
    img.style.display = 'none';
    document.body.appendChild(img);
    
    // Fallback se a imagem não carregar em 5 segundos
    const timeout = setTimeout(() => {
      if (!imageLoaded) {
        console.warn("⚠️ Timeout ao carregar imagem da matriz.");
        setHasError(true);
      }
    }, 5000);
    
    return () => {
      clearTimeout(timeout);
      document.body.removeChild(img);
    };
  }, [backgroundImage, imageLoaded]);
  
  // Posições para cada número específico
  const numberPositions = {
    karmicSeal: { top: "23%", left: "25%" },
    destinyCall: { top: "72%", left: "73%" },
    karmaPortal: { top: "47%", left: "21%" },
    karmicInheritance: { top: "47%", left: "72%" },
    karmicReprogramming: { top: "70%", left: "25%" },
    cycleProphecy: { top: "74%", left: "48%" },
    spiritualMark: { top: "25%", left: "70%" },
    manifestationEnigma: { top: "20%", left: "47%" }
  };

  const renderMatrixBackground = () => {
    return (
      <div 
        className="w-full h-auto relative rounded-lg overflow-hidden"
        style={{ 
          minHeight: "400px",
          backgroundColor: 'transparent',
          border: '1px solid #EAE6E1',
          borderRadius: '8px',
        }}
      >
        <img 
          src={hasError ? fallbackImage : backgroundImage} 
          alt="Matriz Kármica 2025"
          className="w-full h-auto object-contain"
          style={{ maxHeight: '100%', opacity: imageLoaded || hasError ? 1 : 0.5 }}
          onLoad={() => {
            console.log("✓ Imagem da matriz exibida com sucesso");
            setImageLoaded(true);
          }}
          onError={() => {
            console.error("✗ Erro ao exibir imagem da matriz");
            setHasError(true);
          }}
          crossOrigin="anonymous" // Importante para o html2canvas capturar a imagem
        />
        
        {/* Spinner durante carregamento */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center download-hidden">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-karmic-800"></div>
          </div>
        )}
        
        {/* Mensagem de erro se a imagem falhar - NÃO SERÁ MOSTRADA NO PNG */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-50 bg-opacity-80 print:hidden download-hidden">
            <p className="text-karmic-800 font-medium mb-2">Imagem indisponível</p>
            <p className="text-karmic-600 text-sm">Usando modelo temporário</p>
          </div>
        )}
      </div>
    );
  };

  // Se karmicData for undefined, mostramos apenas a imagem de fundo
  if (!karmicData) {
    return (
      <div className="relative max-w-4xl mx-auto karmic-matrix-wrapper">
        {renderMatrixBackground()}
        <div className="text-center mt-4 text-karmic-600 download-hidden">
          Dados da matriz não disponíveis. Por favor, verifique seu perfil.
        </div>
      </div>
    );
  }

  // Mapeamento para usar os valores diretamente
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
    <div className="relative max-w-4xl mx-auto karmic-matrix-wrapper">
      {/* Background matrix image */}
      {renderMatrixBackground()}
      
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
            transform: "translate(-50%, -50%)"
          }}
        >
          <div className="flex items-center justify-center">
            <span className="bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-lg print:shadow-none print:border print:border-karmic-300">
              {item.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KarmicMatrix;
