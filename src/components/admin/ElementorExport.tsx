
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Download, HelpCircle, RefreshCw, Copy } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const ElementorExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTestingMode, setIsTestingMode] = useState(false);

  const generateElementorHTML = () => {
    setIsGenerating(true);
    
    // Add more authorized emails for testing
    const additionalTestEmails = isTestingMode ? 
      `'usuario-teste@gmail.com',
      'teste123@hotmail.com',
      'matrix-test@yahoo.com',` : '';

    // This creates a simplified HTML version that works with Elementor's HTML widget
    const elementorHTML = `
<!-- Widget de HTML do Elementor - Coloque este código em um widget HTML -->

<div id="matriz-karmica-app" class="matriz-karmica-container">
  <!-- Login Page -->
  <div id="login-page" class="matriz-section">
    <h2 class="matriz-title">Acesse sua Matriz Pessoal</h2>
    <div class="matriz-form">
      <div class="matriz-field">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="seu@email.com" required />
        <p class="matriz-hint">Informe o email utilizado na compra</p>
      </div>
      <button id="matriz-login-btn" class="matriz-button">Acessar Matriz</button>
      <div id="login-message" class="matriz-message" style="display:none; margin-top: 15px; padding: 10px; border-radius: 5px;"></div>
    </div>
  </div>
  
  <!-- Profile Page -->
  <div id="profile-page" class="matriz-section" style="display:none;">
    <h2 class="matriz-title">Complete seu Perfil</h2>
    <div class="matriz-form">
      <div class="matriz-field">
        <label for="name">Nome Completo</label>
        <input type="text" id="name" placeholder="Seu nome completo" required />
      </div>
      <div class="matriz-field">
        <label for="birthdate">Data de Nascimento</label>
        <input type="text" id="birthdate" placeholder="DD/MM/AAAA" required />
        <p class="matriz-hint">Formato: dia/mês/ano completo (ex: 15/07/1985)</p>
      </div>
      <button id="matriz-calc-btn" class="matriz-button">Calcular Matriz Kármica</button>
    </div>
  </div>
  
  <!-- Matrix Page -->
  <div id="matrix-page" class="matriz-section" style="display:none;">
    <div class="matriz-header">
      <h2 class="matriz-title">Sua Matriz Kármica Pessoal</h2>
      <button id="back-button" class="matriz-button-secondary">Voltar</button>
    </div>
    
    <div class="matriz-tabs">
      <button class="matriz-tab active" data-tab="overview">Visão Geral</button>
      <button class="matriz-tab" data-tab="personal">Missão Pessoal</button>
      <button class="matriz-tab" data-tab="spiritual">Caminho Espiritual</button>
      <button class="matriz-tab" data-tab="challenges">Desafios & Lições</button>
    </div>
    
    <div id="tab-content">
      <!-- Conteúdo das abas será preenchido dinamicamente pelo JS -->
      <div id="overview-tab" class="matriz-tab-content active">
        <div class="matriz-grid" id="matriz-numbers">
          <!-- Números serão preenchidos pelo JS -->
        </div>
      </div>
      
      <div id="personal-tab" class="matriz-tab-content" style="display:none;">
        <!-- Conteúdo pessoal -->
      </div>
      
      <div id="spiritual-tab" class="matriz-tab-content" style="display:none;">
        <!-- Conteúdo espiritual -->
      </div>
      
      <div id="challenges-tab" class="matriz-tab-content" style="display:none;">
        <!-- Conteúdo desafios -->
      </div>
    </div>
  </div>
</div>

<!-- Adicione este CSS em uma Seção de CSS personalizado no Elementor -->
<style>
/* Estilos para o aplicativo da Matriz Kármica */
.matriz-karmica-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.matriz-title {
  color: #6D28D9;
  text-align: center;
  margin-bottom: 20px;
}

.matriz-form {
  background-color: #F5F3FF;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.matriz-field {
  margin-bottom: 20px;
}

.matriz-field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.matriz-field input {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 5px;
  font-size: 16px;
}

.matriz-hint {
  font-size: 0.9rem;
  color: #6B7280;
  margin-top: 5px;
}

.matriz-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #6D28D9;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.matriz-button:hover {
  background-color: #5B21B6;
}

.matriz-button-secondary {
  background-color: transparent;
  color: #6D28D9;
  border: 1px solid #6D28D9;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.matriz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.matriz-tabs {
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 20px;
  overflow-x: auto;
}

.matriz-tab {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6B7280;
}

.matriz-tab.active {
  border-bottom-color: #6D28D9;
  color: #5B21B6;
}

.matriz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.matriz-number-card {
  background-color: #F5F3FF;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.matriz-number-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.matriz-number-title {
  font-size: 1.1rem;
  color: #5B21B6;
  margin-bottom: 10px;
}

.matriz-number {
  font-size: 2rem;
  font-weight: bold;
  color: #6D28D9;
}

.matriz-message {
  text-align: center;
  font-weight: 500;
}

.matriz-message.success {
  background-color: #DCFCE7;
  color: #166534;
}

.matriz-message.error {
  background-color: #FEE2E2;
  color: #991B1B;
}

/* Responsividade */
@media (max-width: 768px) {
  .matriz-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .matriz-tabs {
    flex-wrap: wrap;
  }
}
</style>

<!-- Adicione este JavaScript em uma Seção de JavaScript no Elementor -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Auxiliar de debug para testes
  function debug(msg, obj) {
    console.log("[Matriz Kármica DEBUG]:", msg, obj || '');
  }
  
  debug("Inicializando aplicativo da Matriz Kármica no Elementor");
  
  // Elementos das páginas
  const loginPage = document.getElementById('login-page');
  const profilePage = document.getElementById('profile-page');
  const matrixPage = document.getElementById('matrix-page');
  
  // Botões e formulários
  const loginBtn = document.getElementById('matriz-login-btn');
  const calcBtn = document.getElementById('matriz-calc-btn');
  const backBtn = document.getElementById('back-button');
  const emailInput = document.getElementById('email');
  const nameInput = document.getElementById('name');
  const birthdateInput = document.getElementById('birthdate');
  const loginMessage = document.getElementById('login-message');
  
  debug("Elementos encontrados:", {
    loginPage: !!loginPage,
    profilePage: !!profilePage,
    matrixPage: !!matrixPage,
    loginBtn: !!loginBtn,
    calcBtn: !!calcBtn,
    emailInput: !!emailInput,
    nameInput: !!nameInput,
    birthdateInput: !!birthdateInput
  });
  
  // Tabs da matriz
  const tabButtons = document.querySelectorAll('.matriz-tab');
  const tabContents = document.querySelectorAll('.matriz-tab-content');
  
  // Lista de emails autorizados
  const authorizedEmails = [
    ${additionalTestEmails}
    'example1@example.com',
    'example2@example.com',
    'teste@teste.com',
    'projetovmtd@gmail.com',
    'carlamaiaprojetos@gmail.com',
    'mariaal020804@gmail.com',
    'tesete@testelcom.br'
  ];
  
  debug("Emails autorizados:", authorizedEmails);
  
  // Dados dos usuários (simulação)
  let userData = {
    currentEmail: '',
    users: {}
  };
  
  // Tentar recuperar dados do localStorage
  try {
    const storedData = localStorage.getItem('matrizKarmica');
    if (storedData) {
      userData = JSON.parse(storedData);
      debug("Dados recuperados do localStorage:", userData);
    } else {
      debug("Nenhum dado encontrado no localStorage");
    }
    
    // Recuperar usuário logado (do sistema React)
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      debug("Usuário atual encontrado:", currentUser);
      
      if (authorizedEmails.some(email => 
          email.toLowerCase().trim() === currentUser.toLowerCase().trim())) {
        debug("Usuário autorizado, definindo como atual");
        userData.currentEmail = currentUser;
        
        // Verificar se já tem dados completos no sistema React
        const userMapsString = localStorage.getItem('userMaps');
        if (userMapsString) {
          debug("userMaps encontrado");
          try {
            const userMaps = JSON.parse(userMapsString);
            const userDataFromReact = userMaps.find(map => 
              map && map.email && map.email.toLowerCase() === currentUser.toLowerCase()
            );
            
            if (userDataFromReact) {
              debug("Dados do usuário encontrados no sistema React", userDataFromReact);
              // Copiar dados do sistema React para o sistema Elementor
              userData.users[currentUser] = {
                name: userDataFromReact.name || '',
                birthdate: userDataFromReact.birthDate || '',
                email: currentUser
              };
              
              // Se já tiver nome, considerar que tem dados de matriz
              if (userDataFromReact.name) {
                userData.users[currentUser].karmicNumbers = generateKarmicNumbers(userDataFromReact.birthDate);
              }
              
              saveUserData();
            } else {
              debug("Dados do usuário não encontrados no userMaps");
            }
          } catch (e) {
            debug("Erro ao processar userMaps", e);
          }
        } else {
          debug("userMaps não encontrado");
        }
      } else {
        debug("Usuário atual não está na lista de autorizados");
      }
    } else {
      debug("Nenhum usuário atual encontrado");
    }
  } catch (e) {
    debug('Erro ao carregar dados salvos:', e);
  }
  
  // Função para exibir mensagens
  function showMessage(message, type) {
    if (!loginMessage) {
      debug("Elemento de mensagem não encontrado");
      return;
    }
    
    debug("Exibindo mensagem:", { message, type });
    
    loginMessage.textContent = message;
    loginMessage.className = 'matriz-message ' + type;
    loginMessage.style.display = 'block';
    
    // Ocultar mensagem após 5 segundos
    setTimeout(() => {
      loginMessage.style.display = 'none';
    }, 5000);
  }
  
  // Função para salvar dados
  function saveUserData() {
    localStorage.setItem('matrizKarmica', JSON.stringify(userData));
    debug("Dados salvos:", userData);
    
    // Também salvar o usuário atual no formato do sistema React
    if (userData.currentEmail) {
      localStorage.setItem('currentUser', userData.currentEmail);
      debug("Usuário atual salvo:", userData.currentEmail);
    }
  }
  
  // Função para gerar números kármicos com base na data
  function generateKarmicNumbers(birthdate) {
    debug("Gerando números kármicos para data:", birthdate);
    
    // Extrair dia, mês e ano
    const parts = birthdate.split('/');
    if (parts.length !== 3) {
      debug("Formato de data inválido");
      return null;
    }
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Verificar se a data é válida
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      debug("Data inválida, contém valores não numéricos");
      return null;
    }
    
    // Cálculos numerológicos básicos
    const dayNum = day;
    const monthNum = month;
    const yearNum = reduceToSingleDigit(year);
    const fullDateNum = reduceToSingleDigit(day + month + yearNum);
    
    const numbers = {
      karmicSeal: reduceToSingleDigit(dayNum + monthNum),
      destinyCall: reduceToSingleDigit(fullDateNum + dayNum),
      karmaPortal: reduceToSingleDigit(monthNum + yearNum),
      karmicInheritance: reduceToSingleDigit(dayNum + yearNum),
      karmicReprogramming: reduceToSingleDigit(fullDateNum * 2),
      cycleProphecy: reduceToSingleDigit(dayNum * monthNum),
      spiritualMark: reduceToSingleDigit(yearNum + monthNum),
      manifestationEnigma: reduceToSingleDigit(dayNum + monthNum + yearNum)
    };
    
    debug("Números kármicos gerados:", numbers);
    return numbers;
  }
  
  // Função para reduzir um número a um único dígito (1-9)
  function reduceToSingleDigit(num) {
    if (num <= 9) return num;
    
    // Somar os dígitos
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    
    // Recursivamente reduzir até ter um único dígito
    return reduceToSingleDigit(sum);
  }
  
  // Função para criar a matriz visual
  function createMatrixDisplay(karmicNumbers) {
    const matrixGrid = document.getElementById('matriz-numbers');
    if (!matrixGrid) {
      debug("Elemento da matriz não encontrado");
      return;
    }
    
    debug("Criando exibição da matriz para números:", karmicNumbers);
    
    matrixGrid.innerHTML = '';
    
    // Verificar se temos números kármicos válidos
    if (!karmicNumbers) {
      matrixGrid.innerHTML = '<p>Não foi possível calcular a matriz. Verifique a data de nascimento.</p>';
      debug("Números kármicos inválidos");
      return;
    }
    
    // Criar cartões para cada número
    const numbers = [
      { name: 'Selo Kármico', value: karmicNumbers.karmicSeal },
      { name: 'Chamado do Destino', value: karmicNumbers.destinyCall },
      { name: 'Portal Kármico', value: karmicNumbers.karmaPortal },
      { name: 'Herança Kármica', value: karmicNumbers.karmicInheritance },
      { name: 'Reprogramação Kármica', value: karmicNumbers.karmicReprogramming },
      { name: 'Profecia de Ciclo', value: karmicNumbers.cycleProphecy },
      { name: 'Marca Espiritual', value: karmicNumbers.spiritualMark },
      { name: 'Enigma de Manifestação', value: karmicNumbers.manifestationEnigma }
    ];
    
    debug("Criando cartões para números:", numbers);
    
    numbers.forEach(num => {
      const card = document.createElement('div');
      card.className = 'matriz-number-card';
      card.innerHTML = \`
        <h3 class="matriz-number-title">\${num.name}</h3>
        <p class="matriz-number">\${num.value}</p>
      \`;
      matrixGrid.appendChild(card);
    });
    
    // Preencher as interpretações nas outras abas
    createInterpretationTabs(karmicNumbers);
  }
  
  // Função para criar as abas de interpretação
  function createInterpretationTabs(karmicNumbers) {
    debug("Criando abas de interpretação");
    
    // Aba Pessoal
    const personalTab = document.getElementById('personal-tab');
    if (personalTab) {
      personalTab.innerHTML = \`
        <h2>Sua Missão Pessoal</h2>
        <div class="matriz-interpretation">
          <h3>Propósito de Vida</h3>
          <p>
            Seu propósito de vida está diretamente relacionado ao seu número do Chamado do Destino (\${karmicNumbers.destinyCall}).
            Este número indica sua verdadeira missão e os talentos que você possui para realizá-la.
          </p>
          <p>
            Você veio a este mundo com dons específicos e um caminho único a seguir. Sua matriz revela
            as energias que você traz de vidas passadas e como elas podem ser utilizadas para seu crescimento
            nesta encarnação.
          </p>
        </div>
      \`;
      debug("Aba pessoal criada");
    } else {
      debug("Elemento da aba pessoal não encontrado");
    }
    
    // Aba Espiritual
    const spiritualTab = document.getElementById('spiritual-tab');
    if (spiritualTab) {
      spiritualTab.innerHTML = \`
        <h2>Seu Caminho Espiritual</h2>
        <div class="matriz-interpretation">
          <h3>Lições de Vidas Passadas</h3>
          <p>
            Sua Herança Kármica (\${karmicNumbers.karmicInheritance}) revela as lições que você traz
            de vidas anteriores e os aprendizados que precisam ser integrados nesta existência.
          </p>
          <p>
            O número \${karmicNumbers.karmicInheritance} sugere padrões específicos de comportamento e experiências
            que estão sendo trabalhados para sua evolução espiritual.
          </p>
        </div>
      \`;
      debug("Aba espiritual criada");
    } else {
      debug("Elemento da aba espiritual não encontrado");
    }
    
    // Aba Desafios
    const challengesTab = document.getElementById('challenges-tab');
    if (challengesTab) {
      challengesTab.innerHTML = \`
        <h2>Seus Desafios e Lições</h2>
        <div class="matriz-interpretation">
          <h3>Desafios Principais</h3>
          <p>
            Sua Reprogramação Kármica (\${karmicNumbers.karmicReprogramming}) aponta para os principais
            desafios que você enfrenta nesta vida e como superá-los para avançar em seu caminho espiritual.
          </p>
          <p>
            Estes desafios não são obstáculos, mas oportunidades de crescimento que, quando abraçadas
            conscientemente, levam a grandes avanços em sua jornada.
          </p>
        </div>
      \`;
      debug("Aba desafios criada");
    } else {
      debug("Elemento da aba desafios não encontrado");
    }
  }
  
  // Formatação e validação da data
  if (birthdateInput) {
    debug("Configurando validação de data de nascimento");
    birthdateInput.addEventListener('input', function(e) {
      let value = e.target.value;
      
      // Remover caracteres não numéricos, exceto /
      value = value.replace(/[^\\d\\/]/g, '');
      
      // Adicionar barras automaticamente
      if (value.length > 2 && value.charAt(2) !== '/') {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      if (value.length > 5 && value.charAt(5) !== '/') {
        value = value.substring(0, 5) + '/' + value.substring(5);
      }
      
      // Truncar se for muito longo
      if (value.length > 10) {
        value = value.substring(0, 10);
      }
      
      // Atualizar valor formatado
      e.target.value = value;
    });
  } else {
    debug("Campo de data de nascimento não encontrado");
  }
  
  // Login (verificação de email)
  if (loginBtn) {
    debug("Configurando botão de login");
    loginBtn.addEventListener('click', function() {
      const email = emailInput.value.toLowerCase().trim();
      
      if (!email) {
        showMessage('Por favor, informe seu email', 'error');
        debug("Email não informado");
        return;
      }
      
      debug('Tentando login com:', email);
      
      // Verificar se o email está na lista de autorizados
      const isAuthorized = authorizedEmails.some(authEmail => 
        authEmail.toLowerCase().trim() === email
      );
      
      if (!isAuthorized) {
        debug('Email não autorizado:', email);
        showMessage('Este email não está autorizado para acessar o sistema', 'error');
        return;
      }
      
      // Email autorizado, prosseguir
      debug('Email autorizado:', email);
      showMessage('Email verificado com sucesso!', 'success');
      userData.currentEmail = email;
      
      // Sincronizar com o sistema React
      localStorage.setItem('currentUser', email);
      
      // Verificar se o usuário já tem perfil
      if (userData.users[email] && userData.users[email].name) {
        // Já tem perfil, mostrar matriz
        debug('Usuário já tem perfil:', userData.users[email]);
        loginPage.style.display = 'none';
        profilePage.style.display = 'none';
        matrixPage.style.display = 'block';
        
        // Criar exibição da matriz
        createMatrixDisplay(userData.users[email].karmicNumbers);
      } else {
        // Não tem perfil, ir para página de perfil
        debug('Usuário não tem perfil, mostrando formulário de perfil');
        loginPage.style.display = 'none';
        profilePage.style.display = 'block';
        matrixPage.style.display = 'none';
      }
      
      saveUserData();
    });
  } else {
    debug('Botão de login não encontrado!');
  }
  
  // Formulário de Perfil
  if (calcBtn) {
    debug("Configurando botão de cálculo");
    calcBtn.addEventListener('click', function() {
      debug("Botão de cálculo clicado");
      
      const name = nameInput.value.trim();
      const birthdate = birthdateInput.value.trim();
      const email = userData.currentEmail;
      
      debug("Dados do formulário:", { name, birthdate, email });
      
      if (!email) {
        debug("Email não definido!");
        showMessage('Sessão expirada, faça login novamente', 'error');
        loginPage.style.display = 'block';
        profilePage.style.display = 'none';
        matrixPage.style.display = 'none';
        return;
      }
      
      if (!name) {
        debug("Nome não informado");
        showMessage('Por favor, informe seu nome completo', 'error');
        return;
      }
      
      if (!birthdate) {
        debug("Data não informada");
        showMessage('Por favor, informe sua data de nascimento', 'error');
        return;
      }
      
      // Validar data no formato DD/MM/AAAA
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\\d{4}$/;
      if (!datePattern.test(birthdate)) {
        debug("Formato de data inválido");
        showMessage('Por favor, informe uma data válida no formato DD/MM/AAAA', 'error');
        return;
      }
      
      // Extrair partes da data para validação adicional
      const [day, month, year] = birthdate.split('/').map(Number);
      
      // Verificar se o dia é válido para o mês
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        debug("Dia inválido para o mês");
        showMessage(\`O mês \${month} não possui \${day} dias\`, 'error');
        return;
      }
      
      debug("Data validada, prosseguindo");
      
      // Calcular números kármicos
      const karmicNumbers = generateKarmicNumbers(birthdate);
      
      if (!karmicNumbers) {
        debug("Falha ao calcular números kármicos");
        showMessage('Erro ao calcular a matriz. Verifique a data informada.', 'error');
        return;
      }
      
      // Salvar dados do usuário
      userData.users[email] = {
        name: name,
        birthdate: birthdate,
        email: email,
        karmicNumbers: karmicNumbers,
        createdAt: new Date().toISOString()
      };
      
      debug("Dados do usuário salvos:", userData.users[email]);
      
      saveUserData();
      
      // Também salvar no formato do sistema React
      try {
        const userMapsString = localStorage.getItem('userMaps');
        const userMaps = userMapsString ? JSON.parse(userMapsString) : [];
        
        // Criar objeto de usuário no formato React
        const reactUserData = {
          id: Math.random().toString(36).substring(2, 15),
          name: name,
          email: email,
          birthDate: birthdate,
          createdAt: new Date().toISOString()
        };
        
        userMaps.push(reactUserData);
        localStorage.setItem('userMaps', JSON.stringify(userMaps));
        debug("Dados salvos no formato React:", reactUserData);
      } catch (e) {
        debug('Erro ao salvar no formato React:', e);
      }
      
      // Mostrar a matriz
      profilePage.style.display = 'none';
      matrixPage.style.display = 'block';
      
      // Exibir mensagem de sucesso
      showMessage('Matriz Kármica gerada com sucesso!', 'success');
      
      // Criar interface da matriz
      createMatrixDisplay(karmicNumbers);
    });
  } else {
    debug("Botão de cálculo não encontrado");
  }
  
  // Voltar para o login
  if (backBtn) {
    debug("Configurando botão voltar");
    backBtn.addEventListener('click', function() {
      debug("Botão voltar clicado");
      matrixPage.style.display = 'none';
      loginPage.style.display = 'block';
    });
  } else {
    debug("Botão voltar não encontrado");
  }
  
  // Navegação entre abas
  if (tabButtons.length > 0) {
    debug("Configurando navegação entre abas");
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        debug("Aba clicada:", this.getAttribute('data-tab'));
        
        // Remover classe active de todas as abas
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Ocultar todos os conteúdos
        tabContents.forEach(content => {
          content.style.display = 'none';
        });
        
        // Adicionar classe active ao botão clicado
        this.classList.add('active');
        
        // Mostrar conteúdo da aba selecionada
        const tabName = this.getAttribute('data-tab');
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
          selectedTab.style.display = 'block';
        } else {
          debug("Conteúdo da aba não encontrado:", tabName + '-tab');
        }
      });
    });
  } else {
    debug("Nenhum botão de aba encontrado");
  }
  
  // Verificar se já havia um usuário logado
  if (userData.currentEmail && userData.users[userData.currentEmail]?.name) {
    debug('Usuário já logado:', userData.currentEmail);
    debug('Dados do usuário:', userData.users[userData.currentEmail]);
    
    // Mostrar matriz diretamente
    if (loginPage) loginPage.style.display = 'none';
    if (profilePage) profilePage.style.display = 'none';
    if (matrixPage) matrixPage.style.display = 'block';
    
    // Criar exibição da matriz
    createMatrixDisplay(userData.users[userData.currentEmail].karmicNumbers);
  } else {
    debug('Nenhum usuário logado ou dados incompletos');
    
    // Verificar se temos email mas não temos perfil
    if (userData.currentEmail && !userData.users[userData.currentEmail]?.name) {
      debug('Usuário tem email mas não tem perfil, mostrando formulário de perfil');
      if (loginPage) loginPage.style.display = 'none';
      if (profilePage) profilePage.style.display = 'block';
      if (matrixPage) matrixPage.style.display = 'none';
    } else {
      debug('Mostrando tela de login inicial');
      if (loginPage) loginPage.style.display = 'block';
      if (profilePage) profilePage.style.display = 'none';
      if (matrixPage) matrixPage.style.display = 'none';
    }
  }
  
  // Debug final
  debug("Inicialização do aplicativo concluída");
});
</script>
    `;

    // Criar um blob para download
    const blob = new Blob([elementorHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Criar um link temporário para download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matriz-karmica-elementor.html';
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    }, 500);

    toast.success("HTML para Elementor exportado com sucesso!");
  };

  const copyElementorCode = async () => {
    try {
      // Add more authorized emails for testing
      const additionalTestEmails = isTestingMode ? 
        `'usuario-teste@gmail.com',
        'teste123@hotmail.com',
        'matrix-test@yahoo.com',` : '';

      const elementorHTML = `
<!-- Widget de HTML do Elementor - Coloque este código em um widget HTML -->

<div id="matriz-karmica-app" class="matriz-karmica-container">
  <!-- Login Page -->
  <div id="login-page" class="matriz-section">
    <h2 class="matriz-title">Acesse sua Matriz Pessoal</h2>
    <div class="matriz-form">
      <div class="matriz-field">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="seu@email.com" required />
        <p class="matriz-hint">Informe o email utilizado na compra</p>
      </div>
      <button id="matriz-login-btn" class="matriz-button">Acessar Matriz</button>
      <div id="login-message" class="matriz-message" style="display:none; margin-top: 15px; padding: 10px; border-radius: 5px;"></div>
    </div>
  </div>
  
  <!-- Profile Page -->
  <div id="profile-page" class="matriz-section" style="display:none;">
    <h2 class="matriz-title">Complete seu Perfil</h2>
    <div class="matriz-form">
      <div class="matriz-field">
        <label for="name">Nome Completo</label>
        <input type="text" id="name" placeholder="Seu nome completo" required />
      </div>
      <div class="matriz-field">
        <label for="birthdate">Data de Nascimento</label>
        <input type="text" id="birthdate" placeholder="DD/MM/AAAA" required />
        <p class="matriz-hint">Formato: dia/mês/ano completo (ex: 15/07/1985)</p>
      </div>
      <button id="matriz-calc-btn" class="matriz-button">Calcular Matriz Kármica</button>
    </div>
  </div>
`;

      await navigator.clipboard.writeText(elementorHTML);
      toast.success("Código copiado para a área de transferência!");
    } catch (err) {
      toast.error("Erro ao copiar: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Exportação para Elementor</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Instruções de Uso</CardTitle>
          <CardDescription>
            Como implementar a Matriz Kármica no seu site WordPress com Elementor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start space-x-2">
              <HelpCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">Importante: Como Publicar no Elementor</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Após importar o HTML no Elementor, você <strong>precisa clicar no botão "Publicar"</strong> ou "Atualizar" 
                  no canto inferior direito da tela do Elementor para que as alterações fiquem visíveis no seu site.
                </p>
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="instructions">
              <AccordionTrigger className="text-purple-700">
                Instruções passo a passo para publicar
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-4">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>Baixe o arquivo HTML</strong> clicando no botão abaixo
                  </li>
                  <li>
                    <strong>Abra o arquivo</strong> em um editor de texto (como Bloco de Notas, VS Code)
                  </li>
                  <li>
                    <strong>Copie todo o código</strong> do arquivo
                  </li>
                  <li>
                    <strong>No WordPress:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Vá para o editor Elementor da página onde deseja adicionar a Matriz Kármica</li>
                      <li>Adicione um widget "HTML" do Elementor à sua página</li>
                      <li>Cole o código copiado no widget HTML</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Configure o CSS e JavaScript</strong> seguindo as instruções nos comentários do código
                  </li>
                  <li className="font-medium text-purple-800">
                    <strong>IMPORTANTE: Clique no botão "PUBLICAR" ou "ATUALIZAR"</strong> no canto inferior direito do Elementor
                  </li>
                  <li>
                    Agora sua Matriz Kármica estará funcionando no seu site WordPress!
                  </li>
                </ol>
                
                <div className="bg-gray-100 p-3 rounded-md mt-3">
                  <p className="text-sm text-gray-600 italic">
                    Se o botão Publicar/Atualizar estiver acinzentado (desativado), tente fazer uma pequena alteração em qualquer elemento 
                    da página para ativá-lo, como adicionar um espaço em um texto ou mover ligeiramente um elemento.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="troubleshooting">
              <AccordionTrigger className="text-purple-700">
                Problemas comuns e soluções
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                <ul className="space-y-3">
                  <li>
                    <strong>Problema:</strong> O botão "Calcular Matriz Kármica" não funciona.
                    <br />
                    <strong>Solução:</strong> Verifique se você publicou a página com o botão Publicar/Atualizar e se o JavaScript foi adicionado corretamente.
                  </li>
                  <li>
                    <strong>Problema:</strong> O conteúdo aparece no editor, mas não no site publicado.
                    <br />
                    <strong>Solução:</strong> Certifique-se de clicar no botão "Publicar" ou "Atualizar" após fazer alterações.
                  </li>
                  <li>
                    <strong>Problema:</strong> Os emails dos clientes não são reconhecidos pelo sistema.
                    <br />
                    <strong>Solução:</strong> Verifique a lista de emails autorizados no código JavaScript e adicione os emails dos seus clientes.
                  </li>
                  <li>
                    <strong>Problema:</strong> Os estilos não estão sendo aplicados corretamente.
                    <br />
                    <strong>Solução:</strong> Certifique-se de que o código CSS foi adicionado corretamente na seção de CSS personalizado do Elementor.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={isTestingMode}
                onChange={() => setIsTestingMode(!isTestingMode)}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm text-gray-600">Modo de teste (adiciona emails de teste)</span>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Button 
              onClick={copyElementorCode}
              className="w-full bg-blue-600 hover:bg-blue-700"
              variant="secondary"
            >
              <Copy className="mr-2 h-4 w-4" /> Copiar Código
            </Button>
            
            <Button 
              onClick={generateElementorHTML}
              className="w-full bg-purple-700 hover:bg-purple-800"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Baixar HTML Completo
                </>
              )}
            </Button>
          </div>
          
          <p className="text-sm text-center text-gray-500 mt-2">
            Após baixar e importar, não esqueça de clicar em "Publicar" ou "Atualizar" no Elementor!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

