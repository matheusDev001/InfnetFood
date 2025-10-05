import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Alert,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../App';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const { colors, isDarkMode } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const saved = await AsyncStorage.getItem('cart');
        if (saved) {
          const parsed = JSON.parse(saved).map((item) => ({
            ...item,
            quantidade: item.quantidade || 1,
          }));
          setCart(parsed);
        } else {
          setCart([]);
        }
      })();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const saved = await AsyncStorage.getItem('orders');
        if (saved) {
          setOrders(JSON.parse(saved));
        } else {
          await AsyncStorage.setItem('orders', JSON.stringify([]));
          setOrders([]);
        }
      })();
    }, [])
  );

  const updateCartStorage = async (updatedCart) => {
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleIncrease = async (index) => {
    const newCart = [...cart];
    newCart[index].quantidade += 1;
    await updateCartStorage(newCart);
  };

  const handleDecrease = async (index) => {
    const newCart = [...cart];
    if (newCart[index].quantidade > 1) {
      newCart[index].quantidade -= 1;
      await updateCartStorage(newCart);
    }
  };

  async function handleDelete(id) {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    Alert.alert('Item excluído do carrinho!');
  }

  const renderRightActions = (id) => (
    <View style={styles.leftAction}>
      <Pressable
        style={styles.leftActionsStyle}
        onPress={() => handleDelete(id)}
      >
        <Icon name="minus-circle" size={50} color="black" />
        <Text style={styles.deleButtonText}>Excluir</Text>
      </Pressable>
    </View>
  );

  const total = cart.reduce(
    (acc, item) => acc + (item.preco || 0) * (item.quantidade || 1),
    0
  );

  async function handleOrder() {
    if (cart.length === 0) {
      Alert.alert('Erro', 'O carrinho está vazio!');
      return;
    }

    try {
      const saved = await AsyncStorage.getItem('orders');
      const prevOrders = saved ? JSON.parse(saved) : [];

      let updatedOrders = [];

      if (prevOrders.length > 0) {
        updatedOrders = [...prevOrders];
        updatedOrders[prevOrders.length - 1].items = cart;
      } else {
        updatedOrders = [{ id: Date.now(), items: cart }];
      }

      setOrders(updatedOrders);
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));

      navigation.navigate('Checkout');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      Alert.alert('Erro', 'Não foi possível revisar o pedido.');
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.container}
          renderItem={({ item, index }) => (
            <Swipeable
              key={item.id}
              renderLeftActions={() => renderRightActions(item.id)}
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: isDarkMode ? '#333' : '#0068E0' },
                ]}
              >
                <Image style={styles.img} source={{ uri: item.img }} />
                <Text
                  style={[styles.name, { color: isDarkMode ? 'white' : 'white' }]}
                >
                  {item.nome}
                </Text>
                <Text
                  style={[styles.price, { color: isDarkMode ? 'white' : 'white' }]}
                >
                  Preço R$ {item.preco ? item.preco.toFixed(2) : '0.00'}
                </Text>

                <View style={styles.quantityContainer}>
                  <Text
                    style={[
                      styles.quantityTitle,
                      { color: isDarkMode ? 'white' : 'white' },
                    ]}
                  >
                    Quantidade
                  </Text>
                  <View style={styles.quantityButtons}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.quantityButton,
                        item.quantidade === 1 && { opacity: 0.5 },
                        pressed && { opacity: 0.7 },
                      ]}
                      disabled={item.quantidade === 1}
                      onPress={() => handleDecrease(index)}
                    >
                      <Text style={styles.operationSign}>-</Text>
                    </Pressable>

                    <Text style={styles.quantityText}>{item.quantidade}</Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.quantityButton,
                        pressed && { opacity: 0.7 },
                      ]}
                      onPress={() => handleIncrease(index)}
                    >
                      <Text style={styles.operationSign}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.deleteContainerTexts}>
                  <Text style={styles.deleteActionText}>>>>>>></Text>
                  <Text style={styles.deleteActionText}>Tirar do Carrinho</Text>
                </View>
              </View>
            </Swipeable>
          )}
        />

        <View style={styles.totalValue}>
          <Text
            style={[
              styles.totalText,
              { color: isDarkMode ? 'white' : 'black' },
            ]}
          >
            Total: R$ {total.toFixed(2)}
          </Text>
        </View>

        <Button title="Revisar Pedido" onPress={handleOrder} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, alignItems: 'center' },
  card: {
    width: 200,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  img: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { marginTop: 5, fontWeight: 'bold' },
  leftActionsStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
  },
  leftAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
    width: 100,
    marginRight: 10,
  },
  quantityContainer: {
    marginTop: 20,
  },
  quantityTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quantityButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  quantityButton: {
    width: 30,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
  },
  operationSign: {
    fontWeight: 'bold',
  },
  quantityText: {
    fontWeight: 'bold',
    color: 'white',
  },
  deleteContainerTexts: {
    alignItems: 'center',
    marginTop: 10,
  },
  deleteActionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleButtonText: {
    fontWeight: 'bold',
  },
  totalValue: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
