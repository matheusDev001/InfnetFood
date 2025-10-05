import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Button,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../App';

export default function CheckoutScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosRevisados, setPedidosRevisados] = useState([]);
  const navigation = useNavigation();
  const { colors, isDarkMode } = useContext(ThemeContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { endereco: '', payMethod: '' },
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const dados = await AsyncStorage.getItem('orders');
        setPedidos(dados ? JSON.parse(dados) : []);
      })();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const saved = await AsyncStorage.getItem('revisedOrders');
        if (saved) setPedidosRevisados(JSON.parse(saved));
        else {
          await AsyncStorage.setItem('revisedOrders', JSON.stringify([]));
          setPedidosRevisados([]);
        }
      })();
    }, [])
  );

  const total = pedidos.reduce((acc, pedido) => {
    const pedidoTotal = pedido.items.reduce(
      (soma, produto) =>
        soma + (produto.preco || 0) * (produto.quantidade || 1),
      0
    );
    return acc + pedidoTotal;
  }, 0);

  async function finalizeOrder(data) {
    try {
      const { endereco, payMethod } = data;

      if (pedidos.length === 0) {
        Alert.alert('Aviso', 'Não há pedidos para finalizar.');
        return;
      }

      const novoPedido = {
        id: Date.now(),
        endereco,
        payMethod,
        items: pedidos.flatMap((p) => p.items),
        total,
        data: new Date().toLocaleString(),
      };

      const saved = await AsyncStorage.getItem('revisedOrders');
      const prevOrders = saved ? JSON.parse(saved) : [];

      const newOrders = [...prevOrders, novoPedido];
      await AsyncStorage.setItem('revisedOrders', JSON.stringify(newOrders));
      setPedidosRevisados(newOrders);

      await AsyncStorage.setItem('orders', JSON.stringify([]));
      await AsyncStorage.setItem('cart', JSON.stringify([]));
      setPedidos([]);

      reset();
      Alert.alert('Sucesso', 'Pedido finalizado com sucesso!');
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      Alert.alert('Erro', 'Não foi possível finalizar o pedido.');
    }
  }

  function submitWithConfirmation(data) {
    Alert.alert(
      'Confirmar pedido',
      `Tem certeza que deseja finalizar o pedido no valor total de R$ ${total.toFixed(
        2
      )}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => finalizeOrder(data) },
      ]
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Pressable
        onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
      >
        <Icon name="arrow-left" size={30} color={isDarkMode ? 'white' : '#e74c3c'} />
        <Text style={{ color: colors.text, marginLeft: 5 }}>Voltar</Text>
      </Pressable>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.orderCard,
              { backgroundColor: isDarkMode ? '#333' : '#eee' },
            ]}
          >
            <Text style={[styles.orderTitle, { color: colors.text }]}>
              Pedido {item.id}
            </Text>
            <FlatList
              data={item.items}
              keyExtractor={(produto) => produto.id.toString()}
              renderItem={({ item: produto }) => (
                <View style={styles.productCard}>
                  <Image source={{ uri: produto.img }} style={styles.img} />
                  <Text style={[styles.name, { color: colors.text }]}>
                    {produto.nome}
                  </Text>
                  <Text style={[styles.price, { color: colors.text }]}>
                    R$ {produto.preco.toFixed(2)} x {produto.quantidade} = R$
                    {(produto.preco * produto.quantidade).toFixed(2)}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, textAlign: 'center', marginBottom: 10 },
          ]}
        >
          Dados do Pedido
        </Text>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            Endereço da entrega
          </Text>
          <Controller
            control={control}
            name="endereco"
            rules={{ required: 'Digite um endereço' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: isDarkMode ? '#888' : '#000',
                    color: colors.text,
                  },
                ]}
                placeholder="Digite um endereço válido"
                placeholderTextColor={isDarkMode ? '#ccc' : '#555'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors?.endereco && (
            <Text style={{ color: 'red' }}>Digite um endereço</Text>
          )}
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            Método de pagamento
          </Text>
          <Controller
            control={control}
            name="payMethod"
            rules={{ required: 'Escolha um método de pagamento' }}
            render={({ field: { onChange, value } }) => (
              <View
                style={[
                  styles.pickerContainer,
                  { borderColor: isDarkMode ? '#888' : '#000' },
                ]}
              >
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  dropdownIconColor={colors.text}
                  style={{ color: colors.text }}
                >
                  <Picker.Item label="-- Selecione --" value="" />
                  <Picker.Item label="Crédito" value="credito" />
                  <Picker.Item label="Débito" value="debito" />
                  <Picker.Item label="Dinheiro" value="dinheiro" />
                  <Picker.Item label="Pix" value="pix" />
                </Picker>
              </View>
            )}
          />
          {errors?.payMethod && (
            <Text style={{ color: 'red' }}>Escolha um método de pagamento</Text>
          )}
        </View>

        <Text
          style={[
            styles.totalText,
            { color: colors.text, textAlign: 'center', marginTop: 20 },
          ]}
        >
          Total Geral: R$ {total.toFixed(2)}
        </Text>

        <View style={{ marginTop: 20 }}>
          <Button
            title="Finalizar Pedido"
            color={isDarkMode ? '#2196F3' : '#0068E0'}
            onPress={handleSubmit(submitWithConfirmation)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  orderCard: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  orderTitle: { fontWeight: 'bold', marginBottom: 10 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  img: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  name: { fontWeight: 'bold', flex: 1 },
  price: { fontWeight: 'bold' },
  label: { fontWeight: 'bold', marginBottom: 5 },
  inputSection: { marginTop: 20 },
  input: { borderWidth: 1, borderRadius: 5, padding: 8 },
  pickerContainer: { borderWidth: 1, borderRadius: 5 },
  totalText: { fontWeight: 'bold', fontSize: 18 },
  sectionTitle: { fontWeight: 'bold', fontSize: 20 },
});
