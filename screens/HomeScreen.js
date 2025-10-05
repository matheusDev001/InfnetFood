import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const navigation = useNavigation();

  const DATA = [
    {
      id: '1',
      title: 'Refeições',
      img: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg',
    },
    {
      id: '2',
      title: 'Lanches',
      img: 'https://images.pexels.com/photos/36756/food-pizza-roll-baked.jpg',
    },
    {
      id: '3',
      title: 'Bebidas',
      img: 'https://images.pexels.com/photos/3323682/pexels-photo-3323682.jpeg',
    },
    {
      id: '4',
      title: 'Sobremesas',
      img: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          style={styles.flatListStyle}
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('Products', { categoria: item.title })
              }>
              <View style={styles.card}>
                <Image style={styles.categoryImg} source={{ uri: item.img }} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </Pressable>
          )}
        />


        <View style={styles.mapIconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Map')}
          >
            <Icon name="map-marker" size={30} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  flatListStyle: {
    justifyContent: 'space-between',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0068E0',
    borderWidth: 1.5,
    borderColor: 'black',
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  categoryImg: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },

  mapIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 4,
  },
});
