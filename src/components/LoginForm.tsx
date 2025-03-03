
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

  // Load authorized emails for debugging
  useEffect(() => {
    const emails = getAllAuthorizedEmails();
    setAuthorizedEmails(emails);
    console.log("Emails autorizados:", emails);
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
    
    // Debug: verificar se o email está na lista de autorizados
    const isAuthorized = isAuthorizedEmail(normalizedEmail);
    console.log("Email está autorizado?", isAuthorized);
    console.log("Lista de emails autorizados:", authorizedEmails);
    
    // Check if email is authorized
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
      let userData = getUserData(normalizedEmail);
      
      if (!userData) {
        console.log("Usuário não encontrado, criando registro inicial");
        // Cria um registro básico para o usuário
        saveUserData({
          email: normalizedEmail,
          name: "",
          id: crypto.randomUUID()
        });
      }
      
      const success = login(normalizedEmail);
      if (success) {
        console.log("Login realizado com sucesso para:", normalizedEmail);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema de Matriz Kármica Pessoal 2025.",
        });
        
        // Depois do login, verificamos novamente os dados do usuário
        userData = getUserData(normalizedEmail);
        console.log("Dados do usuário após login:", userData);
        
        // Agora redirecionamos explicitamente para a página inicial
        // em vez de apenas recarregar a página
        setTimeout(() => {
          setIsSubmitting(false);
          window.location.href = "/"; // forçamos redirecionamento explícito
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
      
      {/* Debug section - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-xs font-semibold">Emails autorizados (debug):</p>
          <ul className="text-xs">
            {authorizedEmails.map((authEmail, index) => (
              <li key={index}>{authEmail}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default LoginForm;
