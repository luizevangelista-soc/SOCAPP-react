import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../src/components/Input';

export default function LoginScreen() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');

  const MOCK_USER = { user: 'admin', password: '123456', id: '3931' };

  function handleLogin() {
    if (user === MOCK_USER.user && password === MOCK_USER.password && id === MOCK_USER.id) {
      router.replace('/home'); // navegação para HomeScreen
    } else {
      Alert.alert('Erro', 'Usuário ou senha inválidos');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SOCAPP</Text>
      </View>

      <View style={styles.form}>
        <Input placeholder="Usuário" value={user} onChangeText={setUser} icon={<Feather name="user" size={22} color="#4a9ca6" />} />
        <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} icon={<Feather name="lock" size={22} color="#4a9ca6" />} />
        <Input placeholder="ID" value={id} onChangeText={setId} icon={<MaterialIcons name="keyboard" size={22} color="#4a9ca6" />} />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR COM SSO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { height: 70, backgroundColor: '#4a9ca6', justifyContent: 'center', paddingHorizontal: 16 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  form: { padding: 16 },
  button: { backgroundColor: '#4a9ca6', height: 48, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
