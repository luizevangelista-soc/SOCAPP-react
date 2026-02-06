import * as Network from 'expo-network';
import { SyncResponse, syncProgramsToServer } from './auth';

let isCurrentlyOnline = true;

export interface ConnectionSyncResult {
  isOnline: boolean;
  tokenExpired?: boolean;
  syncAttempted?: boolean;
  syncSuccess?: boolean;
}

/**
 * Verifica a conexão com a internet e sincroniza dados quando a conexão é restaurada
 * @returns Promise<ConnectionSyncResult> - resultado da verificação e sincronização
 */
export async function checkConnectionAndSync(): Promise<ConnectionSyncResult> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    const wasOffline = !isCurrentlyOnline;
    const nowOnline = networkState.isConnected === true && networkState.isInternetReachable === true;
    
    isCurrentlyOnline = nowOnline;

    // Se estava offline e agora está online, sincronizar
    if (wasOffline && nowOnline) {
      console.log('Conexão restaurada! Sincronizando programas...');
      const syncResult = await syncProgramsToServer();
      
      return {
        isOnline: nowOnline,
        syncAttempted: true,
        syncSuccess: syncResult.success,
        tokenExpired: syncResult.tokenExpired,
      };
    }

    return { isOnline: nowOnline, syncAttempted: false };
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return { isOnline: false, syncAttempted: false };
  }
}

/**
 * Verifica apenas o status da conexão, sem sincronizar
 * @returns Promise<boolean> - true se está online, false se offline
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    const isOnline = networkState.isConnected === true && networkState.isInternetReachable === true;
    isCurrentlyOnline = isOnline;
    return isOnline;
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return false;
  }
}

/**
 * Retorna o estado atual da conexão (último valor verificado)
 */
export function getConnectionStatus(): boolean {
  return isCurrentlyOnline;
}

/**
 * Sincroniza manualmente os dados com o servidor
 * @returns Promise<SyncResponse> - resultado da sincronização
 */
export async function manualSync(): Promise<SyncResponse> {
  const isOnline = await checkConnection();
  if (!isOnline) {
    console.log('Não é possível sincronizar: sem conexão com a internet');
    return { success: false, message: 'Sem conexão com a internet' };
  }
  
  return await syncProgramsToServer();
}
