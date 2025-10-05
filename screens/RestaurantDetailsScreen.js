import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

export default function RestaurantDetailsScreen() {
  const route = useRoute();
  const { restaurant } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text style={styles.address}>{restaurant.address}</Text>

      <View style={styles.card}>
        <Text style={styles.menuTitle}>Exemplo de item do cardápio:</Text>
        <Text style={styles.menuItem}>{restaurant.menuItem}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuItem: {
    fontSize: 16,
    marginTop: 8,
  },
});
