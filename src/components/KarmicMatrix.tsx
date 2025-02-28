
import React from 'react';
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
  };
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  // Vamos listar explicitamente as posições para cada número específico
  // Isso elimina a confusão sobre qual número vai para qual posição
  const numberPositions = {
    // Para valor específico 11 (karmicSeal) - NÃO MUDAR
    karmicSeal: { top: "23%", left: "25%" },
    
    // Para valor específico 3 (destinyCall) - NÃO MUDAR
    destinyCall: { top: "13%", left: "85%" },
    
    // Para valor específico 9 (karmaPortal) - NÃO MUDAR
    karmaPortal: { top: "47%", left: "21%" },
    
    // Para valor específico 4 (karmicInheritance) - NÃO MUDAR
    karmicInheritance: { top: "47%", left: "72%" },
    
    // Para valor específico 3 (karmicReprogramming) - NÃO MUDAR
    karmicReprogramming: { top: "70%", left: "25%" },
    
    // Para valor específico 9 (cycleProphecy) - NÃO MUDAR
    cycleProphecy: { top: "74%", left: "48%" },
    
    // Para valor específico 1 (spiritualMark) - REPOSICIONADO PARA FORA DA ESTRELA CENTRAL
    spiritualMark: { top: "30%", left: "65%" },
    
    // Para valor específico 11 (manifestationEnigma) - NÃO MUDAR
    manifestationEnigma: { top: "20%", left: "47%" }
  };

  // Verifica cada número e imprime no console para depuração
  console.log("karmicSeal:", karmicData.karmicSeal);
  console.log("destinyCall:", karmicData.destinyCall);
  console.log("karmaPortal:", karmicData.karmaPortal);
  console.log("karmicInheritance:", karmicData.karmicInheritance);
  console.log("karmicReprogramming:", karmicData.karmicReprogramming);
  console.log("cycleProphecy:", karmicData.cycleProphecy);
  console.log("spiritualMark:", karmicData.spiritualMark);
  console.log("manifestationEnigma:", karmicData.manifestationEnigma);

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
        src={backgroundImage} 
        alt="Matriz Kármica 2025" 
        className="w-full h-auto"
      />
      
      {/* Numbers overlay - agora usando posições específicas para cada número */}
      {numbersToDisplay.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="absolute"
          style={{ 
            top: numberPositions[item.key].top, 
            left: numberPositions[item.key].left,
            transform: "translate(-50%, -50%)"
          }}
        >
          <div className="flex items-center justify-center">
            <span className="bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-lg">
              {item.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KarmicMatrix;
