
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
  getAllCategories
} from '@/lib/interpretations';
import { Save, Trash } from 'lucide-react';

const InterpretationEditor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("karmicSeal");
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33", "44"];
  const categories = getAllCategories();
  
  useEffect(() => {
    loadInterpretation();
  }, [selectedCategory, selectedNumber]);
  
  const loadInterpretation = () => {
    const interpretation = getInterpretation(selectedCategory, parseInt(selectedNumber));
    setTitle(interpretation.title);
    setContent(interpretation.content);
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
    
    setInterpretation(
      selectedCategory, 
      parseInt(selectedNumber), 
      title, 
      content
    );
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir esta interpretação?`)) {
      deleteInterpretation(selectedCategory, parseInt(selectedNumber));
      setTitle("");
      setContent("");
    }
  };
  
  return (
    <div className="space-y-6">
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
          Dica: Você pode usar tags HTML como &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; para formatar o texto.
        </p>
      </div>
      
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
