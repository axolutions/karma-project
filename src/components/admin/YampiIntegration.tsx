import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, ExternalLink, Archive } from "lucide-react";
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
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        // Convert the object into an array of user data
        const usersArray = Object.keys(parsedData).map(email => ({
          email: email,
          ...parsedData[email]
        }));
        setAllUsersData(usersArray);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
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

  // New function to generate the complete HTML application
  const generateFullAppHTML = () => {
    // Get the current URL's base path (without route)
    const baseUrl = window.location.origin;
    
    // Generate the HTML with all necessary components
    const fullHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matriz Kármica Pessoal 2025</title>
    <link rel="stylesheet" href="${baseUrl}/index.css">
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
                    ${renderMatrixHTML() || '<p class="text-center">Selecione um usuário para ver sua matriz</p>'}
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
            
            // Lista de emails autorizados (em produção, isso seria verificado no servidor)
            const authorizedEmails = ['teste@exemplo.com', 'cliente1@gmail.com', 'cliente2@gmail.com'];
            
            // Simulação de banco de dados local
            let userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            // Verificar se o usuário já está logado
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const userProfile = userData[currentUser];
                if (userProfile && userProfile.name) {
                    // Usuário já tem perfil, mostrar matriz
                    loginPage.classList.add('hidden');
                    profilePage.classList.add('hidden');
                    matrixPage.classList.remove('hidden');
                } else {
                    // Usuário logado mas sem perfil
                    loginPage.classList.add('hidden');
                    profilePage.classList.remove('hidden');
                    matrixPage.classList.add('hidden');
                }
            }
            
            // Login
            if (loginForm) {
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = document.getElementById('email').value.toLowerCase();
                    
                    if (authorizedEmails.includes(email)) {
                        localStorage.setItem('currentUser', email);
                        
                        // Verificar se o usuário já tem perfil
                        if (userData[email] && userData[email].name) {
                            loginPage.classList.add('hidden');
                            matrixPage.classList.remove('hidden');
                        } else {
                            loginPage.classList.add('hidden');
                            profilePage.classList.remove('hidden');
                        }
                    } else {
                        alert('Este email não está autorizado.');
                    }
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
                    
                    // Salvar dados do usuário
                    userData[email] = {
                        name: name,
                        birthDate: birthDate,
                        // Em uma aplicação real, aqui calcularíamos os números kármicos
                        karmicNumbers: {
                            karmicSeal: Math.floor(Math.random() * 9) + 1,
                            destinyCall: Math.floor(Math.random() * 9) + 1,
                            karmaPortal: Math.floor(Math.random() * 9) + 1,
                            karmicInheritance: Math.floor(Math.random() * 9) + 1,
                            karmicReprogramming: Math.floor(Math.random() * 9) + 1,
                            cycleProphecy: Math.floor(Math.random() * 9) + 1,
                            spiritualMark: Math.floor(Math.random() * 9) + 1,
                            manifestationEnigma: Math.floor(Math.random() * 9) + 1
                        }
                    };
                    
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    // Mostrar a matriz
                    profilePage.classList.add('hidden');
                    matrixPage.classList.remove('hidden');
                    
                    // Em uma aplicação real, aqui recarregaríamos a matriz com os dados corretos
                    window.location.reload();
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
</body>
</html>
`;
    return fullHTML;
  };

  // Function to download the full application HTML
  const downloadFullApp = () => {
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
  };

  const downloadMatrixHTML = () => {
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
  };

  const openInNewTab = () => {
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
  };

  const downloadTemplate = () => {
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
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Yampi Integração</CardTitle>
          <CardDescription>
            Configure a integração com a Yampi para gerar a matriz kármica.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="yampi-api-key">Yampi API Key</Label>
            <Input
              id="yampi-api-key"
              value={yampiApiKey}
              onChange={(e) => setYampiApiKey(e.target.value)}
              placeholder="sk_live_..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="yampi-product-id">Yampi Product ID</Label>
            <Input
              id="yampi-product-id"
              value={yampiProductId}
              onChange={(e) => setYampiProductId(e.target.value)}
              placeholder="product_..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar</Button>
        </CardFooter>
      </Card>
      
      <Table>
        <TableCaption>Data de usuários mockados (localStorage)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Email</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Data de Nascimento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsersData.map((user) => (
            <TableRow key={user.email} onClick={() => setSelectedUserEmail(user.email)}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.birthDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Matriz</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={openInNewTab}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-2" />
            Ver Matriz em Nova Aba
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Template HTML Básico</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={downloadTemplate}
          >
            <Download className="h-3.5 w-3.5 mr-2" />
            Baixar HTML Template
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">HTML do Usuário</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={downloadMatrixHTML}
          >
            <Download className="h-3.5 w-3.5 mr-2" />
            Baixar HTML Usuário
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Aplicação Completa</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-karmic-100 hover:bg-karmic-200"
            onClick={downloadFullApp}
          >
            <Archive className="h-3.5 w-3.5 mr-2" />
            Baixar Aplicação Completa
          </Button>
        </div>
      </div>
      
      {previewVisible && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
          <iframe
            ref={previewRef}
            title="Matrix Preview"
            width="100%"
            height="500px"
          />
        </div>
      )}
    </div>
  );
};

export default YampiIntegration;
