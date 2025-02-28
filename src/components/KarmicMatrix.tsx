
import React, { useState, useEffect } from 'react';
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
  // Positions configuradas como percentuais da imagem
  // As posições são: [top, left] para cada ponto do selo kármico
  const positionConfig = {
    topLeft: [15, 25],        // 3 da esquerda (topo)
    topRight: [15, 75],       // 1 da direita (topo)
    middleLeft: [46, 21],     // meio esquerda (inalterado)
    middleRight: [47, 72],    // meio direita (inalterado)
    bottomLeft: [85, 25],     // 11 da esquerda (baixo)
    bottomMiddle: [74, 48],   // meio inferior (inalterado)
    bottomRight: [85, 75],    // 3 da direita (baixo)
    topMiddle: [20, 47]       // meio superior (inalterado)
  };

  // Converte a configuração para o formato usado nos elementos
  const boxPositions = [
    { top: `${positionConfig.topLeft[0]}%`, left: `${positionConfig.topLeft[1]}%`, translateX: '-50%', translateY: '-50%' },       // 3 da esquerda
    { top: `${positionConfig.topRight[0]}%`, left: `${positionConfig.topRight[1]}%`, translateX: '-50%', translateY: '-50%' },     // 1 da direita
    { top: `${positionConfig.middleLeft[0]}%`, left: `${positionConfig.middleLeft[1]}%`, translateX: '-50%', translateY: '-50%' }, // meio esquerda
    { top: `${positionConfig.middleRight[0]}%`, left: `${positionConfig.middleRight[1]}%`, translateX: '-50%', translateY: '-50%' }, // meio direita
    { top: `${positionConfig.bottomLeft[0]}%`, left: `${positionConfig.bottomLeft[1]}%`, translateX: '-50%', translateY: '-50%' },  // 11 da esquerda
    { top: `${positionConfig.bottomMiddle[0]}%`, left: `${positionConfig.bottomMiddle[1]}%`, translateX: '-50%', translateY: '-50%' }, // meio inferior
    { top: `${positionConfig.bottomRight[0]}%`, left: `${positionConfig.bottomRight[1]}%`, translateX: '-50%', translateY: '-50%' }, // 3 da direita
    { top: `${positionConfig.topMiddle[0]}%`, left: `${positionConfig.topMiddle[1]}%`, translateX: '-50%', translateY: '-50%' }    // meio superior
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

  // Tamanho dos círculos ajustado para garantir que caibam nos quadrados
  const circleSize = "w-14 h-14"; // Tamanho ligeiramente menor

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
            <span className={`bg-white bg-opacity-80 rounded-full ${circleSize} flex items-center justify-center text-2xl font-serif font-bold text-karmic-800 shadow-lg`}>
              {item.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KarmicMatrix;
