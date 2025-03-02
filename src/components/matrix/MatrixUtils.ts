import { toast } from "@/components/ui/use-toast";
import { generateInterpretationsHTML } from '@/lib/interpretations';
import html2canvas from 'html2canvas';
import { isAuthorizedEmail, getRemainingMatrixCount } from '@/lib/auth';

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
    title: "Processando HTML",
    description: "Preparando sua matriz para download..."
  });
  
  try {
    // Obter a imagem de fundo e números da matriz
    const matrixElement = matrixRef.current;
    const imgElement = matrixElement.querySelector('img') as HTMLImageElement;
    const imgSrc = imgElement?.src || "";
    
    // Extrair os números da matriz
    const numberElements = matrixElement.querySelectorAll('.absolute');
    const numbers: {position: {top: string, left: string}, value: string}[] = [];
    
    numberElements.forEach(el => {
      const style = (el as HTMLElement).style;
      const numberSpan = el.querySelector('span');
      
      if (style && numberSpan) {
        numbers.push({
          position: {
            top: style.top,
            left: style.left
          },
          value: numberSpan.textContent || "0"
        });
      }
    });
    
    // Criar HTML completo com a matriz
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matriz Kármica 2025</title>
    <style>
        body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f9f5f1;
            margin: 0;
            padding: 20px;
        }
        .matrix-container {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            position: relative;
        }
        .image-container {
            max-width: 100%;
            text-align: center;
            position: relative;
        }
        .matrix-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border: 1px solid #EAE6E1;
        }
        .number-overlay {
            position: absolute;
            transform: translate(-50%, -50%);
        }
        .number-circle {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            color: #4a4a4a;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        h1 {
            text-align: center;
            color: #4a4a4a;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="matrix-container">
        <h1>Matriz Kármica 2025</h1>
        <div class="image-container">
            <img src="${imgSrc}" alt="Matriz Kármica 2025" class="matrix-image">
            ${numbers.map(num => `
                <div class="number-overlay" style="top: ${num.position.top}; left: ${num.position.left};">
                    <div class="number-circle">${num.value}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `;
    
    // Criar um Blob com o conteúdo HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Criar um link de download com "matrizkarmica" em vez do nome do usuário
    const fileName = `Matriz-Karmica-2025.html`;
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
      description: "Sua matriz kármica foi salva como HTML. Você pode abri-la em qualquer navegador."
    });
  } catch (error) {
    console.error('Erro ao gerar HTML:', error);
    toast({
      title: "Erro ao exportar",
      description: "Ocorreu um problema ao gerar o HTML da matriz.",
      variant: "destructive"
    });
  }
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
    
    // Criar um link de download com "matrizkarmica" em vez do nome do usuário
    const fileName = `Interpretacoes-Karmicas-2025.html`;
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

export const checkIfCanCreateNewMap = (email: string): boolean => {
  // Use the new function to check if the user can create more maps
  return getRemainingMatrixCount(email) > 0;
};
