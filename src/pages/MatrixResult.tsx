import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserData, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { LogOut, RefreshCw, FileText } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { supabaseClient, isInOfflineMode } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
        
        // Small delay to ensure everything loads correctly
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
  
  // Function to download just interpretations as PDF
  const handleDownloadInterpretations = async () => {
    try {
      setSending(true);
      toast({
        title: "Preparando PDF",
        description: "Aguarde enquanto geramos o PDF das interpretações..."
      });
      
      // Expand all interpretation cards first to capture their content
      const cards = document.querySelectorAll('.karmic-card');
      cards.forEach((card) => {
        const toggleButton = card.querySelector('.interpretation-toggle');
        const content = card.querySelector('.interpretation-content');
        
        if (content && content.classList.contains('hidden')) {
          // If content is hidden, click the toggle to expand it
          (toggleButton as HTMLElement)?.click();
        }
      });
      
      // Wait for the cards to expand
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add title and user info
      pdf.setFontSize(18);
      pdf.text("Matriz Kármica Pessoal 2025", 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Nome: ${userData?.name || 'Cliente'}`, 20, 30);
      pdf.text(`Data de Nascimento: ${userData?.birthDate || 'Não informada'}`, 20, 38);
      
      // Get the interpretations container
      const interpretationsContainer = document.querySelector('.matrix-interpretations');
      if (!interpretationsContainer) {
        throw new Error("Não foi possível encontrar o conteúdo das interpretações");
      }
      
      // Capture each card individually to handle them better in the PDF
      const interpretationCards = document.querySelectorAll('.karmic-card');
      let currentY = 50; // Start position after the header
      
      for (let i = 0; i < interpretationCards.length; i++) {
        try {
          const card = interpretationCards[i] as HTMLElement;
          
          // If we're not on the first card, check if we need a new page
          if (i > 0) {
            if (currentY > 250) { // Add new page if close to bottom
              pdf.addPage();
              currentY = 20; // Reset Y position on new page
            } else {
              currentY += 10; // Add spacing between cards
            }
          }
          
          // Capture the title section
          const titleSection = card.querySelector('.flex.items-center') as HTMLElement;
          const title = titleSection?.querySelector('h3')?.textContent || `Interpretação ${i+1}`;
          
          // Add title
          pdf.setFontSize(14);
          pdf.text(title, 20, currentY);
          currentY += 8;
          
          // Capture the content section (which should be visible now)
          const contentSection = card.querySelector('.interpretation-content > div') as HTMLElement;
          if (contentSection) {
            // Use html2canvas to capture content with proper formatting
            const canvas = await html2canvas(contentSection, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#fff8e1', // Light amber background to match the theme
            });
            
            // Add the captured content to PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgWidth = 170; // Width of the image in the PDF
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 20, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 5;
            
            // If content is too big and goes off-page, add a page break
            if (currentY > 270) {
              pdf.addPage();
              currentY = 20;
            }
          }
        } catch (cardError) {
          console.error(`Erro ao processar cartão ${i}:`, cardError);
          // Continue to next card if one fails
        }
      }
      
      // Save the PDF
      pdf.save(`Matriz_Karmica_${userData?.name || 'Pessoal'}.pdf`);
      
      // Collapse cards back if needed
      cards.forEach((card) => {
        const toggleButton = card.querySelector('.interpretation-toggle');
        const content = card.querySelector('.interpretation-content');
        
        // Keep only the first one expanded
        if (content && !content.classList.contains('hidden') && card !== cards[0]) {
          // If content is visible, click the toggle to collapse it
          (toggleButton as HTMLElement)?.click();
        }
      });
      
      toast({
        title: "PDF gerado com sucesso",
        description: "Seu arquivo PDF com as interpretações da matriz foi baixado."
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
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
    
    // Simulate a small delay and then reload
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
              onClick={handleDownloadInterpretations}
              variant="outline"
              className="karmic-button-outline flex items-center"
              disabled={sending}
            >
              <FileText className="mr-2 h-4 w-4" />
              {sending ? "Gerando PDF..." : "Baixar Interpretação"}
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
          
          <div className="karmic-matrix-container relative">
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
