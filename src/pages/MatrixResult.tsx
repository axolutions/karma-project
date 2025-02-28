
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserData, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { Printer, LogOut, RefreshCw } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const email = getCurrentUser();
    if (!email) {
      navigate('/');
      return;
    }
    
    const data = getUserData(email);
    if (!data) {
      toast({
        title: "Perfil não encontrado",
        description: "Por favor, complete seu perfil primeiro.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    setUserData(data);
  }, [navigate]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso."
    });
    navigate('/');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast({
      title: "Atualizando",
      description: "Recarregando sua Matriz Kármica..."
    });
    
    // Simular um pequeno delay e então recarregar
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-karmic-700">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12 print:bg-white print:py-0">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-karmic-800">
              Matriz Kármica Pessoal 2025
            </h1>
            <p className="text-karmic-600">
              Olá, <span className="font-medium">{userData.name}</span>
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="karmic-button-outline flex items-center"
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button 
              onClick={handlePrint}
              className="karmic-button flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir / PDF
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="karmic-button-outline flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 print:mb-5"
        >
          <h2 className="text-xl md:text-2xl font-serif font-medium text-karmic-800 mb-2">
            Sua Matriz Kármica
          </h2>
          <p className="text-karmic-600 mb-6 print:mb-3">
            Data de Nascimento: <span className="font-medium">{userData.birthDate}</span>
          </p>
          
          <KarmicMatrix karmicData={userData.karmicNumbers} />
        </motion.div>
        
        <MatrixInterpretations karmicData={userData.karmicNumbers} />
      </div>
    </div>
  );
};

export default MatrixResult;
