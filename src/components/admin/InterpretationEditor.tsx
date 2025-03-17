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
  InterpretationType,
  getInterpretationTypeDisplayName
} from '@/lib/interpretations';
import { Save, Trash, Bold, Italic, List, Type, Quote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const InterpretationEditor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedNumber, setSelectedNumber] = useState("0");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [interpretationType, setInterpretationType] = useState<InterpretationType>("karmic");
  
  const possibleNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33", "44"];
  const categories = getAllCategories(interpretationType);
  
  // Update selected category when interpretation type changes
  useEffect(() => {
    if (categories.length > 0 && (!selectedCategory || !categories.includes(selectedCategory))) {
      setSelectedCategory(categories[0]);
    }
  }, [interpretationType, categories]);
  
  useEffect(() => {
    if (selectedCategory) {
      loadInterpretation();
    }
  }, [selectedCategory, selectedNumber, interpretationType]);
  
  const loadInterpretation = async () => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    const interpretation = await getInterpretation(
      selectedCategory, 
      parseInt(selectedNumber),
      interpretationType
    );

    if (!interpretation) {
      setTitle("");
      setContent("");
      setIsLoading(false);
      return;
    }

    setTitle(interpretation.title);
    setContent(interpretation.content);
    setIsLoading(false);
  };
  
  const handleSave = async () => {
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
    
    await setInterpretation(
      selectedCategory, 
      parseInt(selectedNumber), 
      title, 
      formattedContent,
      interpretationType
    );
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
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
      deleteInterpretation(selectedCategory, parseInt(selectedNumber), interpretationType);
      setTitle("");
      setContent("");
    }
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
      <Tabs 
        value={interpretationType} 
        onValueChange={(value) => setInterpretationType(value as InterpretationType)} 
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Editor de Interpretações</h2>
          <Badge variant="outline" className="ml-2">
            {getInterpretationTypeDisplayName(interpretationType)}
          </Badge>
        </div>
        
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="karmic">Kármica Pessoal</TabsTrigger>
          <TabsTrigger value="love">Amorosa</TabsTrigger>
          <TabsTrigger value="professional">Profissional</TabsTrigger>
        </TabsList>
      </Tabs>
      
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
                {getCategoryDisplayName(category, interpretationType)}
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
          placeholder={`Ex: ${getCategoryDisplayName(selectedCategory || categories[0], interpretationType)} 1: Título`}
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
          onClick={() => {
            const affirmationType = interpretationType === "karmic" 
              ? "Afirmação Kármica" 
              : interpretationType === "love" 
                ? "Afirmação Amorosa" 
                : "Afirmação Profissional";
                
            insertTemplate(`<h3>${affirmationType}</h3>\n<p>Insira a afirmação aqui.</p>`)
          }}
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
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karmic-700"></div>
        </div>
      ) : previewMode ? (
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
          <Save className="h-4 w-4 mr-1" /> Salvar
        </Button>
      </div>
    </div>
  );
};

export default InterpretationEditor;
