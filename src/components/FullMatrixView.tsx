
import React from 'react';
import { renderHTML } from '@/lib/textContent';
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { motion } from 'framer-motion';

interface FullMatrixViewProps {
  karmicData: {
    spiritualMark: number;
    destinyCall: number;
    karmaPortal: number;
    karmicInheritance: number;
  };
  contentData: {
    spiritualMark: string;
    destinyCall: string;
    karmaPortal: string;
    karmicInheritance: string;
  };
  birthDate: string;
  onBack: () => void;
}

const FullMatrixView: React.FC<FullMatrixViewProps> = ({ 
  karmicData, 
  contentData, 
  birthDate, 
  onBack 
}) => {
  const handlePrint = () => {
    window.print();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="karmic-button-outline flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button 
          onClick={handlePrint} 
          className="karmic-button flex items-center"
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimir / Salvar PDF
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="print:block"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-karmic-800 mb-2">
            Matriz Kármica Completa
          </h1>
          <p className="text-karmic-600">
            Data de Nascimento: <span className="font-medium">{birthDate}</span>
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8 mb-10">
          <motion.div variants={itemVariants} className="karmic-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-medium text-karmic-800">Marca Espiritual</h2>
              <span className="karmic-number">{karmicData.spiritualMark}</span>
            </div>
            <div 
              className="karmic-content" 
              dangerouslySetInnerHTML={renderHTML(contentData.spiritualMark)} 
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="karmic-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-medium text-karmic-800">Chamado do Destino</h2>
              <span className="karmic-number">{karmicData.destinyCall}</span>
            </div>
            <div 
              className="karmic-content" 
              dangerouslySetInnerHTML={renderHTML(contentData.destinyCall)} 
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="karmic-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-medium text-karmic-800">Portal do Karma</h2>
              <span className="karmic-number">{karmicData.karmaPortal}</span>
            </div>
            <div 
              className="karmic-content" 
              dangerouslySetInnerHTML={renderHTML(contentData.karmaPortal)} 
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="karmic-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-medium text-karmic-800">Herança Kármica</h2>
              <span className="karmic-number">{karmicData.karmicInheritance}</span>
            </div>
            <div 
              className="karmic-content" 
              dangerouslySetInnerHTML={renderHTML(contentData.karmicInheritance)} 
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FullMatrixView;
