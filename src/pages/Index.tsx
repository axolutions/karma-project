
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import ProfileForm from '@/components/ProfileForm';
import IntroSection from '@/components/IntroSection';
import { getCurrentUser, isLoggedIn, getUserData } from '@/lib/auth';

const Index = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  // Ref para evitar loop infinito de redirecionamento
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    // Verificar estado de login apenas uma vez quando o componente monta
    const checkLoginStatus = () => {
      // Check if user is logged in
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);
      
      if (loggedIn) {
        // Check if user has created profile
        const email = getCurrentUser();
        if (email) {
          const userData = getUserData(email);
          if (userData && userData.karmicNumbers && !hasRedirected.current) {
            // Define que tem perfil completo
            setHasProfile(true);
            // Marcar que já redirecionamos para evitar loops
            hasRedirected.current = true;
            // Redirect to matrix page if they have karmicNumbers
            navigate('/matrix');
          }
        }
      }
    };
    
    checkLoginStatus();
    // Remover o navigate da dependência para evitar loops
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
