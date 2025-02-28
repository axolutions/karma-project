
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
  // Define positions of the 8 boxes on the matrix image
  const boxPositions = [
    { top: '17%', left: '50%', translateX: '-50%', translateY: '-50%' }, // Position 1 - center top
    { top: '17%', left: '50%', translateX: '-50%', translateY: '-50%' }, // Position 2 - center top
    { top: '17%', left: '80%', translateX: '-50%', translateY: '-50%' }, // Position 3 - right top
    { top: '50%', left: '20%', translateX: '-50%', translateY: '-50%' }, // Position 4 - left middle
    { top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }, // Position 5 - center middle
    { top: '50%', left: '80%', translateX: '-50%', translateY: '-50%' }, // Position 6 - right middle
    { top: '83%', left: '35%', translateX: '-50%', translateY: '-50%' }, // Position 7 - left bottom
    { top: '83%', left: '65%', translateX: '-50%', translateY: '-50%' }  // Position 8 - right bottom
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
            top: boxPositions[item.position].top, 
            left: boxPositions[item.position].left,
            transform: `translate(${boxPositions[item.position].translateX}, ${boxPositions[item.position].translateY})`
          }}
        >
          <div className="flex items-center justify-center">
            <span className="bg-white bg-opacity-80 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-serif font-bold text-karmic-800 shadow-lg">
              {item.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KarmicMatrix;
