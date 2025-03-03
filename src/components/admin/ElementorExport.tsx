
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ElementorExport = () => {
  const generateLoginHTML = () => {
    const html = `
<!-- Coloque este HTML em um widget HTML do Elementor -->
<div class="matriz-login-container">
  <h2 style="text-align: center; color: #5e5243; font-size: 24px; margin-bottom: 20px;">
    Acesse sua Matriz Kármica
  </h2>
  
  <div class="login-form">
    <div class="form-group">
      <label style="display: block; margin-bottom: 8px; color: #5e5243;">
        Email de Compra
      </label>
      <input 
        type="email" 
        id="matriz-email-input"
        style="width: 100%; padding: 10px; border: 1px solid #e9e5df; border-radius: 6px; margin-bottom: 8px;"
        placeholder="Seu email de compra"
      />
      <p style="font-size: 14px; color: #7d6e5c; margin-bottom: 20px;">
        Informe o mesmo email utilizado na compra
      </p>
    </div>
    
    <button 
      id="matriz-login-button"
      style="width: 100%; background-color: #7d6e5c; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;"
    >
      Acessar Minha Matriz
    </button>
  </div>
</div>`;

    const js = `
<!-- Coloque este código em um widget HTML separado, logo após o widget do formulário -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const loginButton = document.getElementById('matriz-login-button');
  const emailInput = document.getElementById('matriz-email-input');
  
  // Emails autorizados
  const authorizedEmails = [
    'projetovmtd@gmail.com',
    'teste@teste.com',
    'carlamaiaprojetos@gmail.com',
    'mariaal020804@gmail.com',
    'tesete@testelcom.br'
  ];
  
  if (loginButton && emailInput) {
    loginButton.addEventListener('click', function() {
      const email = emailInput.value.toLowerCase().trim();
      
      if (!email) {
        alert('Por favor, insira seu email de compra');
        return;
      }
      
      console.log('Tentando login com:', email);
      console.log('Emails autorizados:', authorizedEmails);
      
      if (authorizedEmails.includes(email)) {
        console.log('Email autorizado, salvando...');
        localStorage.setItem('currentUser', email);
        
        // Verificar se já existe um perfil
        const userData = localStorage.getItem('userData');
        const userProfiles = userData ? JSON.parse(userData) : {};
        
        if (userProfiles[email] && userProfiles[email].name) {
          // Usuário já tem perfil, mostrar matriz
          window.location.href = '/matriz-karmica';
        } else {
          // Usuário precisa criar perfil
          window.location.href = '/perfil-karmica';
        }
      } else {
        alert('Este email não está autorizado a acessar a matriz');
      }
    });
  } else {
    console.error('Elementos do formulário não encontrados');
  }
});
</script>`;

    return { html, js };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const { html, js } = generateLoginHTML();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar para Elementor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="html">
          <TabsList className="w-full">
            <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
            <TabsTrigger value="js" className="flex-1">JavaScript</TabsTrigger>
          </TabsList>
          
          <TabsContent value="html" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{html}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(html)}
              className="w-full"
            >
              Copiar HTML
            </Button>
          </TabsContent>
          
          <TabsContent value="js" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{js}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(js)}
              className="w-full"
            >
              Copiar JavaScript
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-medium text-yellow-800 mb-2">Instruções de Instalação:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
            <li>Crie dois widgets HTML no Elementor</li>
            <li>No primeiro widget, cole o código HTML</li>
            <li>No segundo widget, logo abaixo, cole o código JavaScript</li>
            <li>Não modifique os IDs dos elementos no HTML</li>
            <li>Publique a página e teste o login</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementorExport;
