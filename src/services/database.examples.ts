/**
 * EXEMPLOS DE USO DO NOVO SISTEMA SQLITE
 * 
 * Este arquivo demonstra como usar o serviço de database
 * em diferentes cenários do aplicativo.
 */

import { Programa } from './auth';
import {
    clearAllData,
    getAuthToken,
    getMenuPrograms,
    getPrograms,
    getSetting,
    getUserData,
    removeAuthToken,
    saveAuthToken,
    savePrograms,
    saveUserData,
    setSetting,
} from './database';

// ========================================
// EXEMPLO 1: Login e Salvamento de Dados
// ========================================

export async function exemploLogin() {
  // Após autenticação bem-sucedida, salvar dados:
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  const userData = {
    id: '123',
    nome: 'João Silva',
    email: 'joao@exemplo.com',
  };
  const programas: Programa[] = [
    {
      codigoPrograma: 'PROG001',
      nomeMenu: 'Cadastros',
      nomeTela: 'Cadastro de Clientes',
      nomePrograma: 'CadClientes',
      liberado: true,
      acessoAdm: false,
      apareceNoMenu: true,
      nomeIcone: 'document',
      html: '',
    },
  ];

  // Salvar no banco
  await saveAuthToken(token);
  await saveUserData(userData);
  await savePrograms(programas);

  console.log('✅ Dados salvos no SQLite');
}

// ========================================
// EXEMPLO 2: Carregar Programas do Menu
// ========================================

export async function exemploCarregarMenu() {
  // Busca apenas programas liberados que aparecem no menu
  const menuPrograms = await getMenuPrograms();
  
  console.log('Programas do menu:', menuPrograms);
  
  // Mapear para exibição
  const menuItems = menuPrograms.map((p) => ({
    label: p.nomeTela,
    icon: p.nomeIcone,
  }));
  
  return menuItems;
}

// ========================================
// EXEMPLO 3: Verificar Autenticação
// ========================================

export async function exemploVerificarAuth() {
  const token = await getAuthToken();
  
  if (!token) {
    console.log('❌ Usuário não autenticado');
    return false;
  }
  
  console.log('✅ Usuário autenticado');
  return true;
}

// ========================================
// EXEMPLO 4: Logout Completo
// ========================================

export async function exemploLogout() {
  // Remove TODOS os dados do banco
  await clearAllData();
  
  console.log('✅ Logout realizado - banco limpo');
}

// ========================================
// EXEMPLO 5: Logout Parcial (só token)
// ========================================

export async function exemploLogoutParcial() {
  // Remove apenas o token, mantém programas e userData
  await removeAuthToken();
  
  console.log('✅ Token removido, dados mantidos');
}

// ========================================
// EXEMPLO 6: Buscar Dados do Usuário
// ========================================

export async function exemploGetUserData() {
  const userData = await getUserData();
  
  if (userData) {
    console.log('Nome:', userData.nome);
    console.log('Email:', userData.email);
  } else {
    console.log('❌ Dados do usuário não encontrados');
  }
  
  return userData;
}

// ========================================
// EXEMPLO 7: Buscar Todos os Programas
// ========================================

export async function exemploGetAllPrograms() {
  // Retorna TODOS os programas (liberados e não liberados)
  const allPrograms = await getPrograms();
  
  console.log(`Total de programas: ${allPrograms.length}`);
  
  // Filtrar manualmente se necessário
  const adminPrograms = allPrograms.filter((p) => p.acessoAdm);
  const freePrograms = allPrograms.filter((p) => p.liberado && !p.acessoAdm);
  
  return { adminPrograms, freePrograms };
}

// ========================================
// EXEMPLO 8: Configurações Customizadas
// ========================================

export async function exemploConfiguracoes() {
  // Salvar preferências do usuário
  await setSetting('theme', 'dark');
  await setSetting('language', 'pt-br');
  await setSetting('notifications', JSON.stringify({ enabled: true, sound: true }));
  
  // Ler preferências
  const theme = await getSetting('theme');
  const language = await getSetting('language');
  const notificationsStr = await getSetting('notifications');
  const notifications = notificationsStr ? JSON.parse(notificationsStr) : null;
  
  console.log('Tema:', theme);
  console.log('Idioma:', language);
  console.log('Notificações:', notifications);
  
  return { theme, language, notifications };
}

// ========================================
// EXEMPLO 9: Verificar Se Está Logado
// ========================================

export async function exemploIsLoggedIn(): Promise<boolean> {
  const token = await getAuthToken();
  const userData = await getUserData();
  
  return !!(token && userData);
}

// ========================================
// EXEMPLO 10: Sincronização de Dados
// ========================================

export async function exemploSincronizacao() {
  // Buscar token e programas do banco
  const token = await getAuthToken();
  const programs = await getPrograms();
  
  if (!token || programs.length === 0) {
    console.log('❌ Sem dados para sincronizar');
    return;
  }
  
  // Enviar para servidor
  try {
    const response = await fetch('https://api.exemplo.com/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ programs }),
    });
    
    if (response.ok) {
      console.log('✅ Sincronização bem-sucedida');
    }
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
}

// ========================================
// EXEMPLO 11: Atualizar Programas
// ========================================

export async function exemploAtualizarProgramas() {
  // Buscar programas atualizados do servidor
  const novosProgramas: Programa[] = [
    /* ... dados do servidor ... */
  ];
  
  // Substituir programas existentes
  await savePrograms(novosProgramas);
  
  console.log('✅ Programas atualizados');
}

// ========================================
// EXEMPLO 12: Cache de Última Sincronização
// ========================================

export async function exemploUltimaSincronizacao() {
  // Salvar timestamp
  const agora = new Date().toISOString();
  await setSetting('lastSync', agora);
  
  // Ler timestamp
  const lastSync = await getSetting('lastSync');
  
  if (lastSync) {
    const diffMs = Date.now() - new Date(lastSync).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    console.log(`Última sincronização: ${diffMinutes} minutos atrás`);
  }
}

/*
 * DICAS DE BOAS PRÁTICAS:
 * 
 * 1. Sempre use try/catch ao chamar funções do database
 * 2. Inicialize o database com initDatabase() no início do app
 * 3. Use clearAllData() ao fazer logout completo
 * 4. Use getMenuPrograms() ao invés de getPrograms() + filter
 * 5. Armazene objetos complexos usando JSON.stringify/parse
 * 6. Mantenha o usuário informado sobre operações longas
 * 7. Considere adicionar loading states ao buscar dados
 */
