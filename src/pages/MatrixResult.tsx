
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserData, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { LogOut, RefreshCw, Download, FileText, Image } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { isInOfflineMode } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingPNG, setDownloadingPNG] = useState(false);
  const matrixRef = useRef<HTMLDivElement>(null);
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
  
  // Função para baixar apenas as interpretações em PDF
  const handleDownloadInterpretations = async () => {
    try {
      setDownloadingPDF(true);
      toast({
        title: "Preparando download",
        description: "Gerando PDF das suas interpretações...",
      });
      
      // Selecionar apenas o contêiner de interpretações
      const interpretationsElement = document.querySelector('.matrix-interpretations');
      if (!interpretationsElement) {
        throw new Error("Não foi possível encontrar as interpretações");
      }
      
      // Expandir todas as interpretações antes de capturar
      const headers = interpretationsElement.querySelectorAll('.karmic-card');
      headers.forEach(header => {
        const headerElement = header.querySelector('h3');
        if (headerElement) {
          headerElement.click();
        }
      });
      
      // Pequeno delay para garantir que todas as seções estejam expandidas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Configurações do PDF
      const pdfOptions = {
        margin: [10, 10, 10, 10],
        filename: `Interpretacoes-Matriz-Karmica-${userData?.name || 'Pessoal'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Gerar o PDF
      await html2pdf().from(interpretationsElement).set(pdfOptions).save()
        .then(() => {
          toast({
            title: "Download concluído",
            description: "Suas interpretações foram baixadas em PDF com sucesso!",
          });
        });
      
    } catch (error) {
      console.error("Erro ao gerar download das interpretações:", error);
      toast({
        title: "Erro ao gerar download",
        description: "Não foi possível baixar as interpretações. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setDownloadingPDF(false);
    }
  };
  
  // Função para baixar a matriz como PNG
  const handleDownloadMatrixAsPNG = async () => {
    try {
      setDownloadingPNG(true);
      toast({
        title: "Preparando download",
        description: "Gerando imagem da sua matriz...",
      });
      
      if (!matrixRef.current) {
        throw new Error("Não foi possível encontrar a matriz");
      }
      
      const canvas = await html2canvas(matrixRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        onclone: (document) => {
          // Certifique-se de que a imagem tenha tempo para carregar no clone
          const img = document.querySelector('.karmic-matrix-with-image img') as HTMLImageElement;
          if (img && !img.complete) {
            return new Promise((resolve) => {
              img.onload = resolve;
            });
          }
        }
      });
      
      // Converter para PNG e fazer download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Matriz-Karmica-${userData?.name || 'Pessoal'}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Download concluído",
        description: "Sua Matriz Kármica foi baixada como imagem PNG com sucesso!",
      });
      
    } catch (error) {
      console.error("Erro ao gerar imagem da matriz:", error);
      toast({
        title: "Erro ao gerar imagem",
        description: "Não foi possível baixar a matriz como imagem. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setDownloadingPNG(false);
    }
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:hidden">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-karmic-800">
              Matriz Kármica Pessoal 2025
            </h1>
            <p className="text-karmic-600">
              Olá, <span className="font-medium">{userData?.name || "Visitante"}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
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
              onClick={handleDownloadMatrixAsPNG}
              className="karmic-button flex items-center"
              disabled={downloadingPNG}
            >
              <Image className="mr-2 h-4 w-4" />
              {downloadingPNG ? 'Gerando imagem...' : 'Baixar Matriz em PNG'}
            </Button>
            
            <Button 
              onClick={handleDownloadInterpretations}
              variant="outline"
              className="karmic-button flex items-center"
              disabled={downloadingPDF}
            >
              <FileText className="mr-2 h-4 w-4" />
              {downloadingPDF ? 'Gerando PDF...' : 'Baixar Interpretações em PDF'}
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
          
          <div className="karmic-matrix-container" ref={matrixRef}>
            <KarmicMatrix karmicData={userData?.karmicNumbers} />
          </div>
        </motion.div>
        
        <div className="matrix-interpretations">
          <MatrixInterpretations karmicData={userData?.karmicNumbers} />
        </div>
      </div>
    </div>
  );
};

export default MatrixResult;
