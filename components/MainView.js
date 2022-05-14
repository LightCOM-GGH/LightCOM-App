import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
//import * as Permissions from "expo-permissions";

const MainView = () => {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [closerTL, setCloserTL] = useState({});
  const [distanceCloserTL, setDistanceCloserTL] = useState(0);
  const [trafficLights, setTrafficLights] = useState([
    {
      latitude: 48.8167251535,
      longitude: 2.36020990149,
      status: "green",
    },
    {
      latitude: 48.8159264085,
      longitude: 2.35990399616,
      status: "green",
    },
    {
      latitude: 48.8160303946,
      longitude: 2.35986574495,
      status: "green",
    },
    {
      latitude: 48.8167031265,
      longitude: 2.36004733496,
      status: "green",
    },
    {
      latitude: 48.8172621608,
      longitude: 2.36658056611,
      status: "green",
    },
    {
      latitude: 48.8173033575,
      longitude: 2.36674485175,
      status: "green",
    },
  ]);

  const [region, setRegion] = useState({
    latitude: 48.815788,
    longitude: 2.36328,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const ReportBug = () => {
    console.log(
      "A bug has been reported at:" +
        location.latitude +
        "," +
        location.longitude
    );
  };

  const distance = (lat1, lat2, lon1, lon2) => {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return c * r;
  };

  const getCloserTrafficLight = () => {
    let distance = 100;
    let closerTrafficLight = {};
    trafficLights.forEach((trafficLight) => {
      let tempDistance =
        Math.sqrt(
          Math.pow(trafficLight.latitude - location.latitude, 2) + 
          Math.pow(trafficLight.longitude - location.longitude, 2)
        ) * 100;
      if (tempDistance < distance) {
        distance = tempDistance;
        closerTrafficLight = trafficLight;
      }
    });
    console.log(closerTrafficLight);
    setCloserTL(closerTrafficLight);
    let distanceTmp = (distance * 1000).toFixed(1);
    setDistanceCloserTL((distanceTmp == 0 ? 1 : distanceTmp ));
  };

  const _getLocation = async () => {
    /*let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted')
    {
      console.log("Premission to access location was denied");
      setErrorMsg("Permission to access location was denied");
    }
    else {*/
      //const userLocation = Location.getCurrentPositionAsync();
      Location.watchPositionAsync(
        {
          enableHighAccuracy: true,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          setLocation(location.coords);
          getCloserTrafficLight();
        }
      );  
    //}
  };
  useEffect(() => {
    _getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        region={region}
        onRegionChangeComplete={setRegion}
        style={styles.mapStyle}
      >
        {closerTL && (
          <MapViewDirections
            origin={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            destination={{
              latitude: closerTL.latitude,
              longitude: closerTL.longitude,
            }}
            apikey={"AIzaSyC16-XN7mtGU2YpXVAMRITRVDPH-sdJtY8"}
          />
        )}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={"Location"}
          >
            <Image
              style={styles.car_marker}
              source={require("../assets/car.png")}
            />
            {console.log(
              "Coord -> LAT: " +
                location.latitude +
                " | LONG: " +
                location.longitude
            )}
          </Marker>
        )}
        <Marker
          coordinate={{
            latitude: 48.815788,
            longitude: 2.36328,
          }}
          title={"EPITA KB"}
        >
          <Image
            style={styles.epita_maker}
            source={require("../assets/epita.png")}
          />
        </Marker>
        {trafficLights &&
          trafficLights.map((el, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: el.latitude,
                longitude: el.longitude,
              }}
              title={"Traffic Light"}
            >
              <Image
                style={styles.light_marker}
                source={require("../assets/green_traffic_light.png")}
              />
            </Marker>
          ))}
      </MapView>
      <StatusBar style="auto" />
      <View style={styles.infoContainer}>
        <View style={styles.nextTrafficLightView}>
          <Text style={styles.nextTrafficLightText}>
            Next traffic light
          </Text>
          <Text style={styles.infoContainerText}>
            Distance : {distanceCloserTL}m
          </Text>
        </View>
        <View style={styles.infoContainerActionButton}>
          <TouchableOpacity onPress={() => ReportBug()}>
            <MaterialIcons
              name="report"
              size={40}
              color="#F87A37"
              style={{ flex: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setRegion(location);
            }}
          >
            <FontAwesome5
              name="location-arrow"
              size={28}
              color="#5D5D5D"
              style={[styles.infoContainerActionButtonImage, { flex: 1 }]}
            />
          </TouchableOpacity>
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
    height: "40%",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  nextTrafficLightText:{
    fontSize: 20,
    fontWeight: "bold",
    color: "#5D5D5D",
    marginTop: 10,
  },
  nextTrafficLightView: {
    marginLeft: 0,
    marginRight: 0,
    left: 0,
    right: 0,
    padding: 20,
    height: "40%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "column",
    alignItems: "center",
  },
  nextTrafficLightViewBackgroundColorRed: {
    backgroundColor: "#FF433A",
  },
  nextTrafficLightViewBackgroundColorGreen: {
    backgroundColor: "#00C069",
  },
  infoContainerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
  infoContainerActionButton: {
    marginTop: 20,
    display: "flex",
    flex: 1,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  light_marker: {
    width: 20,
    height: 20,
  },
  epita_maker: {
    width: 40,
    height: 30,
  },
  car_marker: {
    width: 30,
    height: 55,
  },
});
