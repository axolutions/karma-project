
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
              {isDownloading ? "Gerando..." : "Baixar Aplicação Completa"}
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

