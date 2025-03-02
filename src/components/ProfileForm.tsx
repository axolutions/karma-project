import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveRight, ShoppingCart, Eye, LogOut } from "lucide-react";
import { calculateAllKarmicNumbers } from '@/lib/calculations';
import { toast } from "@/components/ui/use-toast";
import { 
  saveUserData, 
  getCurrentUser, 
  getAllUserDataByEmail, 
  setCurrentMatrixId, 
  isAuthorizedEmail, 
  logout,
  getRemainingMatrixCount
} from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface ProfileFormProps {
  viewMode?: 'create' | 'maps';
}

const ProfileForm: React.FC<ProfileFormProps> = ({ viewMode = 'create' }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingMaps, setExistingMaps] = useState<any[]>([]);
  const [remainingMatrixCount, setRemainingMatrixCount] = useState(0);
  const navigate = useNavigate();
  
  // On maps view, we want to highlight the maps section
  const isMapView = viewMode === 'maps';
  
  useEffect(() => {
    // Verificar se o usuário já tem um perfil gerado
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log("ProfileForm: Usuário atual:", currentUser);
      const userMaps = getAllUserDataByEmail();
      
      console.log("ProfileForm: Mapas encontrados para este usuário:", userMaps);
      
      // Filtrar apenas mapas válidos (com campos necessários)
      const validMaps = userMaps.filter(map => 
        map && 
        map.id && 
        map.email === currentUser
      );
      
      console.log("ProfileForm: Mapas válidos após filtragem:", validMaps);
      
      // Ordenar mapas do mais recente para o mais antigo
      const sortedMaps = [...validMaps].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
      
      setExistingMaps(sortedMaps || []);
      
      // Se houver mapas existentes, preencher o nome com o do último mapa
      if (sortedMaps && sortedMaps.length > 0) {
        setName(sortedMaps[0].name || '');
      }
      
      // Check how many matrices the user can still create
      setRemainingMatrixCount(getRemainingMatrixCount(currentUser));
    } else {
      console.log("ProfileForm: Nenhum usuário logado");
    }
  }, []);
  
  const formatDate = (value: string) => {
    // Filter out non-numeric characters except /
    let filtered = value.replace(/[^\d/]/g, '');
    
    // Add slashes automatically
    if (filtered.length > 2 && filtered.charAt(2) !== '/') {
      filtered = filtered.substring(0, 2) + '/' + filtered.substring(2);
    }
    if (filtered.length > 5 && filtered.charAt(5) !== '/') {
      filtered = filtered.substring(0, 5) + '/' + filtered.substring(5);
    }
    
    // Truncate if too long
    if (filtered.length > 10) {
      filtered = filtered.substring(0, 10);
    }
    
    return filtered;
  };

  const validateDate = (value: string): boolean => {
    // Check format
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(value)) return false;
    
    const [day, month, year] = value.split('/').map(Number);
    
    // Check valid ranges
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;
    
    // Check days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    
    // Check reasonable year range
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    return true;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDate(e.target.value);
    setBirthDate(formattedValue);
    
    // Only validate if we have a complete date
    if (formattedValue.length === 10) {
      setIsValid(validateDate(formattedValue));
    }
  };

  const handleMapClick = (mapId: string) => {
    if (!mapId) {
      console.error("ID do mapa inválido:", mapId);
      toast({
        title: "Erro ao acessar mapa",
        description: "Este mapa não pode ser acessado. Por favor, crie um novo.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentMatrixId(mapId);
    navigate('/matrix');
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso."
    });
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ProfileForm: Iniciando envio do formulário");
    
    // Marcar como enviando para desativar o botão
    setIsSubmitting(true);
    console.log("ProfileForm: Formulário em processamento");
    
    // Validar nome
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Validar data
    if (!birthDate || !validateDate(birthDate)) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data de nascimento válida no formato DD/MM/AAAA.",
        variant: "destructive"
      });
      setIsValid(false);
      setIsSubmitting(false);
      return;
    }
    
    // Get current user email
    const email = getCurrentUser();
    if (!email) {
      toast({
        title: "Erro de sessão",
        description: "Sua sessão expirou. Por favor, faça login novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Check if user can create more matrices
    if (remainingMatrixCount <= 0) {
      toast({
        title: "Limite atingido",
        description: "Você já utilizou todas as suas autorizações para criar mapas kármicos.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("ProfileForm: Calculando números kármicos para data:", birthDate);
      // Calculate karmic numbers
      const karmicNumbers = calculateAllKarmicNumbers(birthDate);
      console.log("ProfileForm: Números kármicos calculados:", karmicNumbers);
      
      // Save user data with a unique ID and ensure name is properly saved
      console.log("ProfileForm: Salvando dados do usuário com nome:", name);
      const newMapId = saveUserData({
        id: crypto.randomUUID(), // Ensure each map has a unique ID
        email,
        name: name.trim(), // Ensure name is properly saved and trimmed
        birthDate,
        karmicNumbers,
        createdAt: new Date().toISOString() // Add creation timestamp
      });
      
      console.log("ProfileForm: Mapa criado com ID:", newMapId, "e nome:", name);
      
      // Definir o ID do mapa atual para visualização
      setCurrentMatrixId(newMapId);
      
      toast({
        title: "Mapa criado com sucesso",
        description: "Sua Matriz Kármica Pessoal 2025 foi gerada com sucesso.",
      });
      
      // Dar tempo para o toast ser exibido antes de redirecionar
      console.log("ProfileForm: Redirecionando para matriz em 1 segundo...");
      setTimeout(() => {
        console.log("ProfileForm: Redirecionando agora!");
        setIsSubmitting(false);
        navigate('/matrix');
      }, 1000);
    } catch (error) {
      console.error("ProfileForm: Erro ao gerar mapa:", error);
      toast({
        title: "Erro ao criar mapa",
        description: "Ocorreu um erro ao processar seus dados. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  // Apenas mostre a seção de mapas existentes se houver mapas válidos
  const hasValidMaps = existingMaps.length > 0 && existingMaps.some(map => map && map.id);
  
  console.log("ProfileForm: Renderizando com isSubmitting =", isSubmitting, "mapas válidos =", hasValidMaps);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {/* If in maps view mode, show the maps section at the top with more visibility */}
      {isMapView && hasValidMaps && (
        <div className="p-4 bg-karmic-100 rounded-md animate-fade-in border border-karmic-300">
          <p className="text-lg text-karmic-800 mb-3 font-medium">
            Seus Mapas Kármicos ({existingMaps.length}):
          </p>
          <ul className="space-y-3 text-karmic-700">
            {existingMaps.map((map, index) => {
              // Verificar se o mapa é válido para exibição
              if (!map || !map.id) return null;
              
              // Mostrar informações disponíveis ou placeholders
              const mapName = map.name && map.name.trim() ? map.name : 'Mapa sem nome';
              const mapDate = map.birthDate || 'Data indisponível';
              const createdAt = map.createdAt ? new Date(map.createdAt).toLocaleDateString() : '';
              
              return (
                <li key={map.id} className="flex justify-between items-center p-2 hover:bg-karmic-200 rounded transition-colors">
                  <span className="font-medium">
                    {mapName} <span className="text-sm font-normal">({mapDate})</span>
                    {createdAt ? <span className="text-xs text-karmic-500 block"> Criado em: {createdAt}</span> : ''}
                  </span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMapClick(map.id)}
                    className="karmic-button-outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Matriz
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {!isMapView && (
        <>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-karmic-700">
              Nome Completo
            </label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="transition-all duration-200 focus:ring-karmic-500"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="birthDate" className="text-sm font-medium text-karmic-700">
              Data de Nascimento
            </label>
            <Input
              id="birthDate"
              placeholder="DD/MM/AAAA"
              value={birthDate}
              onChange={handleDateChange}
              className={`transition-all duration-200 ${!isValid ? 'border-red-500 focus:ring-red-500' : 'focus:ring-karmic-500'}`}
              disabled={isSubmitting}
              required
            />
            {!isValid && (
              <p className="text-red-500 text-xs animate-fade-in">
                Por favor, insira uma data válida no formato DD/MM/AAAA
              </p>
            )}
          </div>
        </>
      )}
      
      {remainingMatrixCount > 0 && (
        <div className="p-3 bg-green-100 rounded-md">
          <p className="text-sm text-green-700">
            <span className="font-medium">Você pode criar {remainingMatrixCount} {remainingMatrixCount === 1 ? 'novo mapa' : 'novos mapas'} kármico{remainingMatrixCount === 1 ? '' : 's'}!</span> 
            {hasValidMaps && ' Além dos mapas que você já possui.'}
          </p>
        </div>
      )}
      
      {!isMapView && hasValidMaps && (
        <div className="p-3 bg-karmic-100 rounded-md">
          <p className="text-sm text-karmic-700 mb-2 font-medium">
            Você já possui {existingMaps.length} {existingMaps.length === 1 ? 'mapa' : 'mapas'} kármico{existingMaps.length === 1 ? '' : 's'}:
          </p>
          <ul className="text-xs space-y-2 text-karmic-600">
            {existingMaps.map((map, index) => {
              // Verificar se o mapa é válido para exibição
              if (!map || !map.id) return null;
              
              // Mostrar informações disponíveis ou placeholders
              const mapName = map.name && map.name.trim() ? map.name : 'Mapa sem nome';
              const mapDate = map.birthDate || 'Data indisponível';
              const createdAt = map.createdAt ? new Date(map.createdAt).toLocaleDateString() : '';
              
              return (
                <li key={map.id} className="flex justify-between items-center">
                  <span>
                    • {mapName} - {mapDate}
                    {createdAt ? ` (criado em: ${createdAt})` : ''}
                  </span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleMapClick(map.id)}
                    className="text-karmic-600 hover:text-karmic-800 hover:bg-karmic-200 p-1 h-auto"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      <div className="space-y-2">
        {!isMapView && (
          <Button 
            type="submit" 
            className="karmic-button w-full group"
            disabled={isSubmitting || remainingMatrixCount <= 0}
          >
            {isSubmitting ? 'Processando...' : hasValidMaps ? 'Gerar Novo Mapa Kármico 2025' : 'Gerar Minha Matriz Kármica 2025'}
            <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
        
        {isMapView && remainingMatrixCount > 0 && (
          <Button 
            type="button" 
            className="karmic-button w-full group"
            onClick={() => {
              window.location.href = '/?create=new';
            }}
          >
            Criar Novo Mapa Kármico 2025
            <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
        
        {remainingMatrixCount <= 0 && (
          <p className="text-amber-600 text-sm text-center">
            Você já utilizou todas as suas autorizações para criar mapas kármicos.
          </p>
        )}
        
        <div className="text-center flex justify-center space-x-3">
          {isMapView ? (
            <Button 
              type="button" 
              variant="link" 
              onClick={() => navigate('/matrix')}
              className="text-karmic-600 hover:text-karmic-800"
            >
              Voltar para meu mapa atual
            </Button>
          ) : hasValidMaps && (
            <Button 
              type="button" 
              variant="link" 
              onClick={() => navigate('/matrix')}
              className="text-karmic-600 hover:text-karmic-800"
            >
              Voltar para meu mapa atual
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="link" 
            onClick={handleLogout}
            className="text-karmic-600 hover:text-karmic-800 flex items-center"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
