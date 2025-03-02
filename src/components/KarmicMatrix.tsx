
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface KarmicMatrixProps {
  karmicData: any;
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  console.log("KarmicMatrix: Dados recebidos:", karmicData);
  
  // Criar dados kármicos seguros (garantindo valores padrão para campos ausentes)
  const safeKarmicData = {
    karmicSeal: karmicData?.karmicSeal || 0,
    destinyCall: karmicData?.destinyCall || 0,
    karmaPortal: karmicData?.karmaPortal || 0,
    karmicInheritance: karmicData?.karmicInheritance || 0,
    karmicReprogramming: karmicData?.karmicReprogramming || 0,
    cycleProphecy: karmicData?.cycleProphecy || 0,
    spiritualMark: karmicData?.spiritualMark || 0,
    manifestationEnigma: karmicData?.manifestationEnigma || 0
  };
  
  console.log("KarmicMatrix: Dados seguros:", safeKarmicData);
  
  // Mapeamento entre os IDs do HTML e as chaves dos dados kármicos
  const idToKeyMap = {
    selo_karmico: 'karmicSeal',
    chamado_destino: 'destinyCall',
    portal_karma: 'karmaPortal',
    heranca_karmica: 'karmicInheritance',
    codex_reprogramacao: 'karmicReprogramming',
    profecia_ciclos: 'cycleProphecy',
    marca_espiritual: 'spiritualMark',
    enigma_manifestacao: 'manifestationEnigma'
  };
  
  // Mapeamento inverso para exibir os títulos corretos
  const keyToTitleMap = {
    karmicSeal: "Selo Kármico 2025",
    destinyCall: "Chamado do Destino 2025",
    karmaPortal: "Portal do Karma 2025",
    karmicInheritance: "Herança Kármica 2025",
    karmicReprogramming: "Códex da Reprogramação 2025",
    cycleProphecy: "Profecia dos Ciclos 2025",
    spiritualMark: "Marca Espiritual 2025",
    manifestationEnigma: "Enigma da Manifestação 2025"
  };
  
  // Função para baixar a matriz como HTML
  const downloadMatrixAsHtml = () => {
    // Cria um objeto com os dados da matriz para o HTML
    const matrizKarmica = {
      selo_karmico: safeKarmicData.karmicSeal,
      chamado_destino: safeKarmicData.destinyCall,
      portal_karma: safeKarmicData.karmaPortal,
      heranca_karmica: safeKarmicData.karmicInheritance,
      codex_reprogramacao: safeKarmicData.karmicReprogramming,
      profecia_ciclos: safeKarmicData.cycleProphecy,
      marca_espiritual: safeKarmicData.spiritualMark,
      enigma_manifestacao: safeKarmicData.manifestationEnigma
    };
    
    // Gerar o HTML para download
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matriz Kármica 2025</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            background-image: url('${backgroundImage}');
            background-size: cover;
            background-position: center;
            position: relative;
            height: 800px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 50px;
            position: absolute;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -35%);
            width: 70%;
        }
        .grid div {
            background: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 8px;
            font-size: 1.5em;
            font-weight: bold;
            text-align: center;
            color: #333;
        }
        .titulo {
            font-size: 2em;
            font-weight: bold;
            margin-top: 20px;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        @media print {
            .container {
                box-shadow: none;
                height: 700px;
            }
            body {
                background-color: white;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="titulo">Matriz Kármica 2025</div>
        <div class="grid">
            <div id="selo_karmico">${matrizKarmica.selo_karmico}</div>
            <div id="chamado_destino">${matrizKarmica.chamado_destino}</div>
            <div id="portal_karma">${matrizKarmica.portal_karma}</div>
            <div id="heranca_karmica">${matrizKarmica.heranca_karmica}</div>
            <div id="codex_reprogramacao">${matrizKarmica.codex_reprogramacao}</div>
            <div id="profecia_ciclos">${matrizKarmica.profecia_ciclos}</div>
            <div id="marca_espiritual">${matrizKarmica.marca_espiritual}</div>
            <div id="enigma_manifestacao">${matrizKarmica.enigma_manifestacao}</div>
        </div>
    </div>
</body>
</html>
    `;
    
    // Criar um Blob com o conteúdo HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Criar um link de download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const usernamePart = localStorage.getItem('currentUser') ? localStorage.getItem('currentUser').split('@')[0] : 'usuario';
    a.download = `Matriz-Karmica-${usernamePart || 'Usuario'}.html`;
    document.body.appendChild(a);
    
    // Disparar o download
    a.click();
    
    // Limpar recursos
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Container da matriz com estilo inspirado no HTML fornecido */}
      <div className="w-full max-w-[600px] mx-auto bg-white rounded-lg shadow-md relative print:shadow-none" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '800px'
        }}>
        <div className="text-2xl font-bold mt-5 text-white text-shadow">Matriz Kármica 2025</div>
        
        {/* Grid para os números kármicos */}
        <div className="grid grid-cols-3 gap-12 absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-[35%] w-[70%]">
          {Object.entries(idToKeyMap).map(([htmlId, dataKey]) => (
            <div 
              key={htmlId}
              id={htmlId}
              className="bg-white bg-opacity-80 p-5 rounded-lg text-xl font-bold text-gray-800"
              title={keyToTitleMap[dataKey]}
            >
              {safeKarmicData[dataKey]}
            </div>
          ))}
        </div>
      </div>
      
      {/* Botão de download */}
      <div className="mt-4 text-center print:hidden">
        <Button 
          onClick={downloadMatrixAsHtml}
          className="karmic-button flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Matriz Kármica
        </Button>
      </div>
    </div>
  );
};

export default KarmicMatrix;
