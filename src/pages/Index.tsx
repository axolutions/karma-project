
import React, { useState, useEffect, useRef } from 'react';
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
  
  useEffect(() => {
    // Função para verificar o status do login
    const checkLoginStatus = async () => {
      setLoading(true);
      try {
        // Verificar se o usuário está logado
        const loggedIn = isLoggedIn();
        setUserLoggedIn(loggedIn);
        
        if (loggedIn) {
          // Verificar se o usuário já completou o perfil
          const email = getCurrentUser();
          if (email) {
            const userData = getUserData(email);
            
            // Se tem dados de usuário com matriz kármica, redirecionar para /matrix
            if (userData && userData.karmicNumbers) {
              console.log("Usuário com matriz kármica detectado, redirecionando...");
              setHasProfile(true);
              navigate('/matrix');
              return;
            } else {
              // Usuário logado mas sem perfil completo
              console.log("Usuário logado sem perfil completo");
              setHasProfile(false);
            }
          }
        } else {
          // Limpar estados se não estiver logado
          console.log("Usuário não está logado");
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Erro ao verificar login:", error);
        // Em caso de erro, fazer logout para garantir
        logout();
        setUserLoggedIn(false);
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
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
