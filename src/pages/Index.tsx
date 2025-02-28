
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import ProfileForm from '@/components/ProfileForm';
import IntroSection from '@/components/IntroSection';
import { getCurrentUser, isLoggedIn, getUserData } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUserStatus = () => {
      // Limpar estados existentes para garantir comportamento correto
      setUserLoggedIn(false);
      setHasProfile(false);
      setIsLoading(true);
      
      try {
        // Verificar se o usuário está logado
        const loggedIn = isLoggedIn();
        console.log("Usuário logado?", loggedIn);
        
        if (!loggedIn) {
          // Se não estiver logado, não fazer nada, mostrar o formulário de login
          setUserLoggedIn(false);
          setHasProfile(false);
          setIsLoading(false);
          return;
        }
        
        // Se estiver logado, verificar se tem perfil
        setUserLoggedIn(true);
        const email = getCurrentUser();
        console.log("Email do usuário:", email);
        
        if (!email) {
          // Email não encontrado, algo está errado
          setIsLoading(false);
          return;
        }
        
        const userData = getUserData(email);
        console.log("Dados do usuário:", userData);
        
        if (userData && userData.karmicNumbers) {
          // Se tiver matriz, redirecionar para a página da matriz
          setHasProfile(true);
          setTimeout(() => {
            navigate('/matrix');
          }, 500);
        } else {
          // Se não tiver matriz, mostrar o formulário de perfil
          setHasProfile(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status do usuário:", error);
        toast({
          title: "Erro ao verificar status",
          description: "Ocorreu um erro ao verificar seu status. Por favor, tente novamente.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, [navigate]);
  
  // Se ainda estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-karmic-100 to-white">
        <div className="text-center">
          <div className="h-8 w-8 border-t-2 border-karmic-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-karmic-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <IntroSection />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-xl p-8 shadow-sm border border-karmic-200"
        >
          <h2 className="text-2xl font-serif text-center text-karmic-800 mb-6">
            {userLoggedIn && !hasProfile 
              ? 'Complete seu Perfil'
              : 'Acesse sua Matriz Kármica'}
          </h2>
          
          {userLoggedIn && !hasProfile ? (
            <ProfileForm />
          ) : (
            <LoginForm />
          )}
          
          <div className="mt-6 pt-6 border-t border-karmic-200 text-center">
            <p className="text-sm text-karmic-600">
              Adquira sua Matriz Kármica Pessoal 2025 e transforme sua jornada espiritual.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
