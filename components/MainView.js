import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , setState, Image} from 'react-native';
import MapView from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Marker } from "react-native-maps";


const MainView = () => {
  const getInitialState = () => {
    return {
      region: {
        latitude: 48.815788,
        longitude: 2.36328,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  };

  const onRegionChange = (region) => {
    this.setState({ region });
  };

  return (
    <View style={styles.container}>
      <MapView
        region={getInitialState().region}
        onRegionChange={onRegionChange.region}
        style={styles.mapStyle}
      >
        <Marker
          coordinate={{
            latitude: 48.815788,
            longitude: 2.36328,
          }}
          title={"EPITA KB"}
          description={"EPITA KB"}
        >
          <Image style={styles.light_marker} source={require('../assets/green_traffic_light.png')} />
        </Marker>
      </MapView>
      <StatusBar style="auto" />
      <View style={styles.infoContainer}>
        <Text style={styles.infoContainerText}>ETA : 8min</Text>
        <View style={styles.infoContainerActionButton}>
          <FontAwesome5 name="car" size={35} color="white" />
        </View>
      </View>
    </View>
  );
}

export default MainView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
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
    backgroundColor: "#F87A37",
    width: 60,
    height: 60,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  light_marker: {
    width: 20,
    height: 20,
  }
});