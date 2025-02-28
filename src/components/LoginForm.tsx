
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, getUserData, isAuthorizedEmail } from '@/lib/auth';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { MoveRight } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log("LoginForm: Iniciando login para:", email);
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email para acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Check if email is authorized
    console.log("LoginForm: Verificando se email está autorizado");
    if (!isAuthorizedEmail(email)) {
      toast({
        title: "Acesso negado",
        description: "Este email não está autorizado a acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Login the user
    console.log("LoginForm: Email autorizado, realizando login");
    const success = login(email);
    if (success) {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Sistema de Matriz Kármica Pessoal 2025.",
      });
      
      // Check if user has already completed profile
      console.log("LoginForm: Verificando se usuário já tem perfil");
      const userData = getUserData(email);
      console.log("LoginForm: Dados do usuário:", userData);
      
      setTimeout(() => {
        setIsSubmitting(false);
        if (userData && userData.id) {
          // User already has a matrix, redirect to results
          console.log("LoginForm: Usuário já tem matriz, redirecionando para results");
          navigate('/matrix');
        } else {
          // User needs to fill profile, redirect to profile page
          console.log("LoginForm: Usuário precisa preencher perfil");
          navigate('/');
          // Force reload to show profile form
          window.location.reload();
        }
      }, 1000);
    } else {
      console.log("LoginForm: Falha no login");
      setIsSubmitting(false);
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
      
      <Button 
        type="submit" 
        className="karmic-button w-full group"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verificando...' : 'Acessar Minha Matriz Kármica'}
        <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
};

export default LoginForm;
