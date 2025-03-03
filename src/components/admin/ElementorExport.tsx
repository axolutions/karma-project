
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Download, Copy, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export const ElementorExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTestingMode, setIsTestingMode] = useState(false);
  const [includeDebugInfo, setIncludeDebugInfo] = useState(true);
  const [useInlineStyles, setUseInlineStyles] = useState(true);
  const [copied, setCopied] = useState(false);

  const generateBasicElementorHTML = () => {
    setIsGenerating(true);
    
    // Add more authorized emails for testing
    const additionalTestEmails = isTestingMode ? 
      `'usuario-teste@gmail.com',
      'teste123@hotmail.com',
      'matrix-test@yahoo.com',` : '';

    // This creates a simplified HTML version that works with Elementor's HTML widget
    const elementorHTML = `
<!-- WIDGET HTML: COLOQUE ISTO EM UM WIDGET HTML NO ELEMENTOR -->
<div style="${useInlineStyles ? 'max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;' : ''}">
  <!-- Formulário de Login -->
  <div id="login-form" style="${useInlineStyles ? 'background-color: #f9f7ff; border-radius: 10px; padding: 30px; margin-bottom: 20px;' : ''}">
    <h2 style="${useInlineStyles ? 'color: #6D28D9; text-align: center; margin-bottom: 25px; font-size: 24px;' : ''}">Acesse sua Matriz Kármica</h2>
    
    <div style="${useInlineStyles ? 'margin-bottom: 20px;' : ''}">
      <label for="email-input" style="${useInlineStyles ? 'display: block; margin-bottom: 8px; font-weight: bold;' : ''}">Email de Compra</label>
      <input 
        type="email" 
        id="email-input" 
        placeholder="Seu email de compra" 
        style="${useInlineStyles ? 'width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 5px; font-size: 16px; box-sizing: border-box;' : ''}"
      />
      <p style="${useInlineStyles ? 'font-size: 14px; color: #6B7280; margin-top: 5px;' : ''}">Informe o mesmo email utilizado na compra</p>
    </div>
    
    <button 
      id="login-button" 
      style="${useInlineStyles ? 'display: block; width: 100%; padding: 12px; background-color: #6D28D9; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 16px;' : ''}"
    >
      Acessar Minha Matriz
    </button>
    
    <div id="login-message" style="${useInlineStyles ? 'margin-top: 15px; padding: 10px; border-radius: 5px; display: none; text-align: center;' : ''}"></div>
  </div>
  
  <!-- Formulário de Perfil (inicialmente oculto) -->
  <div id="profile-form" style="${useInlineStyles ? 'background-color: #f9f7ff; border-radius: 10px; padding: 30px; margin-bottom: 20px; display: none;' : 'display: none;'}">
    <h2 style="${useInlineStyles ? 'color: #6D28D9; text-align: center; margin-bottom: 25px; font-size: 24px;' : ''}">Complete seu Perfil</h2>
    
    <div style="${useInlineStyles ? 'margin-bottom: 20px;' : ''}">
      <label for="name-input" style="${useInlineStyles ? 'display: block; margin-bottom: 8px; font-weight: bold;' : ''}">Nome Completo</label>
      <input 
        type="text" 
        id="name-input" 
        placeholder="Seu nome completo" 
        style="${useInlineStyles ? 'width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 5px; font-size: 16px; box-sizing: border-box;' : ''}"
      />
    </div>
    
    <div style="${useInlineStyles ? 'margin-bottom: 20px;' : ''}">
      <label for="birthdate-input" style="${useInlineStyles ? 'display: block; margin-bottom: 8px; font-weight: bold;' : ''}">Data de Nascimento</label>
      <input 
        type="text" 
        id="birthdate-input" 
        placeholder="DD/MM/AAAA" 
        style="${useInlineStyles ? 'width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 5px; font-size: 16px; box-sizing: border-box;' : ''}"
      />
      <p style="${useInlineStyles ? 'font-size: 14px; color: #6B7280; margin-top: 5px;' : ''}">Formato: dia/mês/ano (ex: 15/07/1985)</p>
    </div>
    
    <button 
      id="calculate-button" 
      style="${useInlineStyles ? 'display: block; width: 100%; padding: 12px; background-color: #6D28D9; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 16px;' : ''}"
    >
      Calcular Minha Matriz
    </button>
  </div>
  
  <!-- Resultado da Matriz (inicialmente oculto) -->
  <div id="matrix-result" style="${useInlineStyles ? 'background-color: #f9f7ff; border-radius: 10px; padding: 30px; display: none;' : 'display: none;'}">
    <div style="${useInlineStyles ? 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;' : ''}">
      <h2 style="${useInlineStyles ? 'color: #6D28D9; margin: 0; font-size: 24px;' : ''}">Sua Matriz Kármica</h2>
      <button 
        id="back-button" 
        style="${useInlineStyles ? 'background-color: transparent; color: #6D28D9; border: 1px solid #6D28D9; padding: 8px 15px; border-radius: 5px; cursor: pointer;' : ''}"
      >
        Voltar
      </button>
    </div>
    
    <div id="matrix-tabs" style="${useInlineStyles ? 'display: flex; border-bottom: 1px solid #E5E7EB; margin-bottom: 20px;' : ''}">
      <button class="matrix-tab active" data-tab="overview" style="${useInlineStyles ? 'padding: 10px 15px; background: none; border: none; border-bottom: 3px solid #6D28D9; cursor: pointer; font-weight: bold; color: #6D28D9;' : ''}">Visão Geral</button>
      <button class="matrix-tab" data-tab="personal" style="${useInlineStyles ? 'padding: 10px 15px; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; color: #6B7280;' : ''}">Missão Pessoal</button>
      <button class="matrix-tab" data-tab="spiritual" style="${useInlineStyles ? 'padding: 10px 15px; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; color: #6B7280;' : ''}">Caminho Espiritual</button>
    </div>
    
    <div id="tab-content">
      <div id="overview-tab" class="matrix-tab-content">
        <div id="matrix-numbers" style="${useInlineStyles ? 'display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 15px;' : ''}">
          <!-- Será preenchido pelo JavaScript -->
        </div>
      </div>
      
      <div id="personal-tab" class="matrix-tab-content" style="${useInlineStyles ? 'display: none;' : 'display: none;'}">
        <!-- Será preenchido pelo JavaScript -->
      </div>
      
      <div id="spiritual-tab" class="matrix-tab-content" style="${useInlineStyles ? 'display: none;' : 'display: none;'}">
        <!-- Será preenchido pelo JavaScript -->
      </div>
    </div>
  </div>
  
  ${includeDebugInfo ? `
  <!-- Seção de Debug (visível apenas durante testes) -->
  <div id="debug-section" style="${useInlineStyles ? 'margin-top: 30px; background-color: #f0f0f0; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px; display: none;' : 'display: none;'}">
    <h3 style="${useInlineStyles ? 'margin-top: 0; font-size: 14px;' : ''}">Debug Info</h3>
    <div id="debug-log" style="${useInlineStyles ? 'max-height: 200px; overflow-y: auto;' : ''}"></div>
  </div>
  ` : ''}
</div>

<!-- JAVASCRIPT: COLOQUE ESTE CÓDIGO EM UM WIDGET DE HTML DEDICADO APENAS AO JAVASCRIPT -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Elementos da página
  const loginForm = document.getElementById('login-form');
  const profileForm = document.getElementById('profile-form');
  const matrixResult = document.getElementById('matrix-result');
  const loginButton = document.getElementById('login-button');
  const calculateButton = document.getElementById('calculate-button');
  const backButton = document.getElementById('back-button');
  const emailInput = document.getElementById('email-input');
  const nameInput = document.getElementById('name-input');
  const birthdateInput = document.getElementById('birthdate-input');
  const loginMessage = document.getElementById('login-message');
  const matrixTabs = document.querySelectorAll('.matrix-tab');
  const tabContents = document.querySelectorAll('.matrix-tab-content');
  const debugSection = document.getElementById('debug-section');
  const debugLog = document.getElementById('debug-log');
  
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
  
  // Função para log com debug
  function log(message, data) {
    // Sempre registra no console
    console.log('[Matriz Kármica]', message, data || '');
    
    // Se temos a seção de debug, mostramos lá também
    if (debugSection && debugLog) {
      debugSection.style.display = 'block';
      const entry = document.createElement('div');
      entry.innerHTML = \`<strong>\${new Date().toISOString().substr(11, 8)}:</strong> \${message} \${data ? JSON.stringify(data) : ''}\`;
      debugLog.appendChild(entry);
      debugLog.scrollTop = debugLog.scrollHeight;
    }
  }
  
  log('Inicializando aplicativo da Matriz Kármica');
  
  // Formatar e validar data
  if (birthdateInput) {
    birthdateInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^\\d\\/]/g, '');
      
      if (value.length > 2 && value.charAt(2) !== '/') {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      if (value.length > 5 && value.charAt(5) !== '/') {
        value = value.substring(0, 5) + '/' + value.substring(5);
      }
      
      if (value.length > 10) value = value.substring(0, 10);
      
      e.target.value = value;
    });
  }
  
  // Função para mostrar mensagem
  function showMessage(message, isError) {
    if (loginMessage) {
      loginMessage.textContent = message;
      loginMessage.style.display = 'block';
      if (isError) {
        loginMessage.style.backgroundColor = '#FEE2E2';
        loginMessage.style.color = '#991B1B';
      } else {
        loginMessage.style.backgroundColor = '#DCFCE7';
        loginMessage.style.color = '#166534';
      }
      
      // Ocultar após 5 segundos
      setTimeout(() => {
        loginMessage.style.display = 'none';
      }, 5000);
    }
    
    log(message, { isError });
  }
  
  // Verificar login
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      const email = emailInput.value.toLowerCase().trim();
      
      if (!email) {
        showMessage('Por favor, informe seu email', true);
        return;
      }
      
      log('Tentando login com:', email);
      
      // Verificar se o email está autorizado
      const isAuthorized = authorizedEmails.some(authEmail => 
        authEmail.toLowerCase().trim() === email
      );
      
      if (!isAuthorized) {
        log('Email não autorizado:', email);
        showMessage('Este email não está autorizado para acessar a matriz', true);
        return;
      }
      
      // Verificar se o usuário já tem perfil no localStorage
      try {
        const userData = localStorage.getItem('matrizUser_' + email);
        
        if (userData) {
          // Já tem dados, mostrar a matriz
          const user = JSON.parse(userData);
          log('Usuário tem perfil salvo:', user);
          
          if (user.name && user.birthdate) {
            // Mostrar matriz
            loginForm.style.display = 'none';
            profileForm.style.display = 'none';
            matrixResult.style.display = 'block';
            
            // Criar matriz
            createMatrix(user);
            return;
          }
        }
        
        // Se chegou aqui, não tem perfil completo
        log('Usuário autorizado, mas sem perfil completo');
        showMessage('Email verificado com sucesso!', false);
        
        // Armazenar o email atual
        localStorage.setItem('currentMatrixEmail', email);
        
        // Mostrar formulário de perfil
        loginForm.style.display = 'none';
        profileForm.style.display = 'block';
        
      } catch (error) {
        log('Erro ao verificar dados do usuário:', error);
        showMessage('Ocorreu um erro. Por favor, tente novamente.', true);
      }
    });
  }
  
  // Cálculo da matriz
  if (calculateButton) {
    calculateButton.addEventListener('click', function() {
      const name = nameInput.value.trim();
      const birthdate = birthdateInput.value.trim();
      const email = localStorage.getItem('currentMatrixEmail');
      
      if (!email) {
        showMessage('Sessão expirada. Por favor, faça login novamente.', true);
        profileForm.style.display = 'none';
        loginForm.style.display = 'block';
        return;
      }
      
      if (!name) {
        showMessage('Por favor, informe seu nome completo', true);
        return;
      }
      
      if (!birthdate) {
        showMessage('Por favor, informe sua data de nascimento', true);
        return;
      }
      
      // Validar formato da data
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\\/\\d{4}$/;
      if (!datePattern.test(birthdate)) {
        showMessage('Formato de data inválido. Use DD/MM/AAAA', true);
        return;
      }
      
      // Validar se a data existe
      const [day, month, year] = birthdate.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        showMessage('Data inválida. Verifique se a data existe no calendário.', true);
        return;
      }
      
      log('Calculando matriz para:', { name, birthdate, email });
      
      // Gerar números da matriz
      const karmicNumbers = generateKarmicNumbers(birthdate);
      
      // Salvar dados do usuário
      const userData = {
        name,
        birthdate,
        email,
        karmicNumbers,
        createdAt: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('matrizUser_' + email, JSON.stringify(userData));
        log('Dados do usuário salvos:', userData);
        
        // Mostrar a matriz
        profileForm.style.display = 'none';
        matrixResult.style.display = 'block';
        
        // Criar interface da matriz
        createMatrix(userData);
        
      } catch (error) {
        log('Erro ao salvar dados:', error);
        showMessage('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.', true);
      }
    });
  }
  
  // Voltar para tela de login
  if (backButton) {
    backButton.addEventListener('click', function() {
      matrixResult.style.display = 'none';
      loginForm.style.display = 'block';
      localStorage.removeItem('currentMatrixEmail');
    });
  }
  
  // Navegação entre abas
  if (matrixTabs.length > 0) {
    matrixTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        log('Trocando para aba:', tabName);
        
        // Remover classe active de todas as abas
        matrixTabs.forEach(t => {
          t.classList.remove('active');
          if (t.style) {
            t.style.borderBottomColor = 'transparent';
            t.style.color = '#6B7280';
          }
        });
        
        // Adicionar classe active na aba clicada
        this.classList.add('active');
        if (this.style) {
          this.style.borderBottomColor = '#6D28D9';
          this.style.color = '#6D28D9';
        }
        
        // Ocultar todos os conteúdos
        tabContents.forEach(content => {
          content.style.display = 'none';
        });
        
        // Mostrar conteúdo da aba selecionada
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
          selectedTab.style.display = 'block';
        }
      });
    });
  }
  
  // Função para gerar números da matriz
  function generateKarmicNumbers(birthdate) {
    log('Gerando números para data:', birthdate);
    
    const [day, month, year] = birthdate.split('/').map(Number);
    
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
      spiritualMark: reduceToSingleDigit(yearNum + monthNum)
    };
    
    log('Números gerados:', numbers);
    return numbers;
  }
  
  // Função para reduzir a um dígito
  function reduceToSingleDigit(num) {
    if (num <= 9) return num;
    
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    
    return reduceToSingleDigit(sum);
  }
  
  // Função para criar a matriz na interface
  function createMatrix(userData) {
    log('Criando interface da matriz para:', userData.name);
    
    const matrixNumbers = document.getElementById('matrix-numbers');
    if (!matrixNumbers) {
      log('Elemento matrix-numbers não encontrado');
      return;
    }
    
    matrixNumbers.innerHTML = '';
    
    // Criar cards para cada número
    const numbers = [
      { name: 'Selo Kármico', value: userData.karmicNumbers.karmicSeal },
      { name: 'Chamado do Destino', value: userData.karmicNumbers.destinyCall },
      { name: 'Portal Kármico', value: userData.karmicNumbers.karmaPortal },
      { name: 'Herança Kármica', value: userData.karmicNumbers.karmicInheritance },
      { name: 'Reprogramação', value: userData.karmicNumbers.karmicReprogramming },
      { name: 'Marca Espiritual', value: userData.karmicNumbers.spiritualMark }
    ];
    
    numbers.forEach(num => {
      const card = document.createElement('div');
      card.style.backgroundColor = '#F5F3FF';
      card.style.borderRadius = '8px';
      card.style.padding = '15px';
      card.style.textAlign = 'center';
      card.style.border = '1px solid #E5E7EB';
      
      card.innerHTML = \`
        <h3 style="font-size: 16px; color: #5B21B6; margin-bottom: 10px;">\${num.name}</h3>
        <p style="font-size: 28px; font-weight: bold; color: #6D28D9; margin: 0;">\${num.value}</p>
      \`;
      
      matrixNumbers.appendChild(card);
    });
    
    // Criar conteúdo das abas
    const personalTab = document.getElementById('personal-tab');
    if (personalTab) {
      personalTab.innerHTML = \`
        <h3 style="color: #5B21B6; margin-bottom: 15px;">Sua Missão Pessoal</h3>
        <p>Seu número de Chamado do Destino (\${userData.karmicNumbers.destinyCall}) revela sua missão nesta vida.</p>
        <p>Este número indica seus talentos e o caminho que deve seguir para realizar seu potencial máximo.</p>
      \`;
    }
    
    const spiritualTab = document.getElementById('spiritual-tab');
    if (spiritualTab) {
      spiritualTab.innerHTML = \`
        <h3 style="color: #5B21B6; margin-bottom: 15px;">Seu Caminho Espiritual</h3>
        <p>Sua Herança Kármica (\${userData.karmicNumbers.karmicInheritance}) e Marca Espiritual (\${userData.karmicNumbers.spiritualMark}) revelam sua jornada de alma.</p>
        <p>Estes números mostram os aprendizados que sua alma busca nesta encarnação e como acessar sua sabedoria interior.</p>
      \`;
    }
  }
  
  // Verificar se já existe um usuário com perfil
  try {
    // Tentar recuperar o email salvo de sessões anteriores
    const currentEmail = localStorage.getItem('currentMatrixEmail');
    if (currentEmail) {
      log('Email encontrado em localStorage:', currentEmail);
      
      const userData = localStorage.getItem('matrizUser_' + currentEmail);
      if (userData) {
        const user = JSON.parse(userData);
        
        if (user.name && user.birthdate) {
          log('Usuário tem perfil completo, mostrando matriz diretamente');
          loginForm.style.display = 'none';
          profileForm.style.display = 'none';
          matrixResult.style.display = 'block';
          
          // Criar matriz
          createMatrix(user);
          return;
        }
      }
      
      // Se tem email mas não tem perfil completo
      log('Usuário tem email mas sem perfil completo');
      loginForm.style.display = 'none';
      profileForm.style.display = 'block';
    }
  } catch (error) {
    log('Erro ao verificar dados salvos:', error);
  }
});
</script>

<!-- CSS: OPCIONAL - COLOQUE ESTE CSS EM UM WIDGET DE CÓDIGO PERSONALIZADO NO ELEMENTOR SE NÃO ESTIVER USANDO ESTILOS INLINE -->
<style>
.matrix-tab-content {
  display: none;
}

.matrix-tab-content:first-child {
  display: block;
}

/* Estilos para responsividade em mobile */
@media (max-width: 767px) {
  #matrix-tabs {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }
  
  #matrix-numbers {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
    `;

    // Criar um blob para download
    const blob = new Blob([elementorHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Criar um link temporário para download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matriz-karmica-elementor-simples.html';
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    }, 500);

    toast.success("HTML básico para Elementor exportado com sucesso!");
  };

  const copyElementorCode = async () => {
    try {
      setCopied(false);
      
      // Add more authorized emails for testing
      const additionalTestEmails = isTestingMode ? 
        `'usuario-teste@gmail.com',
        'teste123@hotmail.com',
        'matrix-test@yahoo.com',` : '';

      const elementorHTML = `
<!-- WIDGET HTML PARA ELEMENTOR - COLOQUE ESTE CÓDIGO EM UM WIDGET HTML -->

<div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
  <!-- Formulário de Login -->
  <div id="login-form" style="background-color: #f9f7ff; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #6D28D9; text-align: center; margin-bottom: 25px; font-size: 24px;">Acesse sua Matriz Kármica</h2>
    
    <div style="margin-bottom: 20px;">
      <label for="email-input" style="display: block; margin-bottom: 8px; font-weight: bold;">Email de Compra</label>
      <input 
        type="email" 
        id="email-input" 
        placeholder="Seu email de compra" 
        style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 5px; font-size: 16px; box-sizing: border-box;"
      />
      <p style="font-size: 14px; color: #6B7280; margin-top: 5px;">Informe o mesmo email utilizado na compra</p>
    </div>
    
    <button 
      id="login-button" 
      style="display: block; width: 100%; padding: 12px; background-color: #6D28D9; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 16px;"
    >
      Acessar Minha Matriz
    </button>
    
    <div id="login-message" style="margin-top: 15px; padding: 10px; border-radius: 5px; display: none; text-align: center;"></div>
  </div>
  
  <!-- Formulário de Perfil (inicialmente oculto) -->
  <div id="profile-form" style="background-color: #f9f7ff; border-radius: 10px; padding: 30px; margin-bottom: 20px; display: none;">
    <h2 style="color: #6D28D9; text-align: center; margin-bottom: 25px; font-size: 24px;">Complete seu Perfil</h2>
    
    <div style="margin-bottom: 20px;">
      <label for="name-input" style="display: block; margin-bottom: 8px; font-weight: bold;">Nome Completo</label>
      <input 
        type="text" 
        id="name-input" 
        placeholder="Seu nome completo" 
        style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 5px; font-size: 16px; box-sizing: border-box;"
      />
    </div>
    
    <div style="margin-bottom: 20px;">
      <label for="birthdate-input" style="display: block; margin-bottom: 8px; font-weight: bold;">Data de Nascimento</label>
      <input 
        type="text" 
        id="birthdate-input" 
        placeholder="DD/MM/AAAA" 
        style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 5px; font-size: 16px; box-sizing: border-box;"
      />
      <p style="font-size: 14px; color: #6B7280; margin-top: 5px;">Formato: dia/mês/ano (ex: 15/07/1985)</p>
    </div>
    
    <button 
      id="calculate-button" 
      style="display: block; width: 100%; padding: 12px; background-color: #6D28D9; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 16px;"
    >
      Calcular Minha Matriz
    </button>
  </div>
</div>
`;

      await navigator.clipboard.writeText(elementorHTML);
      setCopied(true);
      toast.success("Código HTML copiado para a área de transferência!");
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error("Erro ao copiar: " + err.message);
    }
  };
  
  const copyJavaScriptCode = async () => {
    try {
      setCopied(false);
      
      // Add more authorized emails for testing
      const additionalTestEmails = isTestingMode ? 
        `'usuario-teste@gmail.com',
        'teste123@hotmail.com',
        'matrix-test@yahoo.com',` : '';

      const scriptCode = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Elementos da página
  const loginForm = document.getElementById('login-form');
  const profileForm = document.getElementById('profile-form');
  const matrixResult = document.getElementById('matrix-result');
  const loginButton = document.getElementById('login-button');
  const calculateButton = document.getElementById('calculate-button');
  const backButton = document.getElementById('back-button');
  const emailInput = document.getElementById('email-input');
  const nameInput = document.getElementById('name-input');
  const birthdateInput = document.getElementById('birthdate-input');
  const loginMessage = document.getElementById('login-message');
  const matrixTabs = document.querySelectorAll('.matrix-tab');
  const tabContents = document.querySelectorAll('.matrix-tab-content');
  
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
  
  // Função para log com debug
  function log(message, data) {
    console.log('[Matriz Kármica]', message, data || '');
  }
  
  log('Inicializando aplicativo da Matriz Kármica');
  
  // Formatar e validar data
  if (birthdateInput) {
    birthdateInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^\\d\\/]/g, '');
      
      if (value.length > 2 && value.charAt(2) !== '/') {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      if (value.length > 5 && value.charAt(5) !== '/') {
        value = value.substring(0, 5) + '/' + value.substring(5);
      }
      
      if (value.length > 10) value = value.substring(0, 10);
      
      e.target.value = value;
    });
  }
  
  // Função para mostrar mensagem
  function showMessage(message, isError) {
    if (loginMessage) {
      loginMessage.textContent = message;
      loginMessage.style.display = 'block';
      if (isError) {
        loginMessage.style.backgroundColor = '#FEE2E2';
        loginMessage.style.color = '#991B1B';
      } else {
        loginMessage.style.backgroundColor = '#DCFCE7';
        loginMessage.style.color = '#166534';
      }
      
      // Ocultar após 5 segundos
      setTimeout(() => {
        loginMessage.style.display = 'none';
      }, 5000);
    }
    
    log(message, { isError });
  }
  
  // Verificar login
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      const email = emailInput.value.toLowerCase().trim();
      
      if (!email) {
        showMessage('Por favor, informe seu email', true);
        return;
      }
      
      log('Tentando login com:', email);
      
      // Verificar se o email está autorizado
      const isAuthorized = authorizedEmails.some(authEmail => 
        authEmail.toLowerCase().trim() === email
      );
      
      if (!isAuthorized) {
        log('Email não autorizado:', email);
        showMessage('Este email não está autorizado para acessar a matriz', true);
        return;
      }
      
      // Verificar se o usuário já tem perfil no localStorage
      try {
        const userData = localStorage.getItem('matrizUser_' + email);
        
        if (userData) {
          // Já tem dados, mostrar a matriz
          const user = JSON.parse(userData);
          log('Usuário tem perfil salvo:', user);
          
          if (user.name && user.birthdate) {
            // Mostrar matriz
            loginForm.style.display = 'none';
            profileForm.style.display = 'none';
            matrixResult.style.display = 'block';
            
            // Criar matriz
            createMatrix(user);
            return;
          }
        }
        
        // Se chegou aqui, não tem perfil completo
        log('Usuário autorizado, mas sem perfil completo');
        showMessage('Email verificado com sucesso!', false);
        
        // Armazenar o email atual
        localStorage.setItem('currentMatrixEmail', email);
        
        // Mostrar formulário de perfil
        loginForm.style.display = 'none';
        profileForm.style.display = 'block';
        
      } catch (error) {
        log('Erro ao verificar dados do usuário:', error);
        showMessage('Ocorreu um erro. Por favor, tente novamente.', true);
      }
    });
  }
  
  // Cálculo da matriz
  if (calculateButton) {
    calculateButton.addEventListener('click', function() {
      const name = nameInput.value.trim();
      const birthdate = birthdateInput.value.trim();
      const email = localStorage.getItem('currentMatrixEmail');
      
      if (!email) {
        showMessage('Sessão expirada. Por favor, faça login novamente.', true);
        profileForm.style.display = 'none';
        loginForm.style.display = 'block';
        return;
      }
      
      if (!name) {
        showMessage('Por favor, informe seu nome completo', true);
        return;
      }
      
      if (!birthdate) {
        showMessage('Por favor, informe sua data de nascimento', true);
        return;
      }
      
      // Validar formato da data
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\\/\\d{4}$/;
      if (!datePattern.test(birthdate)) {
        showMessage('Formato de data inválido. Use DD/MM/AAAA', true);
        return;
      }
      
      // Validar se a data existe
      const [day, month, year] = birthdate.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        showMessage('Data inválida. Verifique se a data existe no calendário.', true);
        return;
      }
      
      log('Calculando matriz para:', { name, birthdate, email });
      
      // Gerar números da matriz
      const karmicNumbers = generateKarmicNumbers(birthdate);
      
      // Salvar dados do usuário
      const userData = {
        name,
        birthdate,
        email,
        karmicNumbers,
        createdAt: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('matrizUser_' + email, JSON.stringify(userData));
        log('Dados do usuário salvos:', userData);
        
        // Mostrar a matriz
        profileForm.style.display = 'none';
        matrixResult.style.display = 'block';
        
        // Criar interface da matriz
        createMatrix(userData);
        
      } catch (error) {
        log('Erro ao salvar dados:', error);
        showMessage('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.', true);
      }
    });
  }
  
  // Voltar para tela de login
  if (backButton) {
    backButton.addEventListener('click', function() {
      matrixResult.style.display = 'none';
      loginForm.style.display = 'block';
      localStorage.removeItem('currentMatrixEmail');
    });
  }
  
  // Navegação entre abas
  if (matrixTabs.length > 0) {
    matrixTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        log('Trocando para aba:', tabName);
        
        // Remover classe active de todas as abas
        matrixTabs.forEach(t => {
          t.classList.remove('active');
          if (t.style) {
            t.style.borderBottomColor = 'transparent';
            t.style.color = '#6B7280';
          }
        });
        
        // Adicionar classe active na aba clicada
        this.classList.add('active');
        if (this.style) {
          this.style.borderBottomColor = '#6D28D9';
          this.style.color = '#6D28D9';
        }
        
        // Ocultar todos os conteúdos
        tabContents.forEach(content => {
          content.style.display = 'none';
        });
        
        // Mostrar conteúdo da aba selecionada
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
          selectedTab.style.display = 'block';
        }
      });
    });
  }
  
  // Função para gerar números da matriz
  function generateKarmicNumbers(birthdate) {
    log('Gerando números para data:', birthdate);
    
    const [day, month, year] = birthdate.split('/').map(Number);
    
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
      spiritualMark: reduceToSingleDigit(yearNum + monthNum)
    };
    
    log('Números gerados:', numbers);
    return numbers;
  }
  
  // Função para reduzir a um dígito
  function reduceToSingleDigit(num) {
    if (num <= 9) return num;
    
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    
    return reduceToSingleDigit(sum);
  }
  
  // Função para criar a matriz na interface
  function createMatrix(userData) {
    log('Criando interface da matriz para:', userData.name);
    
    const matrixNumbers = document.getElementById('matrix-numbers');
    if (!matrixNumbers) {
      log('Elemento matrix-numbers não encontrado');
      return;
    }
    
    matrixNumbers.innerHTML = '';
    
    // Criar cards para cada número
    const numbers = [
      { name: 'Selo Kármico', value: userData.karmicNumbers.karmicSeal },
      { name: 'Chamado do Destino', value: userData.karmicNumbers.destinyCall },
      { name: 'Portal Kármico', value: userData.karmicNumbers.karmaPortal },
      { name: 'Herança Kármica', value: userData.karmicNumbers.karmicInheritance },
      { name: 'Reprogramação', value: userData.karmicNumbers.karmicReprogramming },
      { name: 'Marca Espiritual', value: userData.karmicNumbers.spiritualMark }
    ];
    
    numbers.forEach(num => {
      const card = document.createElement('div');
      card.style.backgroundColor = '#F5F3FF';
      card.style.borderRadius = '8px';
      card.style.padding = '15px';
      card.style.textAlign = 'center';
      card.style.border = '1px solid #E5E7EB';
      
      card.innerHTML = \`
        <h3 style="font-size: 16px; color: #5B21B6; margin-bottom: 10px;">\${num.name}</h3>
        <p style="font-size: 28px; font-weight: bold; color: #6D28D9; margin: 0;">\${num.value}</p>
      \`;
      
      matrixNumbers.appendChild(card);
    });
    
    // Criar conteúdo das abas
    const personalTab = document.getElementById('personal-tab');
    if (personalTab) {
      personalTab.innerHTML = \`
        <h3 style="color: #5B21B6; margin-bottom: 15px;">Sua Missão Pessoal</h3>
        <p>Seu número de Chamado do Destino (\${userData.karmicNumbers.destinyCall}) revela sua missão nesta vida.</p>
        <p>Este número indica seus talentos e o caminho que deve seguir para realizar seu potencial máximo.</p>
      \`;
    }
    
    const spiritualTab = document.getElementById('spiritual-tab');
    if (spiritualTab) {
      spiritualTab.innerHTML = \`
        <h3 style="color: #5B21B6; margin-bottom: 15px;">Seu Caminho Espiritual</h3>
        <p>Sua Herança Kármica (\${userData.karmicNumbers.karmicInheritance}) e Marca Espiritual (\${userData.karmicNumbers.spiritualMark}) revelam sua jornada de alma.</p>
        <p>Estes números mostram os aprendizados que sua alma busca nesta encarnação e como acessar sua sabedoria interior.</p>
      \`;
    }
  }
  
  // Verificar se já existe um usuário com perfil
  try {
    // Tentar recuperar o email salvo de sessões anteriores
    const currentEmail = localStorage.getItem('currentMatrixEmail');
    if (currentEmail) {
      log('Email encontrado em localStorage:', currentEmail);
      
      const userData = localStorage.getItem('matrizUser_' + currentEmail);
      if (userData) {
        const user = JSON.parse(userData);
        
        if (user.name && user.birthdate) {
          log('Usuário tem perfil completo, mostrando matriz diretamente');
          loginForm.style.display = 'none';
          profileForm.style.display = 'none';
          matrixResult.style.display = 'block';
          
          // Criar matriz
          createMatrix(user);
          return;
        }
      }
      
      // Se tem email mas não tem perfil completo
      log('Usuário tem email mas sem perfil completo');
      loginForm.style.display = 'none';
      profileForm.style.display = 'block';
    }
  } catch (error) {
    log('Erro ao verificar dados salvos:', error);
  }
});
</script>
`;

      await navigator.clipboard.writeText(scriptCode);
      setCopied(true);
      toast.success("Código JavaScript copiado para a área de transferência!");
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error("Erro ao copiar: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Exportação Simplificada para Elementor</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Uso</CardTitle>
          <CardDescription>
            Como implementar a versão simplificada da Matriz Kármica no seu site WordPress com Elementor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="font-medium text-amber-800 mb-2">Guia Rápido</h3>
            <ol className="list-decimal pl-5 text-amber-700 space-y-2 text-sm">
              <li>Copie o <strong>Código HTML</strong> e cole em um widget HTML do Elementor</li>
              <li>Copie o <strong>Código JavaScript</strong> e cole em <strong>outro</strong> widget HTML do Elementor (na mesma página)</li>
              <li>Clique em <strong>PUBLICAR</strong> ou <strong>ATUALIZAR</strong> no Elementor</li>
              <li>Teste o funcionamento acessando a página publicada</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="testing-mode">Modo de Teste</Label>
                <p className="text-sm text-muted-foreground">
                  Adiciona emails de teste na lista de autorizados
                </p>
              </div>
              <Switch
                id="testing-mode"
                checked={isTestingMode}
                onCheckedChange={setIsTestingMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-info">Incluir Informações de Debug</Label>
                <p className="text-sm text-muted-foreground">
                  Adiciona uma seção de debug para facilitar a solução de problemas
                </p>
              </div>
              <Switch
                id="debug-info"
                checked={includeDebugInfo}
                onCheckedChange={setIncludeDebugInfo}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inline-styles">Usar Estilos Inline</Label>
                <p className="text-sm text-muted-foreground">
                  Aplica estilos diretamente nos elementos HTML
                </p>
              </div>
              <Switch
                id="inline-styles"
                checked={useInlineStyles}
                onCheckedChange={setUseInlineStyles}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Button
              onClick={copyElementorCode}
              className="w-full bg-blue-600 hover:bg-blue-700"
              variant="secondary"
            >
              {copied ? <CheckCircle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              Copiar Código HTML
            </Button>
            
            <Button
              onClick={copyJavaScriptCode}
              className="w-full bg-green-600 hover:bg-green-700"
              variant="secondary"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar Código JavaScript
            </Button>
            
            <Button
              onClick={generateBasicElementorHTML}
              className="w-full sm:col-span-2 bg-purple-700 hover:bg-purple-800"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>Gerando...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Baixar Arquivo Completo
                </>
              )}
            </Button>
          </div>
          
          <p className="text-sm text-center text-gray-500 mt-2">
            Após adicionar o código no Elementor, clique em "Publicar" ou "Atualizar" para aplicar as mudanças!
          </p>
        </CardFooter>
      </Card>
      
      <div className="text-sm text-karmic-600 p-4 bg-karmic-50 rounded-md">
        <h3 className="font-medium mb-2">Importante: Passo a Passo</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            Use o botão <strong>Copiar Código HTML</strong> e cole em um widget HTML no Elementor
          </li>
          <li>
            Use o botão <strong>Copiar Código JavaScript</strong> e cole em OUTRO widget HTML no Elementor
          </li>
          <li>
            Posicione os dois widgets um após o outro na sua página
          </li>
          <li>
            Clique em <strong>PUBLICAR</strong> ou <strong>ATUALIZAR</strong> no Elementor
          </li>
          <li>
            O código foi feito para ser extremamente simples e usar estilos inline para evitar conflitos com temas
          </li>
        </ol>
      </div>
    </div>
  );
};
