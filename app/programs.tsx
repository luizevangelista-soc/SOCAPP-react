import { Programa } from '@/src/services/auth';
import { getPrograms } from '@/src/services/database';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgramsScreen() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      setLoading(true);
      // Buscar TODOS os programas do SQLite (liberados e não liberados)
      const allPrograms = await getPrograms();
      setPrograms(allPrograms);
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
    } finally {
      setLoading(false);
    }
  }

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

  function handleProgramPress(programa: Programa) {
    // Aqui você pode implementar a lógica para abrir o programa
    console.log('Programa selecionado:', programa.nomeTela);
    // TODO: Implementar navegação ou ação específica para cada programa
  }

  function renderProgramItem({ item }: { item: Programa }) {
    return (
      <TouchableOpacity
        style={[
          styles.programCard,
          !item.liberado && styles.programCardDisabled
        ]}
        onPress={() => handleProgramPress(item)}
        disabled={!item.liberado}
        activeOpacity={0.7}
      >
        <View style={styles.programIconContainer}>
          <Text style={styles.programIcon}>{getIconEmoji(item.nomeIcone)}</Text>
        </View>
        
        <View style={styles.programInfo}>
          <Text style={styles.programName}>{item.nomeTela}</Text>
          <Text style={styles.programCode}>{item.nomePrograma}</Text>
          
          <View style={styles.badgeContainer}>
            {item.liberado && (
              <View style={[styles.badge, styles.badgeSuccess]}>
                <Text style={styles.badgeText}>✓ Liberado</Text>
              </View>
            )}
            {!item.liberado && (
              <View style={[styles.badge, styles.badgeWarning]}>
                <Text style={styles.badgeText}>🔒 Bloqueado</Text>
              </View>
            )}
            {item.apareceNoMenu && (
              <View style={[styles.badge, styles.badgeInfo]}>
                <Text style={styles.badgeText}>📌 Menu</Text>
              </View>
            )}
            {item.acessoAdm && (
              <View style={[styles.badge, styles.badgeAdmin]}>
                <Text style={styles.badgeText}>👑 Admin</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#3E8E97" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Programas Disponíveis</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3E8E97" />
          <Text style={styles.loadingText}>Carregando programas...</Text>
        </View>
      ) : programs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Nenhum programa disponível</Text>
          <Text style={styles.emptySubtext}>
            Sincronize sua conta para visualizar os programas
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Total: <Text style={styles.summaryBold}>{programs.length}</Text> programa(s)
            </Text>
            <Text style={styles.summaryText}>
              Liberados: <Text style={styles.summaryBold}>
                {programs.filter(p => p.liberado).length}
              </Text>
            </Text>
          </View>

          <FlatList
            data={programs}
            renderItem={renderProgramItem}
            keyExtractor={(item) => item.codigoPrograma}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    height: 60,
    backgroundColor: '#3E8E97',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensar o botão de voltar
  },
  headerRight: {
    width: 40, // Mesma largura do backButton para centralizar o título
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  summaryBold: {
    fontWeight: '700',
    color: '#3E8E97',
    fontSize: 16,
  },
  listContent: {
    padding: 12,
  },
  programCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  programCardDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  programIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  programIcon: {
    fontSize: 30,
  },
  programInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  programCode: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: '#E8F5E9',
  },
  badgeWarning: {
    backgroundColor: '#FFF3E0',
  },
  badgeInfo: {
    backgroundColor: '#E3F2FD',
  },
  badgeAdmin: {
    backgroundColor: '#F3E5F5',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#555',
  },
});
