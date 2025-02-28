
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserData, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { LogOut, RefreshCw, Mail, Download } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { supabaseClient, isInOfflineMode } from '@/lib/supabase';
import html2canvas from 'html2canvas';

// Constante para controlar se devemos usar o modo de fallback para email
const USE_EMAIL_FALLBACK = true;

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
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
  
  // Função para gerar e baixar um arquivo PDF ou imagem PNG da matriz
  const handleDownloadMatrix = async () => {
    try {
      setSending(true);
      
      // Capturar a matriz como imagem
      const matrixElement = document.querySelector('.karmic-matrix-container');
      if (!matrixElement) {
        throw new Error("Não foi possível encontrar a matriz para baixar");
      }
      
      const canvas = await html2canvas(matrixElement as HTMLElement, {
        scale: 2, // Melhor qualidade
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      // Criar um link de download para a imagem
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Matriz-Karmica-${userData?.name || 'Pessoal'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download concluído",
        description: "Sua Matriz Kármica foi baixada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao gerar download:", error);
      toast({
        title: "Erro ao gerar download",
        description: "Não foi possível baixar a matriz. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };
  
  const handleSendEmail = async () => {
    if (!userData || !userData.email) {
      toast({
        title: "Email não disponível",
        description: "Não foi possível encontrar seu email. Por favor, verifique seu perfil.",
        variant: "destructive"
      });
      return;
    }
    
    setSending(true);
    
    try {
      // Capturar a matriz como imagem
      const matrixElement = document.querySelector('.karmic-matrix-container');
      if (!matrixElement) {
        throw new Error("Não foi possível encontrar a matriz para enviar");
      }
      
      const canvas = await html2canvas(matrixElement as HTMLElement, {
        scale: 2, // Melhor qualidade
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      const matrixImageData = canvas.toDataURL('image/png');
      
      // Preparar os dados da interpretação
      const interpretationsElement = document.querySelector('.matrix-interpretations');
      let interpretationsText = '';
      
      if (interpretationsElement) {
        const titles = interpretationsElement.querySelectorAll('h3');
        const contents = interpretationsElement.querySelectorAll('p');
        
        titles.forEach((title, index) => {
          if (contents[index]) {
            interpretationsText += `${title.textContent}\n${contents[index].textContent}\n\n`;
          }
        });
      }
      
      // Verificar se estamos em modo offline ou se o uso de fallback está ativado
      if (isInOfflineMode() || USE_EMAIL_FALLBACK) {
        console.log("Usando método de fallback para envio de email");
        handleEmailFallback(userData.email, matrixImageData);
        return;
      }
      
      // Chamar função do Supabase para enviar o email
      const { data, error } = await supabaseClient.functions.invoke('send-matrix-email', {
        body: {
          to: userData.email,
          name: userData.name || "Cliente",
          birthDate: userData.birthDate,
          matrixImage: matrixImageData,
          interpretations: interpretationsText
        }
      });
      
      if (error) {
        console.error("Erro ao invocar função de email:", error);
        // Se falhar com o Supabase, usar o fallback
        handleEmailFallback(userData.email, matrixImageData);
        return;
      }
      
      toast({
        title: "Email enviado",
        description: `Sua Matriz Kármica foi enviada para ${userData.email}`,
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      // Se ocorrer qualquer erro, tenta o método de fallback
      if (userData && userData.email) {
        handleEmailFallback(userData.email, "");
      } else {
        toast({
          title: "Erro ao enviar email",
          description: "Não foi possível enviar o email. Por favor, tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    } finally {
      setSending(false);
    }
  };
  
  // Método de fallback para quando o Supabase não funciona
  const handleEmailFallback = (email: string, imageData: string) => {
    try {
      // Oferecer download direto como alternativa
      if (imageData) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `Matriz-Karmica-${userData?.name || 'Pessoal'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Download disponível",
        description: "Não foi possível enviar o email. Sua matriz foi baixada diretamente no seu dispositivo.",
      });
    } catch (fallbackError) {
      console.error("Erro no método fallback:", fallbackError);
      toast({
        title: "Erro ao processar",
        description: "Não foi possível enviar por email nem baixar a matriz. Tente o botão de download diretamente.",
        variant: "destructive"
      });
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
              onClick={handleDownloadMatrix}
              variant="outline"
              className="karmic-button-outline flex items-center"
              disabled={sending}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Matriz
            </Button>
            
            <Button 
              onClick={handleSendEmail}
              className="karmic-button flex items-center"
              disabled={sending}
            >
              <Mail className="mr-2 h-4 w-4" />
              {sending ? 'Processando...' : 'Enviar por Email'}
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
          
          <div className="karmic-matrix-container">
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
