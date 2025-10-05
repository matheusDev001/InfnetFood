import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../App';

const mockedUserData = {
  email: 'usuario@gmail.com',
  nome: 'João Silva',
  img: 'user',
};

export default function ProfileScreen() {
  const navigation = useNavigation();
    const { colors } = useContext(ThemeContext);


  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.userDataContainer}>
            <Icon name={mockedUserData.img} size={50} color={colors.text} />
            <Text style={[styles.text, { color: colors.text }]}>
              Nome: {mockedUserData.nome}
            </Text>
            <Text style={[styles.text, { color: colors.text }]}>
              Email: {mockedUserData.email}
            </Text>
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  userDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  text: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
