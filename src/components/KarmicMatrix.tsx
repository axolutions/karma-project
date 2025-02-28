
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
  // Coordenadas específicas para cada posição
  const positions = [
    // Posição 0 - 3 da esquerda (topo)
    { top: "23%", left: "25%" },
    
    // Posição 1 - 1 da direita (topo)
    { top: "13%", left: "85%" },
    
    // Posição 2 - meio esquerda (ajustado para subir bastante)
    { top: "30%", left: "21%" },
    
    // Posição 3 - meio direita
    { top: "47%", left: "72%" },
    
    // Posição 4 - 11 da esquerda (baixo)
    { top: "89%", left: "25%" },
    
    // Posição 5 - meio inferior
    { top: "74%", left: "48%" },
    
    // Posição 6 - 3 da direita (baixo)
    { top: "87%", left: "85%" },
    
    // Posição 7 - meio superior
    { top: "20%", left: "47%" }
  ];

  // Map data to positions
  const mappedData = [
    { 
      position: 0,
      key: 'karmicSeal',
      value: karmicData.karmicSeal,
      title: "Selo Kármico 2025"
    },
    { 
      position: 1,
      key: 'destinyCall',
      value: karmicData.destinyCall,
      title: "Chamado do Destino 2025"
    },
    { 
      position: 2,
      key: 'karmaPortal',
      value: karmicData.karmaPortal,
      title: "Portal do Karma 2025"
    },
    { 
      position: 3,
      key: 'karmicInheritance',
      value: karmicData.karmicInheritance,
      title: "Herança Kármica 2025"
    },
    { 
      position: 4,
      key: 'karmicReprogramming',
      value: karmicData.karmicReprogramming,
      title: "Códex da Reprogramação 2025"
    },
    { 
      position: 5,
      key: 'cycleProphecy',
      value: karmicData.cycleProphecy,
      title: "Profecia dos Ciclos 2025"
    },
    { 
      position: 6,
      key: 'spiritualMark',
      value: karmicData.spiritualMark,
      title: "Marca Espiritual 2025"
    },
    { 
      position: 7,
      key: 'manifestationEnigma',
      value: karmicData.manifestationEnigma,
      title: "Enigma da Manifestação 2025"
    }
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Background matrix image */}
      <img 
        src={backgroundImage} 
        alt="Matriz Kármica 2025" 
        className="w-full h-auto"
      />
      
      {/* Numbers overlay */}
      {mappedData.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="absolute"
          style={{ 
            top: positions[item.position].top, 
            left: positions[item.position].left,
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
