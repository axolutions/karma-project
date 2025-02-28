
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KarmicMatrixProps {
  karmicData: any;
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  const [imgSrc, setImgSrc] = useState(backgroundImage);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  console.log("KarmicMatrix: Dados recebidos:", karmicData);
  
  // Criar dados kármicos seguros (garantindo valores padrão para campos ausentes)
  const safeKarmicData = {
    karmicSeal: karmicData?.karmicSeal || 0,
    destinyCall: karmicData?.destinyCall || 0,
    karmaPortal: karmicData?.karmaPortal || 0,
    karmicInheritance: karmicData?.karmicInheritance || 0,
    karmicReprogramming: karmicData?.karmicReprogramming || 0,
    cycleProphecy: karmicData?.cycleProphecy || 0,
    spiritualMark: karmicData?.spiritualMark || 0,
    manifestationEnigma: karmicData?.manifestationEnigma || 0
  };
  
  console.log("KarmicMatrix: Dados seguros:", safeKarmicData);
  
  // Pré-carrega a imagem para garantir que ela esteja disponível
  useEffect(() => {
    // Resetar o estado ao trocar a imagem
    setIsImageLoaded(false);
    setImageError(false);
    
    const img = new Image();
    img.onload = () => {
      console.log("KarmicMatrix: Imagem carregada com sucesso");
      setIsImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      console.error("KarmicMatrix: Erro ao carregar imagem. Usando imagem local.");
      setImageError(true);
      // Usar a imagem enviada pelo usuário como fallback
      setImgSrc("/lovable-uploads/03adb121-9666-444c-aa4b-0d3f89e5562d.png");
    };
    img.src = backgroundImage;
    
    // Se após 5 segundos a imagem não carregar, usar fallback
    const timeoutId = setTimeout(() => {
      if (!isImageLoaded) {
        console.warn("KarmicMatrix: Timeout ao carregar imagem. Usando fallback.");
        setImageError(true);
        setImgSrc("/lovable-uploads/03adb121-9666-444c-aa4b-0d3f89e5562d.png");
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [backgroundImage]);
  
  // Vamos listar explicitamente as posições para cada número específico
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

  // Simplificamos o mapeamento para usar os valores diretamente
  const numbersToDisplay = [
    { key: 'karmicSeal', value: safeKarmicData.karmicSeal, title: "Selo Kármico 2025" },
    { key: 'destinyCall', value: safeKarmicData.destinyCall, title: "Chamado do Destino 2025" },
    { key: 'karmaPortal', value: safeKarmicData.karmaPortal, title: "Portal do Karma 2025" },
    { key: 'karmicInheritance', value: safeKarmicData.karmicInheritance, title: "Herança Kármica 2025" },
    { key: 'karmicReprogramming', value: safeKarmicData.karmicReprogramming, title: "Códex da Reprogramação 2025" },
    { key: 'cycleProphecy', value: safeKarmicData.cycleProphecy, title: "Profecia dos Ciclos 2025" },
    { key: 'spiritualMark', value: safeKarmicData.spiritualMark, title: "Marca Espiritual 2025" },
    { key: 'manifestationEnigma', value: safeKarmicData.manifestationEnigma, title: "Enigma da Manifestação 2025" }
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Mensagem de carregamento se necessário */}
      {!isImageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karmic-700 mx-auto mb-2"></div>
            <p className="text-karmic-700">Carregando imagem da matriz...</p>
          </div>
        </div>
      )}
      
      {/* Background matrix image */}
      <img 
        src={imgSrc} 
        alt="Matriz Kármica 2025" 
        className="w-full h-auto"
        style={{ 
          border: '1px solid #EAE6E1',
          borderRadius: '8px',
          minHeight: '300px' // Altura mínima para evitar colapso enquanto carrega
        }}
        onLoad={() => setIsImageLoaded(true)}
        onError={() => {
          console.error("KarmicMatrix: Erro ao carregar imagem na tag. Usando fallback.");
          setImageError(true);
          setImgSrc("/lovable-uploads/03adb121-9666-444c-aa4b-0d3f89e5562d.png");
        }}
      />
      
      {/* Números da matriz */}
      {numbersToDisplay.map((item) => {
        const position = numberPositions[item.key];
        return (
          <div
            key={item.key}
            className="absolute print:!opacity-100"
            style={{ 
              top: position.top, 
              left: position.left,
              transform: "translate(-50%, -50%)"
            }}
          >
            <div className="flex items-center justify-center">
              <span className="bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-lg print:shadow-none print:border print:border-karmic-300">
                {item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KarmicMatrix;
