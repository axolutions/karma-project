
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { calculateAllKarmicNumbers } from '@/lib/calculations';
import { toast } from "@/components/ui/use-toast";
import { saveUserData, getCurrentUser, getUserData } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface ProfileFormProps {
  onProfileComplete?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileComplete }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingProfile, setExistingProfile] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar apenas uma vez se o usuário já tem perfil
    let shouldCheckProfile = true;
    
    if (shouldCheckProfile) {
      // Verificar se o usuário já tem um perfil gerado
      const currentUser = getCurrentUser();
      if (currentUser) {
        const userData = getUserData(currentUser);
        if (userData && userData.karmicNumbers) {
          // Usuário já possui perfil, redirecionar para a matriz
          console.log("ProfileForm: Perfil já existe, redirecionando...");
          setExistingProfile(true);
          setTimeout(() => {
            navigate('/matrix');
          }, 500);
        }
      }
      shouldCheckProfile = false;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Verificar novamente se o usuário já tem perfil (dupla checagem)
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userData = getUserData(currentUser);
      if (userData && userData.karmicNumbers) {
        toast({
          title: "Matriz já gerada",
          description: "Você já possui uma Matriz Kármica. Redirecionando para visualização.",
        });
        setIsSubmitting(false);
        navigate('/matrix');
        return;
      }
    }
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
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
    
    // Calculate karmic numbers
    const karmicNumbers = calculateAllKarmicNumbers(birthDate);
    
    // Save user data
    saveUserData({
      email,
      name,
      birthDate,
      karmicNumbers
    });
    
    toast({
      title: "Perfil salvo com sucesso",
      description: "Sua Matriz Kármica Pessoal 2025 foi gerada com sucesso.",
    });
    
    // Callback de conclusão do perfil ou redirecionamento
    setTimeout(() => {
      setIsSubmitting(false);
      if (onProfileComplete) {
        onProfileComplete();
      } else {
        navigate('/matrix');
      }
    }, 1000);
  };

  // Se o usuário já tem um perfil, não mostrar o formulário
  if (existingProfile) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <p className="text-center text-karmic-700">
          Redirecionando para sua Matriz Kármica Pessoal...
        </p>
      </div>
    );
  }

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
      
      <Button 
        type="submit" 
        className="karmic-button w-full group"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processando...' : 'Gerar Minha Matriz Kármica 2025'}
        <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
};

export default ProfileForm;
