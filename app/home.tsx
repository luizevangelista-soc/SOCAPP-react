import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_ITEMS = [
  { label: 'SOCGED', icon: '📁' },
  { label: 'Checklist e Inspeções', icon: '📋' },
  { label: 'Gestão Off-line', icon: '⬇️' },
  { label: 'Central de assinaturas', icon: '✍️' },
  { label: 'Requisições de entrega de EPI', icon: '🩹' },
  { label: 'Epis em Atraso', icon: '⏱️' },
  { label: 'Idiomas', icon: '🌐' },
  { label: 'Sobre', icon: 'ℹ️' },
  { label: 'Iniciar Processo', icon: '▶️' },
  { label: 'Buscar Processos', icon: '🔍' },
  { label: 'Pendências de Processos', icon: '📝' },
  { label: 'Sair', icon: '↩️' }, // ← botão de logout
];

export default function HomeScreen() {
  const router = useRouter();

  // Função para lidar com cliques do menu
  function handleMenuPress(label: string) {
    if (label === 'Sair') {
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
        {MENU_ITEMS.map((item, index) => (
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
