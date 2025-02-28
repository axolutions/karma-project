
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
  
  // Usamos uma imagem local como fallback em caso de erro
  const fallbackImage = "/placeholder.svg";
  
  // Pré-carrega a imagem para garantir que ela esteja disponível para impressão
  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    
    const loadImage = () => {
      const img = new Image();
      
      img.onload = () => {
        console.log("✓ Imagem da matriz carregada com sucesso!");
        setImageLoaded(true);
        setHasError(false);
      };
      
      img.onerror = () => {
        console.error("✗ Erro ao carregar a imagem da matriz. Tentativa com URL direta.");
        setHasError(true);
      };
      
      // Força carregamento via proxy CORS para tentar contornar problemas
      img.src = backgroundImage;
      img.crossOrigin = "anonymous";
    };
    
    // Tenta carregar a imagem
    loadImage();
    
    // Fallback se a imagem não carregar em 5 segundos
    const timeout = setTimeout(() => {
      if (!imageLoaded) {
        console.warn("⚠️ Timeout ao carregar imagem da matriz.");
        setHasError(true);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [backgroundImage]);
  
  // Vamos listar explicitamente as posições para cada número específico
  const numberPositions = {
    // Para valor específico 11 (karmicSeal) - NÃO MUDAR
    karmicSeal: { top: "23%", left: "25%" },
    
    // Para valor específico 3 (destinyCall) - REPOSICIONADO MAIS PARA CIMA E UM POUCO PARA A ESQUERDA
    destinyCall: { top: "72%", left: "73%" },
    
    // Para valor específico 9 (karmaPortal) - NÃO MUDAR
    karmaPortal: { top: "47%", left: "21%" },
    
    // Para valor específico 4 (karmicInheritance) - NÃO MUDAR
    karmicInheritance: { top: "47%", left: "72%" },
    
    // Para valor específico 3 (karmicReprogramming) - NÃO MUDAR
    karmicReprogramming: { top: "70%", left: "25%" },
    
    // Para valor específico 9 (cycleProphecy) - NÃO MUDAR
    cycleProphecy: { top: "74%", left: "48%" },
    
    // Para valor específico 1 (spiritualMark) - NÃO MUDAR
    spiritualMark: { top: "25%", left: "70%" },
    
    // Para valor específico 11 (manifestationEnigma) - NÃO MUDAR
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
        {/* Sempre mostra a imagem, mesmo durante carregamento */}
        <img 
          src={hasError ? fallbackImage : backgroundImage} 
          alt="Matriz Kármica 2025"
          crossOrigin="anonymous"
          className={`w-full h-auto ${!imageLoaded && !hasError ? 'opacity-30' : 'opacity-100'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.error("✗ Erro ao exibir imagem da matriz");
            setHasError(true);
          }}
        />
        
        {/* Spinner durante carregamento */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-karmic-800"></div>
          </div>
        )}
        
        {/* Mensagem de erro se a imagem falhar */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-50 bg-opacity-80">
            <p className="text-karmic-800 font-medium mb-2">Imagem da matriz indisponível</p>
            <p className="text-karmic-600 text-sm">Usando modelo temporário</p>
          </div>
        )}
      </div>
    );
  };

  // Se karmicData for undefined, mostramos apenas a imagem de fundo
  if (!karmicData) {
    return (
      <div className="relative max-w-4xl mx-auto">
        {renderMatrixBackground()}
        <div className="text-center mt-4 text-karmic-600">
          Dados da matriz não disponíveis. Por favor, verifique seu perfil.
        </div>
      </div>
    );
  }

  // Simplificamos o mapeamento para usar os valores diretamente
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
      {/* Background matrix image */}
      {renderMatrixBackground()}
      
      {/* Numbers overlay - só mostra se a imagem carregou ou há um erro */}
      {(imageLoaded || hasError) && numbersToDisplay.map((item, index) => (
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
