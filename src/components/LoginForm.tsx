
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, getUserData, isAuthorizedEmail, saveUserData, getAllAuthorizedEmails } from '@/lib/auth';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { MoveRight } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load authorized emails for authentication but don't display them
  useEffect(() => {
    const emails = getAllAuthorizedEmails();
    setAuthorizedEmails(emails);
    console.log("Emails autorizados carregados:", emails.length);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email para acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Normaliza o email para minúsculas
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Tentativa de login com email:", normalizedEmail);
    
    // Check if email is authorized
    const isAuthorized = await isAuthorizedEmail(normalizedEmail);
    console.log("Email está autorizado?", isAuthorized);
    
    if (!isAuthorized) {
      toast({
        title: "Acesso negado",
        description: "Este email não está autorizado a acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Login the user
    console.log("Email autorizado, prosseguindo com login");
    
    try {
      // Verificar se o usuário já existe, se não, criar um registro básico
      let userData = await getUserData(normalizedEmail);
      
      if (!userData) {
        console.log("Usuário não encontrado, criando registro inicial");
        // Cria um registro básico para o usuário
        userData = {
          email: normalizedEmail,
          name: "",
          id: crypto.randomUUID()
        };
        saveUserData(userData);
        throw new Error("TODO: Redirecionar para página de perfil");
      }
      
      const success = login(normalizedEmail);
      if (success) {
        console.log("Login realizado com sucesso para:", normalizedEmail);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema de Matriz Kármica Pessoal 2025.",
        });
        
        // Após login, redirecionar com base no perfil
        setTimeout(() => {
          setIsSubmitting(false);
          
          // Verifica se o usuário tem nome completo preenchido
          if (userData && userData.name) {
            console.log("Usuário tem perfil completo, redirecionando para matriz");
            navigate('/matrix');
          } else {
            console.log("Usuário sem perfil completo, permanecendo na página inicial");
            // Apenas recarregar a página para mostrar o form de perfil
            window.location.reload();
          }
        }, 1000);
      } else {
        console.error("Falha no login para:", normalizedEmail);
        toast({
          title: "Erro no login",
          description: "Houve um problema ao processar seu login. Por favor, tente novamente.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erro durante o processo de login:", error);
      toast({
        title: "Erro no sistema",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
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
