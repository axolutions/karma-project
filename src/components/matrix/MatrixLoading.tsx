
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface MatrixLoadingProps {
  message: string;
}

const MatrixLoading: React.FC<MatrixLoadingProps> = ({ message }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white flex items-center justify-center">
      <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-karmic-200">
        <p className="text-karmic-700 mb-3">{message}</p>
        <div className="w-8 h-8 border-t-2 border-karmic-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
        <Button 
          onClick={() => navigate('/')}
          variant="link" 
          className="mt-4 text-karmic-500"
        >
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default MatrixLoading;
