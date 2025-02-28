
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, getUserData, isAuthorizedEmail, getAllAuthorizedEmails } from '@/lib/auth';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { MoveRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Limpar mensagens de erro quando o componente monta
    setError(null);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Trim email and convert to lowercase
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email para acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setError("Email não pode ser vazio");
      return;
    }
    
    // Debug: Listar todos os emails autorizados
    const authorizedEmails = getAllAuthorizedEmails();
    console.log("Emails autorizados:", authorizedEmails);
    console.log("Email fornecido:", trimmedEmail);
    console.log("Verificação:", authorizedEmails.includes(trimmedEmail));
    
    // Check if email is authorized
    if (!isAuthorizedEmail(trimmedEmail)) {
      toast({
        title: "Acesso negado",
        description: "Este email não está autorizado a acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setError(`O email ${trimmedEmail} não está na lista de autorizados.`);
      return;
    }
    
    // Login the user
    const success = login(trimmedEmail);
    if (success) {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Sistema de Matriz Kármica Pessoal 2025.",
      });
      
      // Dar tempo para o toast ser exibido
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Chamar o callback para atualizar o estado da página
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 1000);
    } else {
      setIsSubmitting(false);
      setError("Erro ao fazer login. Por favor, tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-karmic-700">
          Seu Email de Compra
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="transition-all duration-200 focus:ring-karmic-500"
          disabled={isSubmitting}
          required
        />
        <p className="text-xs text-karmic-500">
          Informe o mesmo email utilizado na compra do produto.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        className="karmic-button w-full group"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verificando...' : 'Acessar Minha Matriz Kármica'}
        <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
      
      <div className="text-xs text-gray-400 mt-4">
        <p>Emails autorizados para teste: test@example.com, cliente@teste.com, user@example.com, teste@teste.com</p>
      </div>
    </form>
  );
};

export default LoginForm;
