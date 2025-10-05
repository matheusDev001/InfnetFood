import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

export default function ProductsScreen() {
  const route = useRoute();
  const categoria = route.params?.categoria || 'Refeições';
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const swipeableRefs = useRef(new Map());

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const saved = await AsyncStorage.getItem('cart');
        if (saved) {
          setCart(JSON.parse(saved));
        } else {
          setCart([]);
        }
      })();
    }, [])
  );

  useEffect(() => {
    fetch('https://api.jsonbin.io/v3/b/68dd7421ae596e708f02c03b/latest', {
      headers: {
        'X-Master-Key':
          '$2a$10$PC8UEfr5.x6hTdYC2FPTAewi8huLTc2vziGEFgi/xtNjye0E6mbsS',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.record;
        const filtrados = allProducts.filter((p) => p.categoria === categoria);
        setProdutos(filtrados);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [categoria]);

  async function handleAdd(item) {
    const newCart = [...cart, item];
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
    
    const swipeable = swipeableRefs.current.get(item.id);
    if (swipeable) {
      swipeable.close();
    }
    
    Alert.alert("Novo pedido adicionado");
  }

  const renderLeftActions = (item) => (
    <View style={styles.leftAction}>
      <Pressable
        style={styles.actionButton}
        onPress={() => handleAdd(item)}
      >
        <Icon name="shopping-cart" size={30} color="black" />
        <Text style={styles.actionText}>Adicionar</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <Swipeable
              ref={(ref) => {
                if (ref) {
                  swipeableRefs.current.set(item.id, ref);
                } else {
                  swipeableRefs.current.delete(item.id);
                }
              }}
              renderLeftActions={() => renderLeftActions(item)}
              containerStyle={styles.swipeableContainer}
              childrenContainerStyle={styles.swipeableChildContainer}
            >
              <View style={styles.card}>
                <Image style={styles.img} source={{ uri: item.img }} />
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.price}>Preço R$ {item.preco.toFixed(2)}</Text>
                <View style={styles.addToContainer}>
                  <Text style={styles.addActionText}>>>>>></Text>
                  <Text style={styles.addActionText}> Adicionar ao Carrinho</Text>
                </View>
              </View>
            </Swipeable>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: { 
    padding: 20, 
    alignItems: 'center' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  swipeableContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  swipeableChildContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: 200,
    backgroundColor: '#0068E0',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  img: { 
    width: 100, 
    height: 100, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  name: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  price: { 
    color: 'white', 
    marginTop: 5, 
    fontWeight: 'bold' 
  },
  addToContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  addActionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  leftAction: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
    width: 100,
    marginRight: 10,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  actionText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 5,
  },
});