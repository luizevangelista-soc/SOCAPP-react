import { Programa } from '@/src/services/auth';
import { clearAllData, getMenuPrograms, removeAuthToken } from '@/src/services/database';
import { checkConnectionAndSync } from '@/src/services/sync';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItem {
  label: string;
  icon: string;
  programa?: Programa;
}

export default function HomeScreen() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadPrograms();
    syncAndUpdateStatus();
    
    // Verificar conexão periodicamente (a cada 30 segundos)
    const intervalId = setInterval(() => {
      syncAndUpdateStatus();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  async function syncAndUpdateStatus() {
    const result = await checkConnectionAndSync();
    setIsOnline(result.isOnline);

    // Verificar se o token expirou
    if (result.tokenExpired) {
      Alert.alert(
        'Sessão Expirada',
        'Sua sessão expirou. Por favor, faça login novamente para sincronizar os dados.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Limpar apenas o token, manter os dados do usuário
              await removeAuthToken();
              router.replace('/');
            },
          },
        ]
      );
    }
  }

  async function loadPrograms() {
    try {
      // Buscar programas do SQLite (já filtrados: liberados e aparecem no menu)
      const programs = await getMenuPrograms();
      
      if (programs.length > 0) {
        // Mapear para MenuItem
        const items: MenuItem[] = programs.map((programa) => ({
          label: programa.nomeTela,
          icon: getIconEmoji(programa.nomeIcone),
          programa,
        }));

        // Adicionar botão de sair
        items.push({ label: 'Sair', icon: '↩️' });

        setMenuItems(items);
      } else {
        // Se não houver programas, mostrar apenas o botão de sair
        setMenuItems([{ label: 'Sair', icon: '↩️' }]);
      }
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
    }
  }

  // Função para mapear nomes de ícones para emojis
  function getIconEmoji(iconName: string): string {
    const iconMap: Record<string, string> = {
      rectangle_stack: '📁',
      checklist: '📋',
      download: '⬇️',
      signature: '✍️',
      medical: '🩹',
      clock: '⏱️',
      globe: '🌐',
      info: 'ℹ️',
      play: '▶️',
      search: '🔍',
      document: '📝',
    };
    return iconMap[iconName] || '📄';
  }

  // Função para lidar com cliques do menu
  async function handleMenuPress(label: string) {
    if (label === 'Sair') {
      // Limpar todos os dados do SQLite
      await clearAllData();
      // Redireciona para login
      router.replace('/'); // index.tsx → login
      return;
    }

    // Aqui você pode tratar outros menus
    console.log(`Clicou em ${label}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#3E8E97" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SOCAPP</Text>
        <View style={styles.headerRight}>
          {!isOnline && (
            <Text style={styles.offlineIndicator}>📵 Offline</Text>
          )}
          <Text style={styles.headerIcon}>🔔</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleMenuPress(item.label)} // detecta o clique
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  header: { height: 60, backgroundColor: '#3E8E97', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { fontSize: 20, color: '#FFF' },
  offlineIndicator: { fontSize: 12, color: '#FFD700', fontWeight: '600' },
  grid: { padding: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#F8FFFF', borderRadius: 12, paddingVertical: 20, paddingHorizontal: 10, marginBottom: 12, alignItems: 'center', elevation: 2 },
  cardIcon: { fontSize: 26, marginBottom: 10 },
  cardText: { fontSize: 14, textAlign: 'center', color: '#333' },
});
