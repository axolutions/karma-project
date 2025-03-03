
import React from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ElementorExport = () => {
  const navigate = useNavigate();

  const generateElementorHTML = () => {
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
  
  // Tabs da matriz
  const tabButtons = document.querySelectorAll('.matriz-tab');
  const tabContents = document.querySelectorAll('.matriz-tab-content');
  
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
    }
  } catch (e) {
    console.error('Erro ao carregar dados salvos:', e);
  }
  
  // Função para salvar dados
  function saveUserData() {
    localStorage.setItem('matrizKarmica', JSON.stringify(userData));
  }
  
  // Função para gerar números kármicos com base na data
  function generateKarmicNumbers(birthdate) {
    // Extrair dia, mês e ano
    const parts = birthdate.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Cálculos numerológicos básicos
    const dayNum = day;
    const monthNum = month;
    const yearNum = reduceToSingleDigit(year);
    const fullDateNum = reduceToSingleDigit(day + month + yearNum);
    
    return {
      karmicSeal: reduceToSingleDigit(dayNum + monthNum),
      destinyCall: reduceToSingleDigit(fullDateNum + dayNum),
      karmaPortal: reduceToSingleDigit(monthNum + yearNum),
      karmicInheritance: reduceToSingleDigit(dayNum + yearNum),
      karmicReprogramming: reduceToSingleDigit(fullDateNum * 2),
      cycleProphecy: reduceToSingleDigit(dayNum * monthNum),
      spiritualMark: reduceToSingleDigit(yearNum + monthNum),
      manifestationEnigma: reduceToSingleDigit(dayNum + monthNum + yearNum)
    };
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
    matrixGrid.innerHTML = '';
    
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
    // Aba Pessoal
    const personalTab = document.getElementById('personal-tab');
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
    
    // Aba Espiritual
    const spiritualTab = document.getElementById('spiritual-tab');
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
    
    // Aba Desafios
    const challengesTab = document.getElementById('challenges-tab');
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
  }
  
  // Login (verificação de email)
  loginBtn.addEventListener('click', function() {
    const email = emailInput.value.toLowerCase().trim();
    
    if (!email) {
      alert('Por favor, informe seu email');
      return;
    }
    
    // Em um sistema real, aqui verificaríamos se o email está autorizado
    // Para este exemplo, permitimos qualquer email
    userData.currentEmail = email;
    
    // Verificar se o usuário já tem perfil
    if (userData.users[email] && userData.users[email].name) {
      // Já tem perfil, mostrar matriz
      loginPage.style.display = 'none';
      profilePage.style.display = 'none';
      matrixPage.style.display = 'block';
      
      // Criar exibição da matriz
      createMatrixDisplay(userData.users[email].karmicNumbers);
    } else {
      // Não tem perfil, ir para página de perfil
      loginPage.style.display = 'none';
      profilePage.style.display = 'block';
      matrixPage.style.display = 'none';
    }
    
    saveUserData();
  });
  
  // Formulário de Perfil
  calcBtn.addEventListener('click', function() {
    const name = nameInput.value.trim();
    const birthdate = birthdateInput.value.trim();
    const email = userData.currentEmail;
    
    if (!name) {
      alert('Por favor, informe seu nome');
      return;
    }
    
    if (!birthdate) {
      alert('Por favor, informe sua data de nascimento');
      return;
    }
    
    // Validar data no formato DD/MM/AAAA
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\\d{4}$/;
    if (!datePattern.test(birthdate)) {
      alert('Por favor, informe uma data válida no formato DD/MM/AAAA');
      return;
    }
    
    // Calcular números kármicos
    const karmicNumbers = generateKarmicNumbers(birthdate);
    
    // Salvar dados do usuário
    userData.users[email] = {
      name: name,
      birthdate: birthdate,
      karmicNumbers: karmicNumbers
    };
    
    saveUserData();
    
    // Mostrar a matriz
    profilePage.style.display = 'none';
    matrixPage.style.display = 'block';
    
    // Criar interface da matriz
    createMatrixDisplay(karmicNumbers);
  });
  
  // Voltar para o login
  backBtn.addEventListener('click', function() {
    matrixPage.style.display = 'none';
    loginPage.style.display = 'block';
  });
  
  // Navegação entre abas
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
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
      }
    });
  });
  
  // Verificar se já havia um usuário logado
  if (userData.currentEmail && userData.users[userData.currentEmail]?.name) {
    loginPage.style.display = 'none';
    matrixPage.style.display = 'block';
    createMatrixDisplay(userData.users[userData.currentEmail].karmicNumbers);
  }
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
    }, 0);

    toast.success("HTML para Elementor exportado com sucesso!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Exportação para Elementor</h2>
      <p className="mb-4 text-gray-700">
        Exporte um arquivo HTML otimizado para ser usado com o widget HTML do Elementor.
      </p>
      <p className="mb-6 text-gray-600 text-sm">
        Depois de baixar o arquivo HTML, siga estas etapas:
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Abra o arquivo em um editor de texto (como Bloco de Notas, VS Code)</li>
          <li>Copie todo o código</li>
          <li>No WordPress, adicione um widget "HTML" do Elementor à sua página</li>
          <li>Cole o código no widget HTML</li>
          <li>Configure as seções de CSS e JavaScript do Elementor conforme indicado nos comentários</li>
        </ol>
      </p>
      <Button 
        onClick={generateElementorHTML}
        className="w-full bg-purple-700 hover:bg-purple-800"
      >
        <Download className="mr-2 h-4 w-4" /> Baixar HTML para Elementor
      </Button>
    </div>
  );
};
