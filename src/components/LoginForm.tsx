
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

  // Load authorized emails for debugging but don't display them
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
        setTimeout(() => {
          setIsSubmitting(false);
          
          // Verifica se estamos no app React ou no Elementor do WordPress
          if (window.location.hostname === 'matrizkarmica.com' || 
              window.location.hostname.includes('wordpress')) {
            console.log("Detectado site WordPress/Elementor, usando JS local");
            
            // Verifica se existem elementos específicos do Elementor
            const loginPage = document.getElementById('login-page');
            const profilePage = document.getElementById('profile-page');
            const matrixPage = document.getElementById('matrix-page');
            
            if (loginPage && profilePage && matrixPage) {
              console.log("Encontrou elementos do Elementor, alternando visibilidade");
              // Estamos no Elementor, vamos usar a lógica dele
              if (userData && userData.name) {
                // Usuário tem perfil, mostrar matriz
                loginPage.style.display = 'none';
                profilePage.style.display = 'none';
                matrixPage.style.display = 'block';
                
                // Forçar recarregamento da matriz
                const matrixIframe = document.getElementById('matrix-iframe');
                if (matrixIframe && matrixIframe instanceof HTMLIFrameElement) {
                  console.log("Atualizando iframe da matriz");
                  // Atualizar iframe com timestamp para evitar cache
                  const timestamp = new Date().getTime();
                  const currentSrc = matrixIframe.src;
                  const newSrc = currentSrc.includes('?') 
                    ? `${currentSrc}&_=${timestamp}` 
                    : `${currentSrc}?_=${timestamp}`;
                  
                  matrixIframe.src = newSrc;
                }
              } else {
                // Usuário não tem perfil, mostrar formulário de perfil
                loginPage.style.display = 'none';
                profilePage.style.display = 'block';
                matrixPage.style.display = 'none';
              }
            } else {
              console.log("Não encontrou os elementos do Elementor, tentando recarregar a página");
              // Não encontrou os elementos do Elementor, tenta recarregar
              window.location.reload();
            }
          } else {
            // Estamos no app React
            console.log("Estamos no app React, navegando com router");
            if (userData && userData.name) {
              navigate('/matrix');
            } else {
              // Se o usuário não tem perfil, navegamos para a página inicial
              // que mostrará o formulário de perfil
              navigate('/');
            }
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
