
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserData, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { LogOut, RefreshCw, Mail } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const matrixRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Usamos o ID para forçar um recarregamento quando necessário
  const [matrixId, setMatrixId] = useState(Date.now());
  
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
          setEmail(data.email || '');
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
  
  const handleSendEmail = async () => {
    if (!email || !email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email válido para enviar o PDF.",
        variant: "destructive"
      });
      return;
    }
    
    if (!contentRef.current || !matrixRef.current) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Por favor, tente novamente.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    setDialogOpen(false);
    
    toast({
      title: "Preparando envio",
      description: "Gerando PDF para envio por email..."
    });
    
    try {
      // Captura a matriz kármica
      const matrixCanvas = await html2canvas(matrixRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Captura o conteúdo completo
      const contentCanvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Criar novo documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Adiciona cabeçalho
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Matriz Kármica Pessoal 2025", pageWidth / 2, 15, { align: "center" });
      
      // Adiciona nome e data de nascimento
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(`Nome: ${userData?.name || "Visitante"}`, 15, 25);
      pdf.text(`Data de Nascimento: ${userData?.birthDate || "Não informada"}`, 15, 32);
      
      // Adiciona a imagem da matriz
      const matrixImgData = matrixCanvas.toDataURL('image/png');
      const matrixImgWidth = pageWidth - 30; // Margens de 15mm de cada lado
      const matrixImgHeight = (matrixCanvas.height * matrixImgWidth) / matrixCanvas.width;
      pdf.addImage(matrixImgData, 'PNG', 15, 40, matrixImgWidth, matrixImgHeight);
      
      // Adiciona o conteúdo completo em novas páginas
      const contentImgData = contentCanvas.toDataURL('image/png');
      const contentImgWidth = pageWidth - 20; // Margens de 10mm de cada lado
      const contentImgHeight = (contentCanvas.height * contentImgWidth) / contentCanvas.width;
      
      // Calcula quantas páginas serão necessárias
      const contentPageCount = Math.ceil(contentImgHeight / (pageHeight - 20));
      
      // Adiciona o conteúdo em várias páginas, se necessário
      for (let i = 0; i < contentPageCount; i++) {
        // Somente adiciona nova página se não for a primeira parte
        if (i > 0) {
          pdf.addPage();
        } else {
          // Se for a primeira parte, adiciona um espaço após a matriz
          pdf.addPage();
        }
        
        // Altura da parte atual da imagem
        const sourceHeight = contentCanvas.height / contentPageCount;
        const destHeight = contentImgHeight / contentPageCount;
        
        // Usa apenas os parâmetros necessários
        pdf.addImage(
          contentImgData, // source
          'PNG', // format
          10, // x
          10, // y
          contentImgWidth, // width
          destHeight // height
        );
      }
      
      // Converte o PDF para base64
      const pdfData = pdf.output('datauristring');
      
      // Simula o envio de email (na vida real, isso seria um endpoint backend)
      console.log("Enviando PDF para email:", email);
      console.log("Dados do PDF:", pdfData.substring(0, 100) + "...");
      
      // Simulação de envio bem-sucedido (na implementação real, você usaria um endpoint de API)
      setTimeout(() => {
        toast({
          title: "Email enviado com sucesso!",
          description: `O PDF da Matriz Kármica foi enviado para ${email}`
        });
        setIsSending(false);
      }, 2000);
      
      // Na implementação real, você faria algo como:
      // const response = await fetch('/api/send-pdf', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, pdfData })
      // });
      //
      // if (!response.ok) throw new Error('Falha ao enviar email');
      
    } catch (error) {
      console.error("Erro ao gerar e enviar PDF:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Houve um problema ao gerar ou enviar o PDF. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSending(false);
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
    
    // Forçar recarregamento da matriz mudando seu ID para forçar re-renderização
    setMatrixId(Date.now());
    
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Atualizado",
        description: "Matriz Kármica recarregada com sucesso!"
      });
    }, 1000);
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
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="karmic-button flex items-center"
                  disabled={isSending}
                >
                  <Mail className={`mr-2 h-4 w-4 ${isSending ? 'animate-spin' : ''}`} />
                  {isSending ? 'Enviando...' : 'Enviar por Email'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Matriz Kármica por Email</DialogTitle>
                  <DialogDescription>
                    Insira o email para onde deseja receber o PDF da sua Matriz Kármica.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="seu@email.com" 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSendEmail} className="karmic-button">
                    Enviar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
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
        
        <div ref={contentRef}>
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
            
            <div ref={matrixRef} key={matrixId}>
              <KarmicMatrix karmicData={userData?.karmicNumbers} />
            </div>
          </motion.div>
          
          <MatrixInterpretations karmicData={userData?.karmicNumbers} />
        </div>
      </div>
    </div>
  );
};

export default MatrixResult;
