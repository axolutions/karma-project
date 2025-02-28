
import React, { useEffect, useState, useRef } from 'react';
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
  backgroundImage = "/lovable-uploads/77a4e867-ec94-4db5-b2be-656d9131268e.png"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState('/placeholder.svg'); // Começamos com o placeholder
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Pré-carrega a imagem para garantir que ela esteja disponível
  useEffect(() => {
    // Função para precarregar a imagem de fundo
    const preloadImage = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        console.log("Imagem carregada com sucesso:", backgroundImage);
        setImgSrc(backgroundImage);
        setImageLoaded(true);
      };
      
      img.onerror = (e) => {
        console.error("Erro ao carregar a imagem da matriz:", e);
        setImgSrc('/placeholder.svg');
        setImageLoaded(true);
      };
      
      // Definimos um timeout para garantir que não ficamos presos esperando
      const timeoutId = setTimeout(() => {
        if (!imageLoaded) {
          console.warn("Timeout no carregamento da imagem, usando placeholder");
          setImgSrc('/placeholder.svg');
          setImageLoaded(true);
        }
      }, 5000);
      
      // Atribuímos a source no final para iniciar o carregamento
      img.src = backgroundImage;
      
      // Limpeza do timeout quando o componente for desmontado
      return () => clearTimeout(timeoutId);
    };
    
    preloadImage();
    
    // Limpeza quando o componente desmontar
    return () => {
      console.log("Componente KarmicMatrix desmontado");
    };
  }, [backgroundImage]); // Remova imageLoaded daqui para evitar loop infinito
  
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

  // Se karmicData for undefined, mostramos apenas a imagem de fundo
  if (!karmicData) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <img 
          ref={imgRef}
          src={imgSrc} 
          alt="Matriz Kármica 2025" 
          className="w-full h-auto"
          style={{ 
            border: '1px solid #EAE6E1',
            borderRadius: '8px'
          }}
        />
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
      <img 
        ref={imgRef}
        src={imgSrc} 
        alt="Matriz Kármica 2025" 
        className="w-full h-auto"
        style={{ 
          // Adiciona um contorno para caso a imagem não seja visível no PDF
          border: '1px solid #EAE6E1',
          borderRadius: '8px'
        }}
      />
      
      {/* Indicator if image is not loaded properly */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="text-karmic-600 text-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-karmic-600 rounded-full border-t-transparent mx-auto mb-2"></div>
            Carregando imagem...
          </div>
        </div>
      )}
      
      {/* Numbers overlay */}
      {imageLoaded && numbersToDisplay.map((item, index) => (
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
