
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailManager from '@/components/admin/EmailManager';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import YampiIntegration from '@/components/admin/YampiIntegration';
import { Users, Book, LockKeyhole, ShoppingCart, Download, Code, FileDown, Laptop } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { getUserData } from '@/lib/auth';
import { generateInterpretationsHTML } from '@/lib/interpretations';

// Constante para armazenar a senha de administrador
const ADMIN_PASSWORD = "matrizkarmicaADMIN2025"; // Esta senha deve ser alterada para produção

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está autenticado na sessão
    const adminAuth = sessionStorage.getItem('adminAuthorized');
    if (adminAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Verificar a senha
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthorized(true);
        sessionStorage.setItem('adminAuthorized', 'true');
        toast({
          title: "Acesso autorizado",
          description: "Bem-vindo ao painel administrativo."
        });
      } else {
        toast({
          title: "Acesso negado",
          description: "Senha incorreta. Tente novamente.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('adminAuthorized');
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo."
    });
  };

  const handleOpenMatrixInNewTab = () => {
    try {
      // Abrir a página da matriz em uma nova aba
      window.open('/matrix', '_blank');
      
      toast({
        title: "Página aberta",
        description: "A página da matriz foi aberta em uma nova aba. Você pode inspecionar o HTML."
      });
    } catch (err) {
      console.error("Erro ao tentar abrir página:", err);
      toast({
        title: "Erro",
        description: "Não foi possível abrir a página da matriz em uma nova aba.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadFullHTML = () => {
    try {
      // Gerar um HTML básico com o conteúdo da matriz
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Matriz Kármica</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(to bottom, #f5f0ff, #ffffff);
              color: #333;
            }
            .karmic-title {
              font-family: 'Playfair Display', serif;
              color: #4b2d83;
            }
            .karmic-card {
              background-color: white;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              transition: all 0.3s ease;
            }
            .karmic-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            }
            .karmic-number {
              color: #6d28d9;
              font-weight: 700;
              font-size: 24px;
            }
          </style>
        </head>
        <body class="min-h-screen py-10">
          <div class="container mx-auto px-4 max-w-6xl">
            <h1 class="karmic-title text-center text-4xl mb-8 font-bold">Matriz Kármica</h1>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <!-- Cartões da Matriz -->
              <div class="karmic-card p-6 hover:shadow-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Selo Kármico</h3>
                <p class="karmic-number">7</p>
                <p class="mt-3">O selo kármico representa sua essência espiritual mais profunda, aquilo que você trouxe de outras vidas.</p>
              </div>
              
              <!-- Mais cartões aqui... -->
              <div class="karmic-card p-6 hover:shadow-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Chamado do Destino</h3>
                <p class="karmic-number">3</p>
                <p class="mt-3">O chamado do destino indica sua missão nesta vida, aquilo que você veio realizar.</p>
              </div>
              
              <div class="karmic-card p-6 hover:shadow-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Portal Kármico</h3>
                <p class="karmic-number">1</p>
                <p class="mt-3">O portal kármico revela as portas que você precisará atravessar para cumprir seu destino.</p>
              </div>
              
              <div class="karmic-card p-6 hover:shadow-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Herança Kármica</h3>
                <p class="karmic-number">9</p>
                <p class="mt-3">A herança kármica mostra os dons e talentos que você traz de outras vidas.</p>
              </div>
            </div>
            
            <div class="mb-10">
              <h2 class="karmic-title text-center text-3xl mb-6 font-bold">Interpretações da Matriz</h2>
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-xl font-semibold mb-4">Seu Caminho Espiritual</h3>
                <p class="mb-6 text-gray-700">
                  Sua matriz kármica revela um caminho de autodescoberta e transformação pessoal. Os números presentes em sua matriz
                  sugerem uma forte conexão com o mundo espiritual e uma capacidade natural para compreender as energias sutis.
                </p>
                
                <h3 class="text-xl font-semibold mb-4">Propósito de Vida</h3>
                <p class="text-gray-700">
                  Seu propósito de vida está relacionado à cura e transformação. Você tem o potencial de ajudar outras pessoas
                  a descobrirem seu próprio caminho espiritual, servindo como um farol de luz e sabedoria.
                </p>
              </div>
            </div>
            
            <footer class="text-center text-gray-500 text-sm mt-10">
              <p>© Matriz Kármica 2024 - Todos os direitos reservados</p>
              <p class="mt-2">Este é um documento personalizado com base na sua data de nascimento</p>
            </footer>
          </div>
        </body>
        </html>
      `;
      
      // Criar um Blob com o conteúdo HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      
      // Criar elemento de link temporário para download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Matriz-Karmica-Template.html`;
      document.body.appendChild(a);
      
      // Iniciar download
      a.click();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download iniciado",
        description: "O download do modelo HTML foi iniciado."
      });
    } catch (err) {
      console.error("Erro ao gerar arquivo para download:", err);
      toast({
        title: "Erro ao gerar arquivo",
        description: "Não foi possível gerar o arquivo HTML para download.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadUserMatrix = () => {
    try {
      // Obter o email do usuário atual (se disponível)
      const email = localStorage.getItem('currentUser');
      if (!email) {
        toast({
          title: "Aviso",
          description: "Nenhum usuário selecionado. Será gerado um modelo genérico.",
        });
      }
      
      // Tentar obter dados do usuário se disponível
      const userData = email ? getUserData(email) : null;
      
      // Gerar o conteúdo HTML para o PDF usando os dados do usuário ou dados genéricos
      const htmlContent = userData?.karmicNumbers 
        ? generateInterpretationsHTML(userData.karmicNumbers)
        : generateInterpretationsHTML({
            karmicSeal: 7,
            destinyCall: 3,
            karmaPortal: 1,
            karmicInheritance: 9,
            karmicReprogramming: 8,
            cycleProphecy: 2,
            spiritualMark: 4,
            manifestationEnigma: 6
          });
      
      // Criar um Blob com o conteúdo HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      
      // Criar elemento de link temporário para download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Matriz-Karmica-${userData?.name || 'Usuario'}.html`;
      document.body.appendChild(a);
      
      // Iniciar download
      a.click();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download iniciado",
        description: "O download das interpretações foi iniciado."
      });
    } catch (err) {
      console.error("Erro ao gerar arquivo para download:", err);
      toast({
        title: "Erro ao gerar arquivo",
        description: "Não foi possível gerar o arquivo para download.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadFullApp = () => {
    try {
      setIsDownloading(true);
      // Gerar um HTML completo com o login, formulário e matriz
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Matriz Kármica - Aplicação Completa</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(to bottom, #f5f0ff, #ffffff);
              color: #333;
              min-height: 100vh;
            }
            .karmic-title {
              font-family: 'Playfair Display', serif;
              color: #4b2d83;
            }
            .karmic-button {
              background-color: #6d28d9;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              font-weight: 500;
              transition: all 0.2s;
            }
            .karmic-button:hover {
              background-color: #5b21b6;
            }
            .karmic-card {
              background-color: white;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              transition: all 0.3s ease;
            }
            .view {
              display: none;
            }
            .active {
              display: block;
            }
            .form-group {
              margin-bottom: 1rem;
            }
            .form-control {
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #d1d5db;
              border-radius: 0.375rem;
            }
            .karmic-number {
              color: #6d28d9;
              font-weight: 700;
              font-size: 24px;
            }
          </style>
        </head>
        <body class="py-10">
          <div class="container mx-auto px-4 max-w-6xl">
            <!-- Login View -->
            <div id="login-view" class="view active">
              <div class="max-w-md mx-auto bg-white rounded-xl p-8 shadow-sm border border-purple-200">
                <h1 class="karmic-title text-center text-3xl mb-6 font-medium">
                  Matriz Kármica
                </h1>
                <p class="text-center text-gray-600 mb-6">
                  Descubra os segredos de sua jornada espiritual através dos números
                </p>
                
                <form id="login-form" class="space-y-4">
                  <div class="form-group">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="login-email" 
                      class="form-control"
                      placeholder="seu@email.com" 
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    class="karmic-button w-full"
                  >
                    Acessar Matriz
                  </button>
                  
                  <p class="text-sm text-center text-gray-500 mt-4">
                    Digite seu email para acessar sua matriz pessoal
                  </p>
                </form>
              </div>
            </div>
            
            <!-- Profile Form View -->
            <div id="profile-view" class="view">
              <div class="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-purple-200">
                <h1 class="karmic-title text-2xl mb-6 font-medium text-center">
                  Complete seu perfil
                </h1>
                
                <form id="profile-form" class="space-y-4">
                  <div class="form-group">
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                    <input 
                      type="text" 
                      id="profile-name" 
                      class="form-control"
                      placeholder="Seu nome completo" 
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
                    <input 
                      type="text" 
                      id="profile-birthdate" 
                      class="form-control"
                      placeholder="DD/MM/AAAA" 
                      required
                    />
                    <p class="text-xs text-gray-500 mt-1">Formato: dia/mês/ano (exemplo: 12/05/1985)</p>
                  </div>
                  
                  <button 
                    type="submit" 
                    class="karmic-button w-full mt-4"
                  >
                    Calcular Matriz Kármica
                  </button>
                </form>
              </div>
            </div>
            
            <!-- Matrix Result View -->
            <div id="matrix-view" class="view">
              <div class="bg-white rounded-xl p-6 shadow-sm border border-purple-200 mb-8">
                <div class="flex justify-between items-center mb-6">
                  <h1 class="karmic-title text-2xl font-medium">Sua Matriz Kármica</h1>
                  <button id="back-button" class="text-purple-600 hover:text-purple-800 text-sm">Voltar</button>
                </div>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <!-- Números da Matriz -->
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Selo Kármico</h3>
                    <p class="karmic-number" id="karmic-seal">7</p>
                  </div>
                  
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Chamado do Destino</h3>
                    <p class="karmic-number" id="destiny-call">3</p>
                  </div>
                  
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Portal Kármico</h3>
                    <p class="karmic-number" id="karma-portal">1</p>
                  </div>
                  
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Herança Kármica</h3>
                    <p class="karmic-number" id="karmic-inheritance">9</p>
                  </div>
                  
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Reprogramação Kármica</h3>
                    <p class="karmic-number" id="karmic-reprogramming">8</p>
                  </div>
                  
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Profecia de Ciclo</h3>
                    <p class="karmic-number" id="cycle-prophecy">2</p>
                  </div>
                  
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Marca Espiritual</h3>
                    <p class="karmic-number" id="spiritual-mark">4</p>
                  </div>
                  
                  <div class="karmic-card p-4 hover:shadow-lg">
                    <h3 class="text-base font-semibold text-gray-700 mb-1">Enigma de Manifestação</h3>
                    <p class="karmic-number" id="manifestation-enigma">6</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-xl p-6 shadow-sm border border-purple-200">
                <h2 class="karmic-title text-xl font-medium mb-4">Interpretações da Matriz</h2>
                
                <div class="mb-6 border-b border-gray-100 pb-4">
                  <h3 class="text-lg font-semibold mb-2">Seu Caminho Espiritual</h3>
                  <p class="text-gray-700">
                    Sua matriz kármica revela um caminho de autodescoberta e transformação pessoal. 
                    Os números presentes em sua matriz sugerem uma forte conexão com o mundo espiritual 
                    e uma capacidade natural para compreender as energias sutis.
                  </p>
                </div>
                
                <div class="mb-6 border-b border-gray-100 pb-4">
                  <h3 class="text-lg font-semibold mb-2">Propósito de Vida</h3>
                  <p class="text-gray-700">
                    Seu propósito de vida está relacionado à cura e transformação. Você tem o potencial 
                    de ajudar outras pessoas a descobrirem seu próprio caminho espiritual, servindo como 
                    um farol de luz e sabedoria.
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold mb-2">Desafios e Oportunidades</h3>
                  <p class="text-gray-700">
                    Os desafios em seu caminho servirão como catalisadores para seu crescimento espiritual. 
                    Cada dificuldade trará consigo uma oportunidade de evolução e expansão de consciência.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            // Navegação entre as telas
            document.addEventListener('DOMContentLoaded', function() {
              const loginView = document.getElementById('login-view');
              const profileView = document.getElementById('profile-view');
              const matrixView = document.getElementById('matrix-view');
              const loginForm = document.getElementById('login-form');
              const profileForm = document.getElementById('profile-form');
              const backButton = document.getElementById('back-button');
              
              // Objeto para armazenar dados do usuário
              let userData = {
                email: '',
                name: '',
                birthDate: '',
                karmicNumbers: {
                  karmicSeal: 7,
                  destinyCall: 3,
                  karmaPortal: 1,
                  karmicInheritance: 9,
                  karmicReprogramming: 8,
                  cycleProphecy: 2,
                  spiritualMark: 4,
                  manifestationEnigma: 6
                }
              };
              
              // Login Form Submission
              loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                userData.email = email;
                
                // Transição para o formulário de perfil
                loginView.classList.remove('active');
                profileView.classList.add('active');
              });
              
              // Profile Form Submission
              profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('profile-name').value;
                const birthDate = document.getElementById('profile-birthdate').value;
                
                userData.name = name;
                userData.birthDate = birthDate;
                
                // Aqui calcularíamos os números da matriz baseado na data
                // Por simplicidade, estamos usando números estáticos
                
                // Atualizar números na interface
                document.getElementById('karmic-seal').textContent = userData.karmicNumbers.karmicSeal;
                document.getElementById('destiny-call').textContent = userData.karmicNumbers.destinyCall;
                document.getElementById('karma-portal').textContent = userData.karmicNumbers.karmaPortal;
                document.getElementById('karmic-inheritance').textContent = userData.karmicNumbers.karmicInheritance;
                document.getElementById('karmic-reprogramming').textContent = userData.karmicNumbers.karmicReprogramming;
                document.getElementById('cycle-prophecy').textContent = userData.karmicNumbers.cycleProphecy;
                document.getElementById('spiritual-mark').textContent = userData.karmicNumbers.spiritualMark;
                document.getElementById('manifestation-enigma').textContent = userData.karmicNumbers.manifestationEnigma;
                
                // Transição para a visualização da matriz
                profileView.classList.remove('active');
                matrixView.classList.add('active');
              });
              
              // Back Button
              backButton.addEventListener('click', function() {
                matrixView.classList.remove('active');
                loginView.classList.add('active');
              });
            });
          </script>
        </body>
        </html>
      `;
      
      // Criar um Blob com o conteúdo HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      
      // Criar elemento de link temporário para download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Matriz-Karmica-Aplicacao-Completa.html`;
      document.body.appendChild(a);
      
      // Iniciar download
      a.click();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 100);
      
      toast({
        title: "Download iniciado",
        description: "O download da aplicação completa foi iniciado."
      });
    } catch (err) {
      console.error("Erro ao gerar arquivo para download:", err);
      setIsDownloading(false);
      toast({
        title: "Erro ao gerar arquivo",
        description: "Não foi possível gerar o arquivo HTML para download.",
        variant: "destructive"
      });
    }
  };

  // Nova função para gerar um sistema completo para Elementor
  const handleDownloadElementorSystem = () => {
    try {
      setIsDownloading(true);
      // Gerar um HTML ainda mais completo otimizado para ser importado no Elementor
      const elementorHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Matriz Kármica Completo</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* Estilos básicos do sistema */
        :root {
            --primary-color: #6D28D9;
            --primary-color-light: #8B5CF6;
            --primary-color-dark: #5B21B6;
            --background-color: #F5F3FF;
            --text-color: #1F2937;
            --text-color-light: #6B7280;
            --card-bg: #FFFFFF;
            --border-color: #E5E7EB;
            --shadow: 0 4px 12px rgba(0,0,0,0.05);
            --radius: 10px;
            --spacing: 20px;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, var(--background-color), #FFFFFF);
            color: var(--text-color);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--spacing);
        }
        
        h1, h2, h3, h4, h5 {
            font-family: 'Georgia', serif;
            color: var(--primary-color-dark);
            margin-bottom: 0.5em;
        }
        
        p {
            margin-bottom: 1em;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: var(--radius);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        
        .btn:hover {
            background-color: var(--primary-color-dark);
            transform: translateY(-2px);
        }
        
        .btn i {
            margin-right: 8px;
        }
        
        .btn-outline {
            background-color: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }
        
        .btn-outline:hover {
            background-color: var(--primary-color);
            color: white;
        }
        
        /* Layout específico */
        .app-wrapper {
            display: flex;
            min-height: 100vh;
        }
        
        .sidebar {
            width: 250px;
            background-color: var(--card-bg);
            border-right: 1px solid var(--border-color);
            padding: var(--spacing);
            display: none;
        }
        
        .sidebar.active {
            display: block;
        }
        
        .main-content {
            flex: 1;
            padding: var(--spacing);
            position: relative;
        }
        
        /* Formulários */
        .form-container {
            background-color: var(--card-bg);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 30px;
            max-width: 500px;
            margin: 40px auto;
            border: 1px solid var(--border-color);
        }
        
        .form-field {
            margin-bottom: 20px;
        }
        
        .form-field label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-color);
        }
        
        .form-field input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: calc(var(--radius) / 2);
            font-size: 16px;
            transition: all 0.2s ease;
        }
        
        .form-field input:focus {
            outline: none;
            border-color: var(--primary-color-light);
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }
        
        /* Matrix */
        .matrix-container {
            background-color: var(--card-bg);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 30px;
            margin-top: 40px;
        }
        
        .matrix-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .number-card {
            background-color: var(--background-color);
            border-radius: var(--radius);
            padding: 20px;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .number-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .number-card h3 {
            font-size: 1.1rem;
            margin-bottom: 10px;
        }
        
        .number-card p {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
        }
        
        /* Navegação */
        .tabs {
            display: flex;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 30px;
            overflow-x: auto;
        }
        
        .tab-button {
            padding: 12px 20px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-weight: 500;
            white-space: nowrap;
            color: var(--text-color-light);
        }
        
        .tab-button.active {
            border-bottom-color: var(--primary-color);
            color: var(--primary-color-dark);
        }
        
        /* Interpretações */
        .interpretation-section {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .interpretation-section:last-child {
            border-bottom: none;
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
            .matrix-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
            
            .sidebar {
                position: fixed;
                z-index: 100;
                height: 100vh;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            
            .sidebar.active {
                transform: translateX(0);
            }
            
            .menu-toggle {
                display: block;
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 101;
            }
        }
        
        /* Utilitários */
        .text-center { text-align: center; }
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .hidden { display: none !important; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .flex-col { flex-direction: column; }
        .w-full { width: 100%; }
        .p-4 { padding: 1rem; }
    </style>
</head>
<body>
    <div id="app">
        <!-- Login Page -->
        <section id="login-page" class="container">
            <div class="text-center mb-4">
                <h1>Matriz Kármica 2025</h1>
                <p>Descubra os segredos numerológicos que o universo reserva para você</p>
            </div>
            
            <div class="form-container">
                <h2 class="text-center">Acesse sua Matriz Pessoal</h2>
                <form id="login-form">
                    <div class="form-field">
                        <label for="email">Email</label>
                        <input type="email" id="email" placeholder="seu@email.com" required>
                        <p class="text-muted" style="font-size: 0.9rem; color: var(--text-color-light); margin-top: 5px;">
                            Informe o email utilizado na compra
                        </p>
                    </div>
                    <button type="submit" class="btn w-full mt-4">
                        <i class="fas fa-unlock-alt"></i> Acessar Matriz
                    </button>
                </form>
            </div>
        </section>
        
        <!-- Profile Page -->
        <section id="profile-page" class="container hidden">
            <div class="text-center mb-4">
                <h1>Complete seu Perfil</h1>
                <p>Precisamos de algumas informações para calcular sua matriz kármica pessoal</p>
            </div>
            
            <div class="form-container">
                <form id="profile-form">
                    <div class="form-field">
                        <label for="name">Nome Completo</label>
                        <input type="text" id="name" placeholder="Seu nome completo" required>
                    </div>
                    <div class="form-field">
                        <label for="birthdate">Data de Nascimento</label>
                        <input type="text" id="birthdate" placeholder="DD/MM/AAAA" required>
                        <p style="font-size: 0.9rem; color: var(--text-color-light); margin-top: 5px;">
                            Formato: dia/mês/ano completo (ex: 15/07/1985)
                        </p>
                    </div>
                    <button type="submit" class="btn w-full mt-4">
                        <i class="fas fa-calculator"></i> Calcular Matriz Kármica
                    </button>
                </form>
            </div>
        </section>
        
        <!-- Matrix Page -->
        <section id="matrix-page" class="container hidden">
            <div class="flex justify-between items-center mb-4">
                <h1>Sua Matriz Kármica Pessoal</h1>
                <button id="back-button" class="btn btn-outline">
                    <i class="fas fa-arrow-left"></i> Voltar
                </button>
            </div>
            
            <div class="matrix-container">
                <div class="tabs">
                    <button class="tab-button active" data-tab="overview">Visão Geral</button>
                    <button class="tab-button" data-tab="personal">Missão Pessoal</button>
                    <button class="tab-button" data-tab="spiritual">Caminho Espiritual</button>
                    <button class="tab-button" data-tab="challenges">Desafios & Lições</button>
                </div>
                
                <div id="tab-content">
                    <!-- Tab Overview -->
                    <div id="overview-tab" class="tab-content active">
                        <div class="matrix-grid" id="matrix-numbers">
                            <!-- Estes valores serão preenchidos dinamicamente pelo JavaScript -->
                            <div class="number-card">
                                <h3>Selo Kármico</h3>
                                <p id="karmic-seal">7</p>
                            </div>
                            
                            <div class="number-card">
                                <h3>Chamado do Destino</h3>
                                <p id="destiny-call">3</p>
                            </div>
                            
                            <div class="number-card">
                                <h3>Portal Kármico</h3>
                                <p id="karma-portal">1</p>
                            </div>
                            
                            <div class="number-card">
                                <h3>Herança Kármica</h3>
                                <p id="karmic-inheritance">9</p>
                            </div>
                            
                            <div class="number-card">
                                <h3>Reprogramação Kármica</h3>
                                <p id="karmic-reprogramming">8</p>
                            </div>
                            
                            <div class="number-card">
                                <h3>Profecia de Ciclo</h3>
                                <p id="cycle-prophecy">2</p>
                            </div>
                            
                            <div class="number-card">
                                <h3>Marca Espiritual</h3>
                                <p id="spiritual-mark">4</p>
                            </div>
                            
                            <div class="number-card">
                                <h3>Enigma de Manifestação</h3>
                                <p id="manifestation-enigma">6</p>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h2>Resumo da Sua Matriz</h2>
                            <p>
                                Sua matriz kármica revela um caminho único de evolução espiritual. Os números acima
                                representam as energias kármicas que você traz de vidas passadas e as lições que 
                                está destinado a aprender nesta encarnação.
                            </p>
                            <p>
                                Explore cada uma das abas acima para descobrir interpretações detalhadas sobre
                                os diferentes aspectos da sua jornada kármica.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Tab Personal -->
                    <div id="personal-tab" class="tab-content hidden">
                        <h2>Sua Missão Pessoal</h2>
                        
                        <div class="interpretation-section">
                            <h3>Propósito de Vida</h3>
                            <p>
                                Seu propósito de vida está diretamente relacionado ao seu número do Chamado do Destino (3).
                                Este número indica uma forte inclinação para a comunicação, expressão criativa e conexão social.
                                Você veio a este mundo para compartilhar ideias, inspirar os outros e trazer alegria através
                                da sua expressão única.
                            </p>
                            <p>
                                O número 3 é o número da expressão e da expansão. Representa a tríade divina e está associado
                                à comunicação, criatividade e otimismo. Pessoas com esse número em posição de destino frequentemente
                                se tornam professores, artistas, escritores ou outros tipos de comunicadores.
                            </p>
                        </div>
                        
                        <div class="interpretation-section">
                            <h3>Talentos Inatos</h3>
                            <p>
                                Seu Selo Kármico (7) revela seus talentos inatos para análise profunda, intuição e busca espiritual.
                                Você tem uma mente naturalmente analítica e contemplativa, com capacidade para mergulhar em assuntos
                                complexos e extrair sabedoria profunda.
                            </p>
                            <p>
                                Esta combinação de números sugere que você tem o dom de comunicar verdades espirituais e filosóficas
                                de maneira acessível e inspiradora. Sua missão pode envolver ser uma ponte entre o mundo espiritual
                                e o material, traduzindo conceitos profundos em insights práticos para os outros.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Tab Spiritual -->
                    <div id="spiritual-tab" class="tab-content hidden">
                        <h2>Seu Caminho Espiritual</h2>
                        
                        <div class="interpretation-section">
                            <h3>Lições de Vidas Passadas</h3>
                            <p>
                                Sua Herança Kármica (9) indica que você traz de vidas passadas uma grande compaixão e 
                                senso de serviço humanitário. Este número está associado à conclusão, altruísmo e sabedoria universal.
                                Em vidas anteriores, você provavelmente esteve envolvido em trabalhos de cura, ensino ou serviço.
                            </p>
                            <p>
                                O número 9 simboliza conclusão e integração. Você traz uma rica tapeçaria de experiências
                                de vidas passadas que agora precisam ser integradas e transmutadas em sabedoria para
                                compartilhar com os outros.
                            </p>
                        </div>
                        
                        <div class="interpretation-section">
                            <h3>Evolução Espiritual</h3>
                            <p>
                                Seu Portal Kármico (1) revela que seu caminho de evolução espiritual nesta vida está
                                ligado ao desenvolvimento da independência, liderança e iniciativa. Você está aprendendo
                                a confiar em sua própria força interior e ser pioneiro em novas direções.
                            </p>
                            <p>
                                Este é um número de novos começos e autodescoberta. Indica que você está em um ciclo
                                de renascimento espiritual, onde velhos padrões são liberados para dar lugar a uma
                                nova expressão da sua identidade espiritual.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Tab Challenges -->
                    <div id="challenges-tab" class="tab-content hidden">
                        <h2>Seus Desafios e Lições</h2>
                        
                        <div class="interpretation-section">
                            <h3>Desafios Principais</h3>
                            <p>
                                Sua Reprogramação Kármica (8) aponta para desafios relacionados a poder, abundância
                                e autoridade. Você está aprendendo a equilibrar aspectos materiais e espirituais da vida,
                                e a usar seu poder de forma ética e responsável.
                            </p>
                            <p>
                                Este número indica que você pode enfrentar testes relacionados a recursos, finanças
                                ou posições de influência. São oportunidades para desenvolver integridade e sabedoria
                                na administração de recursos e responsabilidades.
                            </p>
                        </div>
                        
                        <div class="interpretation-section">
                            <h3>Oportunidades de Crescimento</h3>
                            <p>
                                Sua Marca Espiritual (4) e Profecia de Ciclo (2) juntas revelam um caminho de crescimento
                                através da construção de estruturas estáveis (4) em parceria e cooperação com outros (2).
                            </p>
                            <p>
                                Você está aprendendo a balancear disciplina e estrutura com sensibilidade e cooperação.
                                Este é um caminho de construção paciente, onde resultados duradouros são alcançados
                                através de trabalho consistente e relações harmoniosas.
                            </p>
                            <p>
                                O Enigma de Manifestação (6) sugere que seu maior crescimento virá através do cultivo
                                de responsabilidade, amor incondicional e serviço às necessidades dos outros, especialmente
                                em contextos familiares ou comunitários.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Elementos das páginas
            const loginPage = document.getElementById('login-page');
            const profilePage = document.getElementById('profile-page');
            const matrixPage = document.getElementById('matrix-page');
            
            // Formulários
            const loginForm = document.getElementById('login-form');
            const profileForm = document.getElementById('profile-form');
            const backButton = document.getElementById('back-button');
            
            // Tabs da matriz
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');
            
            // Dados de usuário (simulados)
            let userData = {
                currentEmail: '',
                users: {}
            };
            
            // Tentar recuperar dados do localStorage
            try {
                const storedData = localStorage.getItem('matrixAppData');
                if (storedData) {
                    userData = JSON.parse(storedData);
                }
            } catch (e) {
                console.error('Erro ao carregar dados salvos:', e);
            }
            
            // Função para salvar dados
            function saveUserData() {
                localStorage.setItem('matrixAppData', JSON.stringify(userData));
            }
            
            // Função para gerar números kármicos
            function generateKarmicNumbers(birthDate) {
                // Em um sistema real, aqui teríamos os cálculos numerológicos baseados na data
                // Para este exemplo, usamos números aleatórios entre 1-9
                return {
                    karmicSeal: Math.floor(Math.random() * 9) + 1,
                    destinyCall: Math.floor(Math.random() * 9) + 1,
                    karmaPortal: Math.floor(Math.random() * 9) + 1,
                    karmicInheritance: Math.floor(Math.random() * 9) + 1,
                    karmicReprogramming: Math.floor(Math.random() * 9) + 1,
                    cycleProphecy: Math.floor(Math.random() * 9) + 1,
                    spiritualMark: Math.floor(Math.random() * 9) + 1,
                    manifestationEnigma: Math.floor(Math.random() * 9) + 1
                };
            }
            
            // Função para atualizar a interface com os números da matriz
            function updateMatrixDisplay(karmicNumbers) {
                document.getElementById('karmic-seal').textContent = karmicNumbers.karmicSeal;
                document.getElementById('destiny-call').textContent = karmicNumbers.destinyCall;
                document.getElementById('karma-portal').textContent = karmicNumbers.karmaPortal;
                document.getElementById('karmic-inheritance').textContent = karmicNumbers.karmicInheritance;
                document.getElementById('karmic-reprogramming').textContent = karmicNumbers.karmicReprogramming;
                document.getElementById('cycle-prophecy').textContent = karmicNumbers.cycleProphecy;
                document.getElementById('spiritual-mark').textContent = karmicNumbers.spiritualMark;
                document.getElementById('manifestation-enigma').textContent = karmicNumbers.manifestationEnigma;
            }
            
            // Login
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value.toLowerCase();
                
                // Em um sistema real, aqui verificaríamos se o email está autorizado
                // Para este exemplo, permitimos qualquer email
                userData.currentEmail = email;
                
                // Verificar se o usuário já tem perfil
                if (userData.users[email] && userData.users[email].name) {
                    // Já tem perfil, mostrar matriz
                    loginPage.classList.add('hidden');
                    matrixPage.classList.remove('hidden');
                    
                    // Atualizar exibição da matriz
                    updateMatrixDisplay(userData.users[email].karmicNumbers);
                } else {
                    // Não tem perfil, ir para página de perfil
                    loginPage.classList.add('hidden');
                    profilePage.classList.remove('hidden');
                }
                
                saveUserData();
            });
            
            // Formulário de Perfil
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const birthDate = document.getElementById('birthdate').value;
                const email = userData.currentEmail;
                
                // Validar data no formato DD/MM/AAAA
                const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
                if (!datePattern.test(birthDate)) {
                    alert('Por favor, insira uma data válida no formato DD/MM/AAAA');
                    return;
                }
                
                // Calcular números kármicos
                const karmicNumbers = generateKarmicNumbers(birthDate);
                
                // Salvar dados do usuário
                userData.users[email] = {
                    name: name,
                    birthDate: birthDate,
                    karmicNumbers: karmicNumbers
                };
                
                saveUserData();
                
                // Mostrar a matriz
                profilePage.classList.add('hidden');
                matrixPage.classList.remove('hidden');
                
                // Atualizar a interface
                updateMatrixDisplay(karmicNumbers);
            });
            
            // Voltar para o login
            backButton.addEventListener('click', function() {
                matrixPage.classList.add('hidden');
                loginPage.classList.remove('hidden');
            });
            
            // Navegação entre abas
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover classe active de todas as abas
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.add('hidden'));
                    
                    // Adicionar classe active ao botão clicado
                    this.classList.add('active');
                    
                    // Mostrar conteúdo da aba selecionada
                    const tabName = this.getAttribute('data-tab');
                    document.getElementById(tabName + '-tab').classList.remove('hidden');
                });
            });
            
            // Verificar se já havia um usuário logado
            if (userData.currentEmail && userData.users[userData.currentEmail]?.name) {
                loginPage.classList.add('hidden');
                matrixPage.classList.remove('hidden');
                updateMatrixDisplay(userData.users[userData.currentEmail].karmicNumbers);
            }
        });
    </script>
