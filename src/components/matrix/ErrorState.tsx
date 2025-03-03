
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const ErrorState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white flex items-center justify-center">
      <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-karmic-200">
        <p className="text-karmic-700 mb-3">Não foi possível carregar os dados da matriz. Por favor, tente novamente.</p>
        <Button 
          onClick={() => navigate('/')}
          variant="default" 
          className="mt-4 karmic-button"
        >
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
