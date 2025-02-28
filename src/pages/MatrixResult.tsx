
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserData, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { Printer, LogOut, RefreshCw, Download } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const email = getCurrentUser();
        
        if (!email) {
          toast({
            title: "Sessão expirada",
            description: "Por favor, faça login novamente.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        const data = getUserData(email);
        
        if (!data || !data.karmicNumbers) {
          toast({
            title: "Perfil incompleto",
            description: "Por favor, complete seu perfil com uma data de nascimento válida.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        // Pequeno delay para garantir que tudo seja carregado corretamente
        setTimeout(() => {
          setUserData(data);
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Houve um problema ao carregar seus dados. Por favor, tente novamente.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  // Detecta quando a impressão é concluída ou cancelada
  useEffect(() => {
    if (isPrinting) {
      // Adicionar evento para quando o modal de impressão for fechado
      const handleAfterPrint = () => {
        setIsPrinting(false);
        console.log("Impressão concluída ou cancelada");
      };
      
      window.addEventListener('afterprint', handleAfterPrint);
      
      return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [isPrinting]);
  
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Garantir que todos os estilos e imagens sejam carregados antes de imprimir
    setTimeout(() => {
      try {
        // Adiciona a classe específica para modo de impressão
        document.body.classList.add('printing-mode');
        
        // Usar o método de impressão nativo do navegador
        window.print();
        
        // Remove a classe após um tempo
        setTimeout(() => {
          document.body.classList.remove('printing-mode');
        }, 1000);
        
        // Em alguns navegadores, o evento afterprint pode não ser disparado
        // Então definimos um timeout de segurança
        setTimeout(() => {
          if (isPrinting) {
            setIsPrinting(false);
          }
        }, 5000);
      } catch (error) {
        console.error("Erro ao imprimir:", error);
        setIsPrinting(false);
        toast({
          title: "Erro ao imprimir",
          description: "Houve um problema ao gerar o PDF. Tente novamente.",
          variant: "destructive"
        });
      }
    }, 500); // Aumentado o delay para garantir carregamento completo
  };
  
  // Função alternativa para quem tem problemas com a impressão direta
  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Use a opção 'Salvar como PDF' na janela de impressão que irá abrir."
    });
    
    setIsPrinting(true);
    
    // Preparação mais completa para exportação PDF
    setTimeout(() => {
      try {
        // Adiciona a classe específica para modo de impressão
        document.body.classList.add('printing-mode');
        
        // Em navegadores modernos, isso deve abrir diretamente a opção de salvar como PDF
        const printResult = window.print();
        
        // Alguns navegadores retornam false se a impressão foi cancelada
        if (printResult === false) {
          setTimeout(() => setIsPrinting(false), 1000);
        }
        
        // Remove a classe após um tempo
        setTimeout(() => {
          document.body.classList.remove('printing-mode');
        }, 1000);
        
        // Garantir que o estado de impressão seja redefinido depois de um tempo
        setTimeout(() => {
          if (isPrinting) {
            setIsPrinting(false);
          }
        }, 6000);
      } catch (error) {
        console.error("Erro ao exportar PDF:", error);
        setIsPrinting(false);
        toast({
          title: "Erro ao exportar",
          description: "Houve um problema ao exportar o PDF. Tente imprimir normalmente e escolha 'Salvar como PDF'.",
          variant: "destructive"
        });
      }
    }, 800); // Delay maior para garantir que tudo esteja carregado
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-karmic-100 to-white">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-karmic-600 animate-spin mx-auto mb-4" />
          <p className="text-karmic-700 text-lg">Carregando sua Matriz Kármica...</p>
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
              Olá, <span className="font-medium">{userData?.name || "Visitante"}</span>
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
              onClick={handleExportPDF}
              className="karmic-button flex items-center"
              disabled={isPrinting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isPrinting ? 'Salvando...' : 'Exportar PDF'}
            </Button>
            
            <Button 
              onClick={handlePrint}
              className="karmic-button flex items-center"
              disabled={isPrinting}
            >
              <Printer className={`mr-2 h-4 w-4 ${isPrinting ? 'animate-spin' : ''}`} />
              {isPrinting ? 'Gerando PDF...' : 'Imprimir'}
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
            Data de Nascimento: <span className="font-medium">{userData?.birthDate || "Não informada"}</span>
          </p>
          
          <KarmicMatrix karmicData={userData?.karmicNumbers} />
        </motion.div>
        
        <MatrixInterpretations karmicData={userData?.karmicNumbers} />
      </div>
    </div>
  );
};

export default MatrixResult;
