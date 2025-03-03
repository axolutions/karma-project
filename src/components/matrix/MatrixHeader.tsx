
import React from 'react';
import { motion } from 'framer-motion';

interface MatrixHeaderProps {
  userData: any;
  createdDate: string;
}

const MatrixHeader: React.FC<MatrixHeaderProps> = ({ userData, createdDate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10 print:mb-5"
    >
      <h2 className="text-xl md:text-2xl font-serif font-medium text-karmic-800 mb-2">
        Sua Matriz Kármica
      </h2>
      <p className="text-karmic-600 mb-2 print:mb-1">
        Data de Nascimento: <span className="font-medium">{userData.birthDate}</span>
      </p>
      {createdDate && (
        <p className="text-karmic-500 text-xs mb-6 print:mb-3">
          Matriz gerada em: {createdDate}
        </p>
      )}
    </motion.div>
  );
};

export default MatrixHeader;
