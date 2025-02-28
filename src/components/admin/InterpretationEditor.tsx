
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { 
  getInterpretation, 
  setInterpretation, 
  deleteInterpretation,
  getCategoryDisplayName,
  getAllCategories,
  recoverFromBackup,
  getBackupsList,
  restoreFromBackup,
  dumpStorageState,
  forceDeepRecovery
} from '@/lib/interpretations';
import { Save, Trash, Bold, Italic, List, Type, Quote, RotateCcw, AlertTriangle, Check, AlertCircle } from 'lucide-react';

const InterpretationEditor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("karmicSeal");
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [backupsList, setBackupsList] = useState<string[]>([]);
  const [recoveryStatus, setRecoveryStatus] = useState("");
  
  const possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33", "44"];
  const categories = getAllCategories();
  
  useEffect(() => {
    loadInterpretation();
    loadBackupsList();
  }, [selectedCategory, selectedNumber]);
  
  const loadInterpretation = () => {
    const interpretation = getInterpretation(selectedCategory, parseInt(selectedNumber));
    setTitle(interpretation.title);
    setContent(interpretation.content);
  };
  
  const loadBackupsList = () => {
    const list = getBackupsList();
    setBackupsList(list);
  };
  
  const handleSave = () => {
    setIsLoading(true);
    
    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para esta interpretação.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, insira o conteúdo da interpretação.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Formata o conteúdo para garantir que esteja corretamente estruturado em HTML
    const formattedContent = formatContentForSaving(content);
    
    try {
      setInterpretation(
        selectedCategory, 
        parseInt(selectedNumber), 
        title, 
        formattedContent
      );
      
      // Verificar se a interpretação foi realmente salva
      setTimeout(() => {
        const savedInterpretation = getInterpretation(selectedCategory, parseInt(selectedNumber));
        if (savedInterpretation.content === DEFAULT_INTERPRETATION) {
          toast({
            title: "Erro ao verificar salvamento",
            description: "A interpretação pode não ter sido salva corretamente. Tente novamente.",
            variant: "destructive"
          });
        }
        setIsLoading(false);
        loadBackupsList(); // Atualizar lista de backups após salvar
      }, 500);
    } catch (error) {
      console.error("Erro ao salvar interpretação:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a interpretação. Verifique o console para detalhes.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Constante para texto padrão
  const DEFAULT_INTERPRETATION = "Interpretação não disponível para este número. Por favor, contate o administrador para adicionar este conteúdo.";
  
  // Função para garantir que o conteúdo está bem formatado em HTML
  const formatContentForSaving = (rawContent: string) => {
    let formattedContent = rawContent;
    
    // Verifica se está totalmente sem HTML
    if (!formattedContent.includes('<p>') && !formattedContent.includes('</p>')) {
      // Converte parágrafos simples para tags <p>
      formattedContent = formattedContent
        .split('\n\n')
        .map(p => p.trim() ? `<p>${p.trim()}</p>` : '')
        .join('\n');
    }
    
    return formattedContent;
  };
  
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir esta interpretação?`)) {
      deleteInterpretation(selectedCategory, parseInt(selectedNumber));
      setTitle("");
      setContent("");
    }
  };
  
  const handleRecoverFromBackup = () => {
    setIsRecoveryOpen(true);
    setRecoveryStatus("Pronto para tentar recuperação. Escolha uma opção abaixo.");
  };
  
  const handleStandardRecovery = () => {
    setRecoveryStatus("Tentando recuperação padrão...");
    
    setTimeout(() => {
      const success = recoverFromBackup();
      if (success) {
        toast({
          title: "Recuperação bem-sucedida",
          description: "Os dados foram recuperados do backup. Recarregando interpretação...",
        });
        setTimeout(() => {
          loadInterpretation();
          loadBackupsList();
          setRecoveryStatus("Recuperação concluída com sucesso!");
        }, 1000);
      } else {
        toast({
          title: "Recuperação falhou",
          description: "Não foi possível recuperar os dados do backup padrão.",
          variant: "destructive"
        });
        setRecoveryStatus("Recuperação padrão falhou. Tente outra opção.");
      }
    }, 500);
  };
  
  const handleEmergencyRecovery = () => {
    if (window.confirm("ATENÇÃO: Esta é uma recuperação de EMERGÊNCIA que fará uma busca profunda no localStorage. Esta operação pode demorar um pouco. Deseja continuar?")) {
      setRecoveryStatus("Executando recuperação de emergência...");
      
      setTimeout(() => {
        const success = forceDeepRecovery();
        if (success) {
          toast({
            title: "Recuperação de emergência bem-sucedida",
            description: "Os dados foram recuperados através de busca profunda. Recarregando.",
          });
          setTimeout(() => {
            loadInterpretation();
            loadBackupsList();
            setRecoveryStatus("Recuperação de emergência concluída com sucesso!");
          }, 1000);
        } else {
          toast({
            title: "Recuperação de emergência falhou",
            description: "Não foi possível recuperar nenhum dado através da busca profunda.",
            variant: "destructive"
          });
          setRecoveryStatus("Recuperação de emergência falhou. Não foi possível recuperar dados.");
        }
      }, 500);
    }
  };
  
  const handleRestoreFromBackup = (backupName: string) => {
    setRecoveryStatus(`Restaurando do backup: ${backupName}...`);
    
    setTimeout(() => {
      const success = restoreFromBackup(backupName);
      if (success) {
        toast({
          title: "Restauração bem-sucedida",
          description: `Os dados foram restaurados do backup: ${backupName}`,
        });
        loadInterpretation();
        setRecoveryStatus(`Restauração de "${backupName}" concluída com sucesso!`);
      } else {
        toast({
          title: "Restauração falhou",
          description: `Não foi possível restaurar o backup: ${backupName}`,
          variant: "destructive"
        });
        setRecoveryStatus(`Falha ao restaurar "${backupName}". Tente outro backup.`);
      }
    }, 500);
  };
  
  const handleShowDebugInfo = () => {
    const debugInfo = dumpStorageState();
    console.log(debugInfo);
    
    // Exibir em uma div temporária
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '20px';
    debugDiv.style.right = '20px';
    debugDiv.style.maxWidth = '80%';
    debugDiv.style.maxHeight = '80%';
    debugDiv.style.overflow = 'auto';
    debugDiv.style.backgroundColor = '#f0f0f0';
    debugDiv.style.padding = '20px';
    debugDiv.style.border = '1px solid #ccc';
    debugDiv.style.borderRadius = '5px';
    debugDiv.style.zIndex = '9999';
    debugDiv.style.whiteSpace = 'pre-wrap';
    
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Fechar';
    closeButton.style.marginBottom = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = '#e0e0e0';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(debugDiv);
    
    debugDiv.appendChild(closeButton);
    debugDiv.appendChild(document.createElement('hr'));
    debugDiv.appendChild(document.createTextNode(debugInfo));
    
    document.body.appendChild(debugDiv);
  };
  
  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + openTag + selectedText + closeTag + content.substring(end);
    
    setContent(newText);
    
    // Set cursor position after formatting is applied
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, end + openTag.length);
    }, 0);
  };
  
  const insertTemplate = (template: string) => {
    const newContent = content + "\n\n" + template;
    setContent(newContent);
  };
  
  // Helper para processar o HTML para visualização
  const processContentForPreview = (rawHTML: string) => {
    // Estiliza os parágrafos com <strong> para dar destaque a certas partes
    let processedHTML = rawHTML;
    
    // Se não tiver formatação HTML, adiciona
    if (!processedHTML.includes('<p>')) {
      processedHTML = processedHTML
        .split('\n\n')
        .map(p => p.trim() ? `<p>${p.trim()}</p>` : '')
        .join('\n');
    }
    
    // Cria boxes para afirmações
    processedHTML = processedHTML.replace(
      /<h3>Afirmação.*?<\/h3>(.*?)(?=<h3>|$)/gs, 
      '<div class="affirmation-box"><h3 class="affirmation-title">Afirmação Kármica</h3>$1</div>'
    );
    
    // Destaca títulos secundários (h3)
    processedHTML = processedHTML.replace(
      /<h3>(.*?)<\/h3>/g,
      '<h3 class="karmic-subtitle">$1</h3>'
    );
    
    return processedHTML;
  };
  
  return (
    <div className="space-y-6">
      {/* Modal de Recuperação */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-karmic-800">Centro de Recuperação de Dados</h3>
              <button 
                onClick={() => setIsRecoveryOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {recoveryStatus && (
              <div className={`p-3 rounded-md mb-4 ${
                recoveryStatus.includes("sucesso") 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : recoveryStatus.includes("falhou") 
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                <div className="flex items-start">
                  {recoveryStatus.includes("sucesso") ? (
                    <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                  ) : recoveryStatus.includes("falhou") ? (
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  )}
                  <p>{recoveryStatus}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleStandardRecovery}
                  className="flex-1 bg-karmic-600 hover:bg-karmic-700"
                >
                  Recuperação Padrão
                </Button>
                <Button 
                  onClick={handleEmergencyRecovery}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  Recuperação de Emergência
                </Button>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md">
                <h4 className="font-medium mb-2">Backups Disponíveis</h4>
                {backupsList.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum backup encontrado.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {backupsList.map((backup, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm truncate">{backup}</span>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreFromBackup(backup)}
                        >
                          Restaurar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline"
                  onClick={handleShowDebugInfo}
                  className="w-full text-gray-600"
                >
                  Exibir Informações de Diagnóstico
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-karmic-800">Editor de Interpretações</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRecoverFromBackup}
          className="text-amber-600 border-amber-300 hover:bg-amber-50"
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Centro de Recuperação
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="text-sm font-medium text-karmic-700 block mb-2">
            Categoria
          </label>
          <select
            id="category"
            className="w-full p-2 border border-karmic-300 rounded-md focus:ring-karmic-500 focus:border-karmic-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryDisplayName(category)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="number" className="text-sm font-medium text-karmic-700 block mb-2">
            Número
          </label>
          <select
            id="number"
            className="w-full p-2 border border-karmic-300 rounded-md focus:ring-karmic-500 focus:border-karmic-500"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
          >
            {possibleNumbers.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="title" className="text-sm font-medium text-karmic-700 block mb-2">
          Título da Interpretação
        </label>
        <Input
          id="title"
          placeholder="Ex: Selo Kármico 1: O Pioneiro"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => insertTag("<strong>", "</strong>")}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => insertTag("<em>", "</em>")}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => insertTag("<h3>", "</h3>")}
          title="Subtítulo"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => insertTemplate("<h3>Afirmação Kármica</h3>\n<p>Insira a afirmação aqui.</p>")}
          title="Inserir afirmação"
        >
          <Quote className="h-4 w-4 mr-1" /> Afirmação
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => insertTemplate("<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>")}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <div className="flex-1"></div>
        <Button
          type="button"
          size="sm"
          variant={previewMode ? "default" : "outline"}
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? "Editar" : "Visualizar"}
        </Button>
      </div>
      
      {previewMode ? (
        <div className="border border-karmic-300 rounded-md min-h-[300px] p-4 karmic-content overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: processContentForPreview(content) }} />
        </div>
      ) : (
        <div>
          <label htmlFor="content" className="text-sm font-medium text-karmic-700 block mb-2">
            Conteúdo da Interpretação (suporta HTML)
          </label>
          <Textarea
            id="content"
            placeholder="Insira o conteúdo da interpretação aqui..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
          <p className="text-xs text-karmic-500 mt-1">
            Dica: Você pode usar tags HTML como &lt;p&gt; para parágrafos, &lt;strong&gt; para negrito, 
            &lt;h3&gt; para subtítulos, &lt;ul&gt; e &lt;li&gt; para listas. Use os botões acima para formatar mais facilmente.
          </p>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4 mr-1" /> Excluir
        </Button>
        
        <Button 
          type="button" 
          className="bg-karmic-600 hover:bg-karmic-700"
          onClick={handleSave}
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-1" /> {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default InterpretationEditor;
