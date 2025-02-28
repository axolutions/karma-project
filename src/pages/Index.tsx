
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import ProfileForm from '@/components/ProfileForm';
import IntroSection from '@/components/IntroSection';
import { getCurrentUser, isLoggedIn, getUserData } from '@/lib/auth';

const Index = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificação simplificada de login
    const loggedIn = isLoggedIn();
    setUserLoggedIn(loggedIn);
    console.log("Index: Usuário logado?", loggedIn);
    
    // Se estiver logado, verificar perfil
    if (loggedIn) {
      const email = getCurrentUser();
      if (email) {
        const userData = getUserData(email);
        if (userData && userData.karmicNumbers) {
          setHasProfile(true);
          navigate('/matrix');
        }
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Seção de introdução */}
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <span className="inline-block px-4 py-1 mb-4 text-xs font-medium text-karmic-700 bg-karmic-100 rounded-full">
            EXPLORADOR DA MATRIZ KÁRMICA
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-karmic-800 mb-6">
            Descubra sua jornada espiritual através dos números
          </h1>
          
          <p className="text-lg text-karmic-600 mb-8">
            A matriz kármica revela os padrões energéticos que influenciam sua vida atual, baseados em 
            experiências de vidas passadas e potenciais futuros. Descubra os quatro elementos principais 
            que moldam sua jornada espiritual.
          </p>
          
          <div className="border-b border-karmic-200 w-24 mx-auto mb-8" />
        </div>
        
        {/* Formulário de login ou perfil */}
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
