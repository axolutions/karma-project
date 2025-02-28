
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import ProfileForm from '@/components/ProfileForm';
import IntroSection from '@/components/IntroSection';
import { getCurrentUser, isLoggedIn, getUserData, logout } from '@/lib/auth';

const Index = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Função para verificar o status do login e determinar o estado de navegação
  const checkUserStatus = () => {
    try {
      setLoading(true);
      
      // Verificar se o usuário está logado
      const loggedIn = isLoggedIn();
      console.log("Status de login:", loggedIn);
      
      if (loggedIn) {
        const email = getCurrentUser();
        if (email) {
          console.log("Email do usuário:", email);
          const userData = getUserData(email);
          
          if (userData && userData.karmicNumbers) {
            // Usuário já tem matriz kármica completa
            console.log("Usuário com matriz kármica, redirecionando...");
            // Ao invés de redirecionar automaticamente, apenas atualizamos o estado
            setUserLoggedIn(true);
            setHasProfile(true);
          } else {
            // Usuário está logado mas precisa completar o perfil
            console.log("Usuário logado mas sem perfil completo");
            setUserLoggedIn(true);
            setHasProfile(false);
          }
        }
      } else {
        // Usuário não está logado, mostrar tela de login
        console.log("Usuário não está logado");
        setUserLoggedIn(false);
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      // Em caso de erro, fazer logout e reiniciar
      logout();
      setUserLoggedIn(false);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Verificar status do usuário quando o componente montar
    checkUserStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Função para fazer logout e voltar ao início
  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    setHasProfile(false);
    // Atualizar sem recarregar a página completa
    checkUserStatus();
  };

  // Handler para quando o login for bem-sucedido
  const handleLoginSuccess = () => {
    checkUserStatus();
  };
  
  // Handler para quando o perfil for completado
  const handleProfileComplete = () => {
    navigate('/matrix');
  };

  // Se estiver carregando, mostrar indicador
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-karmic-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-karmic-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {userLoggedIn && (
          <div className="text-right mb-4">
            <button 
              onClick={handleLogout}
              className="text-karmic-500 hover:text-karmic-700 text-sm"
            >
              Sair da conta
            </button>
          </div>
        )}
        
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
              : (userLoggedIn && hasProfile 
                ? 'Sua Matriz Kármica'
                : 'Acesse sua Matriz Kármica')}
          </h2>
          
          {userLoggedIn && !hasProfile ? (
            <>
              <ProfileForm onProfileComplete={handleProfileComplete} />
              <div className="mt-4 text-center">
                <button 
                  onClick={handleLogout}
                  className="text-karmic-500 hover:text-karmic-700 text-sm"
                >
                  Usar outro email
                </button>
              </div>
            </>
          ) : (
            userLoggedIn && hasProfile ? (
              <div className="text-center">
                <p className="mb-4 text-karmic-700">Você já tem uma matriz kármica gerada.</p>
                <button 
                  onClick={() => navigate('/matrix')} 
                  className="karmic-button w-full"
                >
                  Ver Minha Matriz Kármica
                </button>
              </div>
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )
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
