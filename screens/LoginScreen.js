import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useContext } from 'react';


//LOGIN MOCKADO
const mockedUser = {
  email: 'usuario@gmail.com',
  senha: '123456',
};

export default function LoginScreen() {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = (data) => {
    const { email, senha } = data;

    if (email === mockedUser.email && senha === mockedUser.senha) {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
     navigation.replace('MainTabs');
    } else {
      Alert.alert('Erro', 'E-mail ou senha inválidos!');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View>
          <Controller
            control={control}
            name="email"
            rules={{ required: 'E-mail obrigatório' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="E-mail"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorMessage}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            name="senha"
           rules={{ required: 'Senha obrigatória' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Senha"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.senha && (
            <Text style={styles.errorMessage}>{errors.senha.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 8,
  },
});
