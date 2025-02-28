
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
  const [imgSrc, setImgSrc] = useState(backgroundImage);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Pré-carrega a imagem para garantir que ela esteja disponível para impressão
  // Sem dependências para evitar re-renders
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log("Imagem da matriz carregada com sucesso:", backgroundImage);
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Erro ao carregar a imagem da matriz. Usando fallback.");
      setImgSrc("/placeholder.svg");
      setImageLoaded(true); // Mesmo com erro, continuamos
    };
    img.src = backgroundImage;
    
    // Cleanup para evitar memory leaks
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []); // Remove backgroundImage das dependências para evitar loops
  
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
      {/* Mostrar indicador de carregamento enquanto a imagem carrega */}
      {!imageLoaded && (
        <div className="animate-pulse bg-karmic-100 w-full h-80 rounded-lg flex items-center justify-center">
          <p className="text-karmic-600">Carregando matriz...</p>
        </div>
      )}
      
      {/* Background matrix image - importante manter as propriedades mesmo quando não estiver visível */}
      <img 
        ref={imgRef}
        src={imgSrc} 
        alt="Matriz Kármica 2025" 
        className="w-full h-auto"
        style={{ 
          visibility: imageLoaded ? 'visible' : 'hidden',
          border: '1px solid #EAE6E1',
          borderRadius: '8px'
        }}
        onLoad={() => {
          console.log("Imagem carregada via evento onLoad");
          setImageLoaded(true);
        }}
        onError={() => {
          console.error("Erro ao carregar imagem via evento onError");
          setImgSrc("/placeholder.svg");
          setImageLoaded(true);
        }}
      />
      
      {/* Numbers overlay - só mostrar quando a imagem estiver carregada */}
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
