
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import ProfileForm from '@/components/ProfileForm';
import IntroSection from '@/components/IntroSection';
import { getCurrentUser, isLoggedIn, getUserData } from '@/lib/auth';

const Index = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      console.log("Index: Iniciando verificação de login");
      // Check if user is logged in
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);
      console.log("Index: Usuário logado?", loggedIn);
      
      if (loggedIn) {
        // Check if user has created profile
        const email = getCurrentUser();
        console.log("Index: Email do usuário atual:", email);
        
        if (email) {
          console.log("Index: Obtendo dados do usuário");
          const userData = getUserData(email);
          console.log("Index: Dados do usuário:", userData);
          
          if (userData && userData.id) {
            console.log("Index: Usuário já tem perfil, redirecionando para matriz");
            setHasProfile(true);
            // Redirect to matrix page
            navigate('/matrix');
          } else {
            console.log("Index: Usuário logado, mas sem perfil");
            setHasProfile(false);
          }
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Index: Erro ao verificar login:", error);
      setIsLoading(false);
    }
  }, [navigate]);

  // Se estiver carregando, mostrar indicador
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-karmic-100 to-white">
        <p className="text-karmic-800">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <IntroSection />
        
        <div
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
        </div>
      </div>
    </div>
  );
};

export default Index;
