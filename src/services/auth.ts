import { Platform } from 'react-native';
import { getAuthToken, getPrograms, saveAuthToken, savePrograms, saveUserData } from './database';

// Configure o IP da sua máquina aqui
// Para Android Emulator: use 10.0.2.2
// Para dispositivo físico: use o IP da máquina na rede (ex: 192.168.1.10)
// Para iOS Simulator: pode usar localhost
const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080', // Android Emulator
  ios: 'http://localhost:8080',    // iOS Simulator
  default: 'http://localhost:8080',
});

export interface Programa {
  codigoPrograma: string;
  nomeMenu: string;
  nomeTela: string;
  nomePrograma: string;
  liberado: boolean;
  acessoAdm: boolean;
  apareceNoMenu: boolean;
  nomeIcone: string;
  html: string;
}

interface LoginCredentials {
  login: string;
  senha: string;
  id: string;
  ip: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface SyncResponse {
  success: boolean;
  tokenExpired?: boolean;
  message?: string;
}

export async function authenticateUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/SocApp/api/login/autenticar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token-Api': 'daccca8a-ae91-4a85-8f35-edafde17f368',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      // Salvar dados do usuário incluindo programas e token JWT no SQLite
      if (data.programas) {
        await savePrograms(data.programas);
      }
      if (data.token || data.jwt || data.accessToken) {
        const token = data.token || data.jwt || data.accessToken;
        await saveAuthToken(token);
      }
      await saveUserData(data);
      
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Usuário ou senha inválidos',
      };
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return {
      success: false,
      message: 'Não foi possível conectar ao servidor',
    };
  }
}

// Função para sincronizar programas com o servidor
export async function syncProgramsToServer(): Promise<SyncResponse> {
  try {
    const token = await getAuthToken();
    const programs = await getPrograms();

    if (!token || programs.length === 0) {
      console.log('Token ou programas não encontrados');
      return { success: false, message: 'Token ou programas não encontrados' };
    }

    const response = await fetch(`${API_BASE_URL}/SocApp/api/programas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Token-Api': 'daccca8a-ae91-4a85-8f35-edafde17f368',
      },
      body: JSON.stringify({ programas: programs }),
    });

    if (response.ok) {
      console.log('Programas sincronizados com sucesso');
      return { success: true };
    } else if (response.status === 401 || response.status === 403) {
      // Token expirado ou inválido
      console.warn('Token expirado ou inválido');
      return { success: false, tokenExpired: true, message: 'Sessão expirada' };
    } else {
      console.error('Erro ao sincronizar programas:', response.status);
      return { success: false, message: `Erro: ${response.status}` };
    }
  } catch (error) {
    console.error('Erro ao sincronizar programas:', error);
    return { success: false, message: 'Erro ao conectar com servidor' };
  }
}