</body>
</html>
      `;
      
      // Criar um Blob com o conteúdo HTML
      const blob = new Blob([elementorHTML], { type: 'text/html' });
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      
      // Criar elemento de link temporário para download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sistema-Matriz-Karmica-Elementor.html`;
      document.body.appendChild(a);
      
      // Iniciar download
      a.click();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 100);
      
      toast({
        title: "Download iniciado",
        description: "O download do sistema completo para Elementor foi iniciado."
      });
    } catch (err) {
      console.error("Erro ao gerar sistema para Elementor:", err);
      setIsDownloading(false);
      toast({
        title: "Erro ao gerar arquivo",
        description: "Não foi possível gerar o sistema para Elementor.",
        variant: "destructive"
      });
    }
  };
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-karmic-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-karmic-100 rounded-full mb-4">
                <LockKeyhole className="h-8 w-8 text-karmic-700" />
              </div>
              <h1 className="text-2xl font-serif font-medium text-karmic-800 mb-2">
                Acesso Administrativo
              </h1>
              <p className="text-karmic-600">
                Digite a senha para acessar o painel.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium text-karmic-700 block mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-karmic-300 rounded-md focus:ring-karmic-500 focus:border-karmic-500"
                  placeholder="••••••••••••"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="karmic-button w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Acessar Painel"}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => navigate('/')}
                  className="text-karmic-600 hover:text-karmic-800"
                >
                  Voltar para o site
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-medium text-karmic-800 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-karmic-600">
              Gerencie emails autorizados e interpretações da Matriz Kármica.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={handleOpenMatrixInNewTab} 
              variant="outline" 
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Code className="h-4 w-4" />
              Ver Matriz em Nova Aba
            </Button>
            <Button 
              onClick={handleDownloadFullHTML} 
              variant="outline" 
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              <Download className="h-4 w-4" />
              Baixar HTML Template
            </Button>
            <Button 
              onClick={handleDownloadUserMatrix} 
              variant="outline" 
              className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            >
              <FileDown className="h-4 w-4" />
              Baixar HTML Usuário
            </Button>
            <Button 
              onClick={handleDownloadFullApp} 
              variant="outline" 
              disabled={isDownloading}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
            >
              <Laptop className="h-4 w-4" />
              {isDownloading ? "Gerando..." : "Baixar App Simples"}
            </Button>
            <Button 
              onClick={handleDownloadElementorSystem} 
              variant="outline" 
              disabled={isDownloading}
              className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Gerando..." : "Sistema Elementor"}
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="karmic-button-outline"
            >
              Sair
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-karmic-200">
          <Tabs defaultValue="emails" className="space-y-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="emails" className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Emails Autorizados
              </TabsTrigger>
              <TabsTrigger value="interpretations" className="flex items-center justify-center">
                <Book className="h-4 w-4 mr-2" />
                Interpretações
              </TabsTrigger>
              <TabsTrigger value="yampi" className="flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Integração Yampi
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="emails">
              <EmailManager />
            </TabsContent>
            
            <TabsContent value="interpretations">
              <InterpretationEditor />
            </TabsContent>
            
            <TabsContent value="yampi">
              <YampiIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
