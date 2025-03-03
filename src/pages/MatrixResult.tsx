
import React, { useState, useEffect } from 'react';
import { getUserData, isLoggedIn } from '../lib/auth';
import { getCurrentMatrixId } from '../lib/db';
import UserHeader from '../components/matrix/UserHeader';
import KarmicMatrix from '../components/KarmicMatrix';
import MatrixInterpretations from '../components/MatrixInterpretations';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from '../components/matrix/LoadingState';
import ErrorState from '../components/matrix/ErrorState';

const MatrixResult: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareLink, setShowShareLink] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadUserData = () => {
      try {
        if (!isLoggedIn()) {
          setError('Sessão expirada. Por favor, faça login novamente.');
          setLoading(false);
          return;
        }
        
        const email = localStorage.getItem('userEmail');
        if (!email) {
          setError('Dados de usuário não encontrados.');
          setLoading(false);
          return;
        }
        
        const data = getUserData(email);
        if (!data) {
          setError('Dados de usuário não encontrados.');
          setLoading(false);
          return;
        }
        
        // Verificar se tem matrix ID
        const matrixId = getCurrentMatrixId(email);
        if (!matrixId) {
          setError('Matriz Kármica não encontrada para este usuário.');
          setLoading(false);
          return;
        }
        
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        setError('Erro ao carregar dados. Por favor, recarregue a página.');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleShareLink = () => {
    setShowShareLink(!showShareLink);
    
    // Se estiver abrindo o link, copia para a área de transferência
    if (!showShareLink) {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(
        () => {
          toast({
            title: "Link copiado!",
            description: "O link da sua matriz foi copiado para a área de transferência.",
          });
        },
        (err) => {
          console.error('Erro ao copiar link:', err);
          toast({
            title: "Erro ao copiar",
            description: "Não foi possível copiar o link automaticamente.",
            variant: "destructive"
          });
        }
      );
    }
  };
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <UserHeader userData={userData} />
      
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleShareLink} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar Matriz
        </Button>
      </div>
      
      {showShareLink && (
        <div className="mb-6 p-4 border rounded-md bg-karmic-50 text-karmic-800">
          <p className="font-medium">Use este link para acessar sua matriz:</p>
          <p className="mt-2 text-sm bg-white p-2 rounded border select-all overflow-x-auto">
            {window.location.href}
          </p>
          <p className="mt-2 text-xs">
            Este link contém sua matriz atual. Você pode compartilhá-lo ou salvá-lo para acessar posteriormente.
          </p>
        </div>
      )}
      
      <KarmicMatrix userData={userData} />
      <MatrixInterpretations userData={userData} />
    </div>
  );
};

export default MatrixResult;
