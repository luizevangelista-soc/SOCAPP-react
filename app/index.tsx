import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../src/components/Input';

// Configure o IP da sua máquina aqui
// Para Android Emulator: use 10.0.2.2
// Para dispositivo físico: use o IP da máquina na rede (ex: 192.168.1.10)
// Para iOS Simulator: pode usar localhost
const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080', // Android Emulator
  ios: 'http://localhost:8080',    // iOS Simulator
  default: 'http://localhost:8080',
});

export default function LoginScreen() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceIp, setDeviceIp] = useState('0.0.0.0');

   useEffect(() => {
     async function getIp() {
       try {
         const ip = await Network.getIpAddressAsync();
         setDeviceIp(ip);
       } catch (error) {
         console.error('Erro ao obter IP:', error);
       }
     }
     getIp();
   }, []);

  async function handleLogin() {
    if (!user || !password || !id) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/SocApp/api/login/autenticar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token-Api': 'daccca8a-ae91-4a85-8f35-edafde17f368',
        },
        body: JSON.stringify({
          login: user,
          senha: password,
          id: id,
          ip: deviceIp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        router.replace('/home');
      } else {
        // Erro retornado pela API
        Alert.alert('Erro', 'Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    } finally {
      setLoading(false);
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
        <Input placeholder="ID" secureTextEntry value={id} onChangeText={setId} icon={<MaterialIcons name="keyboard" size={22} color="#4a9ca6" />} />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'ENTRANDO...' : 'ENTRAR'}</Text>
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
