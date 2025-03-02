
import { toast } from "@/components/ui/use-toast";
import { generateInterpretationsHTML } from '@/lib/interpretations';
import html2canvas from 'html2canvas';
import { isAuthorizedEmail } from '@/lib/auth';

export const downloadMatrixAsPNG = (matrixRef: React.RefObject<HTMLDivElement>, userName: string) => {
  if (!matrixRef.current) {
    toast({
      title: "Erro ao exportar",
      description: "Não foi possível encontrar a matriz para exportar.",
      variant: "destructive"
    });
    return;
  }
  
  toast({
    title: "Processando imagem",
    description: "Preparando sua matriz para download..."
  });
  
  const scale = 2; // Increase quality
  
  html2canvas(matrixRef.current, {
    scale: scale,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false
  }).then(canvas => {
    // Convert to PNG and download
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    
    // Create filename
    const fileName = `Matriz-Karmica-${userName?.replace(/\s+/g, '-') || 'Usuario'}.png`;
    
    link.download = fileName;
    link.href = imgData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download concluído",
      description: "Sua matriz kármica foi salva como imagem PNG."
    });
  }).catch(error => {
    console.error('Erro ao gerar imagem:', error);
    toast({
      title: "Erro ao exportar",
      description: "Ocorreu um problema ao gerar a imagem da matriz.",
      variant: "destructive"
    });
  });
};

export const downloadInterpretationsAsHTML = (karmicNumbers: any, userName: string) => {
  if (!karmicNumbers) {
    toast({
      title: "Erro ao gerar arquivo",
      description: "Não foi possível encontrar seus dados kármicos.",
      variant: "destructive"
    });
    return;
  }
  
  try {
    toast({
      title: "Gerando arquivo",
      description: "Preparando suas interpretações para download..."
    });
    
    // Gerar HTML com as interpretações
    const htmlContent = generateInterpretationsHTML(karmicNumbers);
    
    // Criar um Blob com o conteúdo HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Criar um link de download
    const fileName = `Interpretacoes-Karmicas-${userName?.replace(/\s+/g, '-') || 'Usuario'}.html`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    
    // Disparar o download
    a.click();
    
    // Limpar recursos
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "Download concluído",
      description: "Arquivo HTML gerado com suas interpretações. Você pode abri-lo em qualquer navegador."
    });
  } catch (error) {
    console.error("Erro ao preparar arquivo para download:", error);
    
    toast({
      title: "Erro ao gerar arquivo",
      description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
      variant: "destructive"
    });
  }
};

export const checkIfCanCreateNewMap = (email: string, mapCount: number): boolean => {
  // Here we check if the user can create a new map
  if (mapCount > 0 && !isAuthorizedEmail(email)) {
    // Simple check: if they already have maps, they can't create more
    return false;
  } else {
    return true;
  }
};
