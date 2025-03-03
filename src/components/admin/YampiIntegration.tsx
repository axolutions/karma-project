<lov-code>
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, ExternalLink, Archive, Webhook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface UserData {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  karmicNumbers?: {
    karmicSeal: number;
    destinyCall: number;
    karmaPortal: number;
    karmicInheritance: number;
    karmicReprogramming: number;
    cycleProphecy: number;
    spiritualMark: number;
    manifestationEnigma: number;
  };
}

const YampiIntegration = () => {
  const [matrixHTML, setMatrixHTML] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allUsersData, setAllUsersData] = useState<UserData[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [yampiApiKey, setYampiApiKey] = useState<string>('');
  const [yampiProductId, setYampiProductId] = useState<string>('');
  const [yampiWebhookUrl, setYampiWebhookUrl] = useState<string>('');
  const [netlifyDeploymentUrl, setNetlifyDeploymentUrl] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        // Convert the object into an array of user data with null check
        if (parsedData && typeof parsedData === 'object') {
          const usersArray = Object.keys(parsedData).map(email => {
            // Add safety check to ensure email is defined
            if (email) {
              return {
                email: email,
                ...parsedData[email]
              };
            }
            // Return a default object if email is undefined
            return {
              id: 'default-id',
              name: 'Unknown',
              email: 'unknown@example.com'
            };
          }).filter(user => user && user.email); // Filter out any possible undefined or null users
          
          setAllUsersData(usersArray);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Set empty array in case of error
        setAllUsersData([]);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUserEmail) {
      const selectedUser = allUsersData.find(user => user.email === selectedUserEmail);
      setUserData(selectedUser || null);
      if (selectedUser) {
        const html = renderMatrixHTML(selectedUser);
        setMatrixHTML(html);
      } else {
        setMatrixHTML('<p>Usuário não encontrado.</p>');
      }
    } else {
      setUserData(null);
      setMatrixHTML('<p>Selecione um usuário para ver sua matriz.</p>');
    }
  }, [selectedUserEmail, allUsersData]);

  const renderMatrixHTML = (user?: UserData): string => {
    if (!user || !user.karmicNumbers) {
      return '<p class="text-center">Selecione um usuário para ver sua matriz</p>';
    }

    const { karmicNumbers } = user;

    return `
      <div class="matrix-grid">
        <div class="number-card">
          <h3>Selo Kármico</h3>
          <p>${karmicNumbers.karmicSeal}</p>
        </div>
        <div class="number-card">
          <h3>Chamado do Destino</h3>
          <p>${karmicNumbers.destinyCall}</p>
        </div>
        <div class="number-card">
          <h3>Portal do Karma</h3>
          <p>${karmicNumbers.karmaPortal}</p>
        </div>
        <div class="number-card">
          <h3>Herança Kármica</h3>
          <p>${karmicNumbers.karmicInheritance}</p>
        </div>
        <div class="number-card">
          <h3>Reprogramação Kármica</h3>
          <p>${karmicNumbers.karmicReprogramming}</p>
        </div>
        <div class="number-card">
          <h3>Profecia do Ciclo</h3>
          <p>${karmicNumbers.cycleProphecy}</p>
        </div>
        <div class="number-card">
          <h3>Marca Espiritual</h3>
          <p>${karmicNumbers.spiritualMark}</p>
        </div>
        <div class="number-card">
          <h3>Enigma da Manifestação</h3>
          <p>${karmicNumbers.manifestationEnigma}</p>
        </div>
      </div>
    `;
  };

  // New function to generate the complete HTML application with Netlify/Yampi webhook support
  const generateFullAppHTML = () => {
    // Get webhook URL or default
    const webhookUrl = yampiWebhookUrl || '/api/yampi-webhook';
    
    // Generate the HTML with all necessary components
    const fullHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matriz Kármica Pessoal 2025</title>
    <style>
        /* Estilos básicos da aplicação */
        :root {
            --karmic-100: #f5f3f0;
            --karmic-200: #e9e5df;
            --karmic-500: #9b8b78;
            --karmic-600: #7d6e5c;
            --karmic-700: #5e5243;
            --karmic-800: #3f372d;
        }
        
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            background: linear-gradient(to bottom, var(--karmic-100), white);
            color: var(--karmic-800);
            min-height: 100vh;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        h1, h2, h3, h4, h5 {
            font-family: Georgia, serif;
        }
        
        .karmic-button {
            background-color: var(--karmic-600);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
        }
        
        .karmic-button:hover {
            background-color: var(--karmic-700);
        }
        
        /* Formulários */
        .form-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            padding: 30px;
            max-width: 500px;
            margin: 40px auto;
            border: 1px solid var(--karmic-200);
        }
        
        .form-field {
            margin-bottom: 20px;
        }
        
        .form-field label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--karmic-700);
        }
        
        .form-field input {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--karmic-200);
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.2s;
        }
        
        .form-field input:focus {
            outline: none;
            border-color: var(--karmic-500);
            box-shadow: 0 0 0 2px rgba(155, 139, 120, 0.2);
        }
        
        /* Matrix */
        .matrix-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            padding: 30px;
            margin-top: 40px;
        }
        
        .matrix-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .number-card {
            background-color: var(--karmic-100);
            border-radius: 10px;
            padding: 20px;
            border: 1px solid var(--karmic-200);
            transition: transform 0.2s;
        }
        
        .number-card:hover {
            transform: translateY(-5px);
        }
        
        /* Navegação */
        .tabs {
            display: flex;
            border-bottom: 1px solid var(--karmic-200);
            margin-bottom: 30px;
        }
        
        .tab-button {
            padding: 12px 20px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-weight: 500;
            color: var(--karmic-600);
        }
        
        .tab-button.active {
            border-bottom-color: var(--karmic-600);
            color: var(--karmic-800);
        }
        
        /* Utilitários */
        .text-center { text-align: center; }
        .mt-4 { margin-top: 16px; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div id="app">
        <!-- Página de Login -->
        <section id="login-page" class="container">
            <div class="text-center">
                <h1>Matriz Kármica Pessoal 2025</h1>
                <p>Descubra os segredos que o universo reserva para sua jornada em 2025</p>
            </div>
            
            <div class="form-container">
                <h2 class="text-center">Faça Login para Acessar</h2>
                <form id="login-form">
                    <div class="form-field">
                        <label for="email">Seu Email de Compra</label>
                        <input type="email" id="email" placeholder="seuemail@exemplo.com" required>
                        <p class="text-muted small">Informe o mesmo email utilizado na compra do produto.</p>
                    </div>
                    <button type="submit" class="karmic-button w-full">Acessar Minha Matriz Kármica</button>
                </form>
            </div>
        </section>
        
        <!-- Página de Perfil -->
        <section id="profile-page" class="container hidden">
            <div class="text-center">
                <h1>Complete seu Perfil</h1>
                <p>Precisamos de algumas informações para gerar sua matriz kármica personalizada</p>
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
                    </div>
                    <button type="submit" class="karmic-button w-full">Gerar Minha Matriz Kármica 2025</button>
                </form>
            </div>
        </section>
        
        <!-- Página da Matriz -->
        <section id="matrix-page" class="container hidden">
            <div class="text-center">
                <h1>Sua Matriz Kármica Pessoal 2025</h1>
                <p>Aqui está a interpretação completa dos seus números kármicos para 2025</p>
            </div>
            
            <div class="matrix-container">
                <div class="tabs">
                    <button class="tab-button active" data-tab="overview">Visão Geral</button>
                    <button class="tab-button" data-tab="details">Detalhes</button>
                    <button class="tab-button" data-tab="interpretation">Interpretação</button>
                </div>
                
                <div id="matrix-content">
                    <!-- O conteúdo da matriz será carregado aqui dinamicamente -->
                    ${matrixHTML || '<p class="text-center">Sua matriz será carregada aqui</p>'}
                </div>
            </div>
        </section>
    </div>
    
    <script>
        // Simulação simplificada do funcionamento da aplicação
        document.addEventListener('DOMContentLoaded', function() {
            // Elementos das páginas
            const loginPage = document.getElementById('login-page');
            const profilePage = document.getElementById('profile-page');
            const matrixPage = document.getElementById('matrix-page');
            
            // Formulários
            const loginForm = document.getElementById('login-form');
            const profileForm = document.getElementById('profile-form');
            
            // Base de dados local (em produção, isso seria verificado via API)
            let userData = {};
            
            // Verificar se há parâmetros na URL (para webhooks Yampi)
            const urlParams = new URLSearchParams(window.location.search);
            const yampiEmail = urlParams.get('email');
            
            // Função para verificar o email contra a API
            async function checkEmailAccess(email) {
                try {
                    // Em produção, esta seria uma chamada real à API Netlify function
                    // que validaria o acesso com a API da Yampi
                    const webhookEndpoint = "${webhookUrl}";
                    
                    // Se estamos em modo de desenvolvimento local, simular verificação
                    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
                        console.log("Modo de desenvolvimento, simulando verificação de email:", email);
                        return { authorized: true };
                    }
                    
                    // Em produção, fazer a chamada real à API
                    const response = await fetch(webhookEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email })
                    });
                    
                    if (!response.ok) {
                        throw new Error('Erro ao verificar o email');
                    }
                    
                    return await response.json();
                } catch (error) {
                    console.error("Erro na verificação:", error);
                    // Em caso de erro, permitir acesso no modo de desenvolvimento
                    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
                        return { authorized: true };
                    }
                    return { authorized: false, error: error.message };
                }
            }
            
            // Função para gerar os números kármicos baseado na data
            function calculateKarmicNumbers(birthDate) {
                // Esta seria a implementação real do cálculo dos números kármicos
                // Para simplificar, usamos valores aleatórios
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
            
            // Carregar dados do localStorage
            try {
                const storedData = localStorage.getItem('userData');
                if (storedData) {
                    userData = JSON.parse(storedData);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
            
            // Se vier um email via parâmetro Yampi, verificar e autenticar automaticamente
            if (yampiEmail) {
                console.log("Email recebido via parâmetro:", yampiEmail);
                
                // Verificar o email contra a API
                checkEmailAccess(yampiEmail).then(result => {
                    if (result.authorized) {
                        // Email autorizado, verificar se já existe perfil
                        if (userData[yampiEmail] && userData[yampiEmail].name) {
                            // Já tem perfil, mostrar matriz
                            loginPage.classList.add('hidden');
                            profilePage.classList.add('hidden');
                            matrixPage.classList.remove('hidden');
                            
                            // Carregar dados da matriz
                            const karmicNumbers = userData[yampiEmail].karmicNumbers;
                            updateMatrixDisplay(karmicNumbers);
                        } else {
                            // Não tem perfil, ir para página de perfil
                            localStorage.setItem('currentUser', yampiEmail);
                            loginPage.classList.add('hidden');
                            profilePage.classList.remove('hidden');
                        }
                    } else {
                        // Não autorizado, mostrar login normal
                        if (result.error) {
                            alert("Erro na verificação: " + result.error);
                        }
                    }
                }).catch(error => {
                    console.error("Erro ao processar verificação:", error);
                });
            }
            
            // Verificar se o usuário já está logado
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser && !yampiEmail) {
                const userProfile = userData[currentUser];
                if (userProfile && userProfile.name) {
                    // Usuário já tem perfil, mostrar matriz
                    loginPage.classList.add('hidden');
                    profilePage.classList.add('hidden');
                    matrixPage.classList.remove('hidden');
                    
                    // Carregar dados da matriz
                    updateMatrixDisplay(userProfile.karmicNumbers);
                } else {
                    // Usuário logado mas sem perfil
                    loginPage.classList.add('hidden');
                    profilePage.classList.remove('hidden');
                    matrixPage.classList.add('hidden');
                }
            }
            
            // Função para atualizar a exibição da matriz
            function updateMatrixDisplay(karmicNumbers) {
                if (!karmicNumbers) return;
                
                document.getElementById('matrix-content').innerHTML = \`
                    <div class="matrix-grid">
                        <div class="number-card">
                            <h3>Selo Kármico</h3>
                            <p>\${karmicNumbers.karmicSeal}</p>
                        </div>
                        <div class="number-card">
                            <h3>Chamado do Destino</h3>
                            <p>\${karmicNumbers.destinyCall}</p>
                        </div>
                        <div class="number-card">
                            <h3>Portal do Karma</h3>
                            <p>\${karmicNumbers.karmaPortal}</p>
                        </div>
                        <div class="number-card">
                            <h3>Herança Kármica</h3>
                            <p>\${karmicNumbers.karmicInheritance}</p>
                        </div>
                        <div class="number-card">
                            <h3>Reprogramação Kármica</h3>
                            <p>\${karmicNumbers.karmicReprogramming}</p>
                        </div>
                        <div class="number-card">
                            <h3>Profecia do Ciclo</h3>
                            <p>\${karmicNumbers.cycleProphecy}</p>
                        </div>
                        <div class="number-card">
                            <h3>Marca Espiritual</h3>
                            <p>\${karmicNumbers.spiritualMark}</p>
                        </div>
                        <div class="number-card">
                            <h3>Enigma da Manifestação</h3>
                            <p>\${karmicNumbers.manifestationEnigma}</p>
                        </div>
                    </div>
                \`;
            }
            
            // Login
            if (loginForm) {
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = document.getElementById('email').value.toLowerCase();
                    
                    // Verificar o email contra a API
                    checkEmailAccess(email).then(result => {
                        if (result.authorized) {
                            localStorage.setItem('currentUser', email);
                            
                            // Verificar se o usuário já tem perfil
                            if (userData[email] && userData[email].name) {
                                loginPage.classList.add('hidden');
                                matrixPage.classList.remove('hidden');
                                
                                // Carregar dados da matriz
                                updateMatrixDisplay(userData[email].karmicNumbers);
                            } else {
                                loginPage.classList.add('hidden');
                                profilePage.classList.remove('hidden');
                            }
                        } else {
                            alert('Este email não está autorizado.');
                        }
                    }).catch(error => {
                        console.error("Erro ao processar login:", error);
                        alert('Erro ao verificar o email. Tente novamente.');
                    });
                });
            }
            
            // Perfil
            if (profileForm) {
                profileForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const name = document.getElementById('name').value;
                    const birthDate = document.getElementById('birthdate').value;
                    const email = localStorage.getItem('currentUser');
                    
                    if (!email) {
                        alert('Sessão expirada. Por favor, faça login novamente.');
                        return;
                    }
                    
                    // Calcular números kármicos baseados na data
                    const karmicNumbers = calculateKarmicNumbers(birthDate);
                    
                    // Salvar dados do usuário
                    userData[email] = {
                        name: name,
                        birthDate: birthDate,
                        karmicNumbers: karmicNumbers
                    };
                    
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    // Mostrar a matriz
                    profilePage.classList.add('hidden');
                    matrixPage.classList.remove('hidden');
                    
                    // Atualizar a exibição da matriz
                    updateMatrixDisplay(karmicNumbers);
                });
            }
            
            // Tabs da matriz
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover ativo de todas as tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // Adicionar ativo à tab clicada
                    this.classList.add('active');
                    
                    // Em uma aplicação real, aqui trocaríamos o conteúdo das tabs
                    // const tabName = this.dataset.tab;
                    // Mostrar o conteúdo da tab selecionada
                });
            });
        });
    </script>
    
    <!-- Netlify Functions detector - detecção automática de formulários do Netlify -->
    <form name="yampi-webhook" netlify netlify-honeypot="bot-field" hidden>
      <input type="email" name="email" />
      <input type="text" name="order_id" />
      <input type="text" name="product_id" />
    </form>
</body>
</html>
`;
    return fullHTML;
  };

  // Function to download the full application HTML
  const downloadFullApp = () => {
    try {
      const fullHTML = generateFullAppHTML();
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'matriz-karmica-completa.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download iniciado",
        description: "O download da aplicação completa foi iniciado com sucesso."
      });
    } catch (err) {
      console.error("Erro ao gerar aplicação completa:", err);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a aplicação completa para download.",
        variant: "destructive"
      });
    }
  };

  const downloadMatrixHTML = () => {
    try {
      const htmlContent = renderMatrixHTML(userData);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'matriz-karmica.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download iniciado",
        description: "O download da matriz kármica foi iniciado com sucesso."
      });
    } catch (err) {
      console.error("Erro ao gerar matriz para download:", err);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a matriz para download.",
        variant: "destructive"
      });
    }
  };

  const openInNewTab = () => {
    try {
      setPreviewVisible(true);
      setTimeout(() => {
        if (previewRef.current) {
          const doc = previewRef.current.contentDocument;
          const win = previewRef.current.contentWindow;
          if (doc && win) {
            doc.body.innerHTML = renderMatrixHTML(userData);
          }
        }
      }, 500);
      
      toast({
        title: "Preview aberto",
        description: "O preview da matriz foi aberto com sucesso."
      });
    } catch (err) {
      console.error("Erro ao abrir preview:", err);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o preview da matriz.",
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = () => {
    try {
      const templateHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matriz Kármica Pessoal 2025</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Matriz Kármica Pessoal 2025</h1>
        <p>Preencha este template com os dados da matriz kármica do usuário.</p>
        <!-- Adicione aqui o conteúdo dinâmico da matriz -->
    </div>
</body>
</html>
      `;
      const blob = new Blob([templateHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template-matriz-karmica.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download iniciado",
        description: "O download do template foi iniciado com sucesso."
      });
    } catch (err) {
      console.error("Erro ao gerar template para download:", err);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o template para download.",
        variant: "destructive"
      });
    }
  };

  // Generate Netlify deployment files with webhook support
  const generateNetlifyFiles = () => {
    try {
      // Generate the main application HTML
      const appHTML = generateFullAppHTML();
      
      // Create a zip file containing:
      // 1. index.html (the main application)
      // 2. netlify.toml (configuration for Netlify)
      // 3. functions/yampi-webhook.js (serverless function for Yampi webhook)
      
      // First, create the netlify.toml content
      const netlifyToml = `[build]
  functions = "functions"
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
`;
      
      // Create the Yampi webhook function
      const yampiWebhookJs = `exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    // Parse the request body
    const payload = JSON.parse(event.body);
    console.log("Received webhook payload:", payload);
    
    // Check if we have an email to validate
    if (!payload.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required" })
      };
    }
    
    // In a real implementation, here you would:
    // 1. Connect to the Yampi API to verify the order
    // 2. Check if the email has purchased the product
    // 3. Return authorization result
    
    // For this example, we're simply authorizing all requests
    // Replace this with actual Yampi API verification in production
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        authorized: true,
        message: "User is authorized"
      })
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};
`;
      
      // Create a README with deployment instructions
      const readmeContent = `# Matriz Kármica - Aplicação Netlify com Webhook Yampi

## Instruções de Implantação

1. Extraia este arquivo ZIP
2. Faça upload da pasta para o GitHub ou diretamente para o Netlify
3. No Netlify, configure a implantação:
   - Se usar GitHub: Conecte o repositório
   - Se upload direto: Arraste e solte a pasta no painel do Netlify

## Configuração do Webhook Yampi

1. No painel da Yampi, vá até Configurações > Webhooks
2. Adicione um novo webhook com o seguinte URL:
   \`https://seu-site-netlify.netlify.app/api/yampi-webhook\`
3. Configure os eventos para disparar em "Novo Pedido" 

## Teste da Integração

Para testar a integração, você pode:

1. Fazer uma compra de teste na Yampi
2. Verificar os logs da função no painel do Netlify (Functions > yampi-webhook > Logs)
3. Acessar sua aplicação com o parâmetro de email:
   \`https://seu-site-netlify.netlify.app/?email=cliente@exemplo.com\`

## Personalização

Edite os seguintes arquivos conforme necessário:

- \`index.html\`: A aplicação principal
- \`functions/yampi-webhook.js\`: Lógica de verificação do webhook
- \`netlify.toml\`: Configuração do Netlify
`;
      
      // Create a zip file containing all these files
      const zip = window.Blob([
        // This
