import { Programa } from '@/src/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItem {
  label: string;
  icon: string;
  programa?: Programa;
}

export default function HomeScreen() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      const programsData = await AsyncStorage.getItem('userPrograms');
      
      if (programsData) {
        const programs: Programa[] = JSON.parse(programsData);
        
        // Filtrar programas: apenas os que estão liberados E aparecem no menu
        const filteredPrograms = programs.filter(
          (programa) => programa.liberado && programa.apareceNoMenu
        );

        // Mapear para MenuItem
        const items: MenuItem[] = filteredPrograms.map((programa) => ({
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
      setMenuItems([{ label: 'Sair', icon: '↩️' }]);
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
  function handleMenuPress(label: string) {
    if (label === 'Sair') {
      // Limpar dados do AsyncStorage
      AsyncStorage.multiRemove(['userPrograms', 'userData']);
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
        <Text style={styles.headerIcon}>🔔</Text>
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
  headerIcon: { fontSize: 20, color: '#FFF' },
  grid: { padding: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#F8FFFF', borderRadius: 12, paddingVertical: 20, paddingHorizontal: 10, marginBottom: 12, alignItems: 'center', elevation: 2 },
  cardIcon: { fontSize: 26, marginBottom: 10 },
  cardText: { fontSize: 14, textAlign: 'center', color: '#333' },
});
