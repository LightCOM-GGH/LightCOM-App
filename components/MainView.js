import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import MapView from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";


const MainView = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [region, setRegion] = useState({
    latitude: 48.815788,
    longitude: 2.36328,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (region === {
        latitude: 48.815788,
        longitude: 2.36328,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
      {
        navigator.geolocation.getCurrentPosition(
        position => {
          const initialPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
            };
          setRegion(initialPosition);
          },
        ), error => alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
      }
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);

  return (
    <View style={styles.container}>
      <MapView
        region={region}
        onRegionChangeComplete={setRegion}
        style={styles.mapStyle}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title={"Location"}
        >
          <Image
            style={styles.car_marker}
            source={require("../assets/car.png")}
          />
        </Marker>
        <Marker
          coordinate={{
            latitude: 48.815788,
            longitude: 2.36328,
          }}
          title={"EPITA KB"}
        >
          <Image
            style={styles.light_marker}
            source={require("../assets/green_traffic_light.png")}
          />
        </Marker>
      </MapView>
      <StatusBar style="auto" />
      <View style={styles.infoContainer}>
        <Text style={styles.infoContainerText}>ETA: 2min</Text>
        <View style={styles.infoContainerActionButton}>
          <MaterialIcons
            name="report"
            size={40}
            color="#F87A37"
            style={{ flex: 1 }}
          />
          <FontAwesome5
            name="location-arrow"
            size={28}
            color="#5D5D5D"
            style={styles.infoContainerActionButtonImage}
          />
        </View>
      </View>
    </View>
  );
};

export default MainView;

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    position: "absolute",
    height: "20%",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoContainerActionButton: {
    marginTop: 20,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  light_marker: {
    width: 20,
    height: 20,
  },
  car_marker: {
    width: 15,
    height: 30,
  }
});
