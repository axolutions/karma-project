
import React, { useState, useEffect, useRef } from 'react';
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
  performRecovery,
  exportInterpretations,
  importInterpretations
} from '@/lib/interpretations';
import { Save, Trash, Bold, Italic, List, Type, Quote, RotateCcw, Download, Upload } from 'lucide-react';

const InterpretationEditor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("karmicSeal");
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [interpretationsCount, setInterpretationsCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33", "44"];
  const categories = getAllCategories();
  
  useEffect(() => {
    loadInterpretation();
    updateInterpretationsCount();
  }, [selectedCategory, selectedNumber]);
  
  const loadInterpretation = () => {
    const interpretation = getInterpretation(selectedCategory, parseInt(selectedNumber));
    setTitle(interpretation.title);
    setContent(interpretation.content);
  };
  
  const updateInterpretationsCount = () => {
    const count = Object.keys(exportInterpretations()).length;
    setInterpretationsCount(count);
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
      
      setTimeout(() => {
        setIsLoading(false);
        updateInterpretationsCount();
      }, 300);
    } catch (error) {
      console.error("Erro ao salvar interpretação:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a interpretação. Tente novamente.",
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
      updateInterpretationsCount();
    }
  };
  
  const handleRecovery = () => {
    if (window.confirm("Tentar recuperar interpretações do localStorage? Esta operação não apagará os dados atuais.")) {
      setIsLoading(true);
      
      setTimeout(() => {
        const success = performRecovery();
        
        if (success) {
          toast({
            title: "Recuperação concluída",
            description: "Foram recuperadas interpretações armazenadas localmente.",
          });
          loadInterpretation();
          updateInterpretationsCount();
        } else {
          toast({
            title: "Recuperação falhou",
            description: "Não foi possível encontrar interpretações armazenadas para recuperar.",
            variant: "destructive"
          });
        }
        
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handleExport = () => {
    try {
      const data = exportInterpretations();
      
      if (Object.keys(data).length === 0) {
        toast({
          title: "Nada para exportar",
          description: "Não há interpretações para exportar.",
          variant: "destructive"
        });
        return;
      }
      
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `interpretacoes-karmicas-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
      
      toast({
        title: "Exportação concluída",
        description: `${Object.keys(data).length} interpretações exportadas com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar as interpretações.",
        variant: "destructive"
      });
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (window.confirm(`Deseja importar ${Object.keys(data).length} interpretações? Isso manterá as interpretações atuais e adicionará as novas.`)) {
          const success = importInterpretations(data);
          
          if (success) {
            toast({
              title: "Importação concluída",
              description: `${Object.keys(data).length} interpretações importadas com sucesso.`
            });
            loadInterpretation();
            updateInterpretationsCount();
          } else {
            toast({
              title: "Importação falhou",
              description: "Não foi possível importar as interpretações. Verifique o formato do arquivo.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Erro ao importar arquivo:", error);
        toast({
          title: "Erro na importação",
          description: "O arquivo selecionado contém dados inválidos.",
          variant: "destructive"
        });
      }
      
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      event.target.value = '';
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro na leitura",
        description: "Não foi possível ler o arquivo selecionado.",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-medium text-karmic-800">Editor de Interpretações</h2>
          <p className="text-sm text-karmic-600">
            {interpretationsCount > 0 
              ? `${interpretationsCount} interpretações salvas` 
              : "Nenhuma interpretação salva"}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRecovery}
            disabled={isLoading}
            className="text-amber-600 border-amber-300 hover:bg-amber-50"
          >
            <RotateCcw className="h-4 w-4 mr-1" /> Recuperar Dados
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-1" /> Exportar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <Upload className="h-4 w-4 mr-1" /> Importar
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
        </div>
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
