import * as SQLite from 'expo-sqlite';
import { Programa } from './auth';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Inicializa o banco de dados e cria as tabelas necessárias
 */
export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync('socapp.db');
    
    // Criar tabela de configurações (para token, userData, etc.)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    // Criar tabela de programas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS programas (
        codigoPrograma TEXT PRIMARY KEY,
        nomeMenu TEXT,
        nomeTela TEXT,
        nomePrograma TEXT,
        liberado INTEGER DEFAULT 0,
        acessoAdm INTEGER DEFAULT 0,
        apareceNoMenu INTEGER DEFAULT 0,
        nomeIcone TEXT,
        html TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    console.log('✅ Banco de dados inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

/**
 * Garante que o banco de dados está inicializado
 */
async function ensureDbInitialized(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    await initDatabase();
  }
  return db!;
}

// ==================== SETTINGS ====================

/**
 * Salva um valor nas configurações
 */
export async function setSetting(key: string, value: any): Promise<void> {
  const database = await ensureDbInitialized();
  const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
  
  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
    [key, valueStr, Date.now()]
  );
}

/**
 * Obtém um valor das configurações
 */
export async function getSetting(key: string): Promise<string | null> {
  const database = await ensureDbInitialized();
  const result = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  return result?.value || null;
}

/**
 * Remove um valor das configurações
 */
export async function removeSetting(key: string): Promise<void> {
  const database = await ensureDbInitialized();
  await database.runAsync('DELETE FROM settings WHERE key = ?', [key]);
}

/**
 * Remove múltiplos valores das configurações
 */
export async function removeSettings(keys: string[]): Promise<void> {
  const database = await ensureDbInitialized();
  const placeholders = keys.map(() => '?').join(',');
  await database.runAsync(`DELETE FROM settings WHERE key IN (${placeholders})`, keys);
}

// ==================== AUTH TOKEN ====================

/**
 * Salva o token de autenticação
 */
export async function saveAuthToken(token: string): Promise<void> {
  await setSetting('authToken', token);
}

/**
 * Obtém o token de autenticação
 */
export async function getAuthToken(): Promise<string | null> {
  return await getSetting('authToken');
}

/**
 * Remove o token de autenticação
 */
export async function removeAuthToken(): Promise<void> {
  await removeSetting('authToken');
}

// ==================== USER DATA ====================

/**
 * Salva os dados do usuário
 */
export async function saveUserData(userData: any): Promise<void> {
  await setSetting('userData', userData);
}

/**
 * Obtém os dados do usuário
 */
export async function getUserData(): Promise<any | null> {
  const data = await getSetting('userData');
  return data ? JSON.parse(data) : null;
}

/**
 * Remove os dados do usuário
 */
export async function removeUserData(): Promise<void> {
  await removeSetting('userData');
}

// ==================== PROGRAMAS ====================

/**
 * Salva os programas do usuário
 */
export async function savePrograms(programs: Programa[]): Promise<void> {
  const database = await ensureDbInitialized();
  
  // Limpar programas existentes
  await database.runAsync('DELETE FROM programas');
  
  // Inserir novos programas
  for (const programa of programs) {
    await database.runAsync(
      `INSERT INTO programas (
        codigoPrograma, nomeMenu, nomeTela, nomePrograma, 
        liberado, acessoAdm, apareceNoMenu, nomeIcone, html
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        programa.codigoPrograma,
        programa.nomeMenu,
        programa.nomeTela,
        programa.nomePrograma,
        programa.liberado ? 1 : 0,
        programa.acessoAdm ? 1 : 0,
        programa.apareceNoMenu ? 1 : 0,
        programa.nomeIcone,
        programa.html || '',
      ]
    );
  }
}

/**
 * Obtém todos os programas
 */
export async function getPrograms(): Promise<Programa[]> {
  const database = await ensureDbInitialized();
  const results = await database.getAllAsync<any>('SELECT * FROM programas');
  
  return results.map((row) => ({
    codigoPrograma: row.codigoPrograma,
    nomeMenu: row.nomeMenu,
    nomeTela: row.nomeTela,
    nomePrograma: row.nomePrograma,
    liberado: row.liberado === 1,
    acessoAdm: row.acessoAdm === 1,
    apareceNoMenu: row.apareceNoMenu === 1,
    nomeIcone: row.nomeIcone,
    html: row.html,
  }));
}

/**
 * Obtém programas filtrados (liberados e que aparecem no menu)
 */
export async function getMenuPrograms(): Promise<Programa[]> {
  const database = await ensureDbInitialized();
  const results = await database.getAllAsync<any>(
    'SELECT * FROM programas WHERE liberado = 1 AND apareceNoMenu = 1'
  );
  
  return results.map((row) => ({
    codigoPrograma: row.codigoPrograma,
    nomeMenu: row.nomeMenu,
    nomeTela: row.nomeTela,
    nomePrograma: row.nomePrograma,
    liberado: row.liberado === 1,
    acessoAdm: row.acessoAdm === 1,
    apareceNoMenu: row.apareceNoMenu === 1,
    nomeIcone: row.nomeIcone,
    html: row.html,
  }));
}

/**
 * Remove todos os programas
 */
export async function removePrograms(): Promise<void> {
  const database = await ensureDbInitialized();
  await database.runAsync('DELETE FROM programas');
}

// ==================== LIMPEZA ====================

/**
 * Limpa todos os dados do banco (útil para logout)
 */
export async function clearAllData(): Promise<void> {
  const database = await ensureDbInitialized();
  await database.runAsync('DELETE FROM settings');
  await database.runAsync('DELETE FROM programas');
  console.log('✅ Todos os dados foram limpos do banco');
}

/**
 * Fecha o banco de dados
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
    console.log('✅ Banco de dados fechado');
  }
}
