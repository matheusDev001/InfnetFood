import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { restaurants } from "../data/MockedRestaurants";
import { useNavigation } from "@react-navigation/native";

export default function MapScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -22.9068,
          longitude: -43.1729,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        {restaurants.map((rest) => (
          <Marker
            key={rest.id}
            coordinate={{ latitude: rest.lat, longitude: rest.lng }}
            title={rest.name}
            description={rest.address}
            onPress={() =>
              navigation.navigate("RestaurantDetails", { restaurant: rest })
            }
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
