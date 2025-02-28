
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
  
  // Função para verificar o status do login e redirecionar se necessário
  const checkAndRedirect = async () => {
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
          
          // Se o usuário tem matriz kármica, redirecionar para a página da matriz
          if (userData && userData.karmicNumbers) {
            console.log("Usuário com matriz kármica, redirecionando...");
            setHasProfile(true);
            // Comentamos esta linha para evitar o redirecionamento automático
            // navigate('/matrix');
            return true; // Indica que foi redirecionado
          } else {
            console.log("Usuário logado mas sem perfil completo");
            setUserLoggedIn(true);
            setHasProfile(false);
          }
        }
      } else {
        console.log("Usuário não está logado");
        setUserLoggedIn(false);
        setHasProfile(false);
      }
      return false; // Não redirecionou
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      logout();
      setUserLoggedIn(false);
      setHasProfile(false);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const initPage = async () => {
      await checkAndRedirect();
    };
    
    initPage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            <ProfileForm onProfileComplete={() => checkAndRedirect()} />
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
              <LoginForm onLoginSuccess={() => checkAndRedirect()} />
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
