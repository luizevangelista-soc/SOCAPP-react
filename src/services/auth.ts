import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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
      // Salvar dados do usuário incluindo programas
      if (data.programas) {
        await AsyncStorage.setItem('userPrograms', JSON.stringify(data.programas));
      }
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      
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
