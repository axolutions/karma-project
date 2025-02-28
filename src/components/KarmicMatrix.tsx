
import React, { useEffect, useState } from 'react';
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
  };
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(backgroundImage);
  
  // Verificar se temos dados kármicos válidos
  const hasValidData = karmicData && 
    typeof karmicData === 'object' && 
    Object.keys(karmicData).length > 0;
  
  // Se não tivermos dados válidos, exibir uma mensagem de erro
  if (!hasValidData) {
    console.error("Dados kármicos inválidos ou ausentes", karmicData);
    return (
      <div className="relative max-w-4xl mx-auto p-8 bg-red-50 border border-red-200 rounded-md text-center">
        <p className="text-red-500 font-medium">Erro ao carregar os dados da matriz kármica</p>
        <p className="text-sm text-red-400 mt-2">Tente atualizar a página ou entre em contato com o suporte</p>
      </div>
    );
  }
  
  // Pré-carrega a imagem para garantir que ela esteja disponível para impressão
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Fallback para uma imagem local se a externa falhar
      console.error("Erro ao carregar a imagem da matriz. Usando fallback.");
      setImgSrc("/placeholder.svg");
    };
    img.src = backgroundImage;
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
        src={imgSrc} 
        alt="Matriz Kármica 2025" 
        className="w-full h-auto"
        onLoad={() => setImageLoaded(true)}
        style={{ 
          // Adiciona um contorno para caso a imagem não seja visível no PDF
          border: '1px solid #EAE6E1',
          borderRadius: '8px'
        }}
      />
      
      {/* Numbers overlay */}
      {imageLoaded && numbersToDisplay.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="absolute print:!opacity-100"
          style={{ 
            top: numberPositions[item.key].top, 
            left: numberPositions[item.key].left,
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
