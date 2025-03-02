
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveRight, ShoppingCart, Eye } from "lucide-react";
import { calculateAllKarmicNumbers } from '@/lib/calculations';
import { toast } from "@/components/ui/use-toast";
import { saveUserData, getCurrentUser, getAllUserDataByEmail, setCurrentMatrixId, isAuthorizedEmail } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const ProfileForm: React.FC = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingMaps, setExistingMaps] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se o usuário já tem um perfil gerado
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log("ProfileForm: Usuário atual:", currentUser);
      const allUserMaps = getAllUserDataByEmail();
      
      // Filtrar apenas mapas do usuário atual
      const userMaps = allUserMaps.filter(map => map && map.email === currentUser);
      console.log("ProfileForm: Mapas encontrados para este usuário:", userMaps);
      
      setExistingMaps(userMaps || []);
      
      // Se houver mapas existentes, preencher o nome com o do último mapa
      if (userMaps && userMaps.length > 0) {
        setName(userMaps[userMaps.length - 1].name || '');
      }
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
    setCurrentMatrixId(mapId);
    navigate('/matrix');
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
    
    try {
      console.log("ProfileForm: Calculando números kármicos para data:", birthDate);
      // Calculate karmic numbers
      const karmicNumbers = calculateAllKarmicNumbers(birthDate);
      console.log("ProfileForm: Números kármicos calculados:", karmicNumbers);
      
      // Save user data
      console.log("ProfileForm: Salvando dados do usuário");
      const newMapId = saveUserData({
        email,
        name,
        birthDate,
        karmicNumbers,
        createdAt: new Date().toISOString() // Add creation timestamp
      });
      
      console.log("ProfileForm: Mapa criado com ID:", newMapId);
      
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
  
  console.log("ProfileForm: Renderizando com isSubmitting =", isSubmitting);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
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
      
      {existingMaps.length > 0 && (
        <div className="p-3 bg-karmic-100 rounded-md">
          <p className="text-sm text-karmic-700 mb-2 font-medium">
            Você já possui {existingMaps.length} {existingMaps.length === 1 ? 'mapa' : 'mapas'} criado{existingMaps.length === 1 ? '' : 's'}:
          </p>
          <ul className="text-xs space-y-2 text-karmic-600">
            {existingMaps.map((map, index) => (
              <li key={map?.id || index} className="flex justify-between items-center">
                <span>
                  • {map?.name || 'Nome indisponível'} - {map?.birthDate || 'Data indisponível'} 
                  {map?.createdAt ? ` (criado em: ${new Date(map.createdAt).toLocaleDateString()})` : ''}
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
            ))}
          </ul>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="karmic-button w-full group"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processando...' : existingMaps.length > 0 ? 'Gerar Novo Mapa Kármico 2025' : 'Gerar Minha Matriz Kármica 2025'}
        <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
      
      {existingMaps.length > 0 && (
        <div className="text-center">
          <Button 
            type="button" 
            variant="link" 
            onClick={() => navigate('/matrix')}
            className="text-karmic-600 hover:text-karmic-800"
          >
            Voltar para meu mapa atual
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
