import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import axios from 'axios';
import { AntDesign } from "@expo/vector-icons";

//import * as Permissions from "expo-permissions";

const MainView = () => {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [closerTL, setCloserTL] = useState({});
  const [distanceCloserTL, setDistanceCloserTL] = useState(0);
  const [trafficLights, setTrafficLights] = useState([
    /*{
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
    },*/
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
    console.log("my traffics: ", closerTrafficLight.results);
    setCloserTL(closerTrafficLight.results);
    let distanceTmp = (distance * 1000).toFixed(1);
    setDistanceCloserTL(trafficLights.length === 0 ? 0 : distanceTmp);
  };

  const getTL = () => {
    let trafficLightsTmp = {
      url: "http://10.29.123.96:3000/traffic",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
    };
    axios(trafficLightsTmp)
      .then(function (response) {
        console.log(response.data.results);
        setTrafficLights(response.data.results);
      })
      .catch(function (error) {
        console.log(error);
      });
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
          getTL();
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
        //onRegionChangeComplete={setRegion}
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
          <View style={styles.nextTrafficLightImageView}>
            <Image
              style={styles.nextTrafficLightImage}
              source={require("../assets/green_traffic_light.png")}
            />
          </View>
          <View style={styles.nextTrafficLightTextView}>
            <Text style={styles.nextTrafficLightText}>
              {distanceCloserTL} m
            </Text>
          </View>
        </View>
        <View style={styles.infoContainerActionButton}>
          <TouchableOpacity onPress={() => ReportBug()} style={{ flex: 1 }}>
            <MaterialIcons
              name="report"
              size={40}
              color="#F87A37"
              style={{ flex: 1}}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              backgroundColor: "#00D166",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              alignItems: "center",
              maxHeight: 70,
              maxWidth: 70,
            }}
          >
            <AntDesign name="arrowup" size={70} color="white" />
          </View>
          <TouchableOpacity
            onPress={() => {
              setRegion(location);
            }}
            style={{ flex: 1 }}
          >
            <FontAwesome5
              name="location-arrow"
              size={28}
              color="#5D5D5D"
              style={{ flex: 1, alignItems: "center" }}
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
  infoContainerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
  nextTrafficLightView: {
    marginLeft: 5,
    marginRight: 5,
    left: 0,
    right: 0,
    padding: 20,
    height: "40%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainerActionButton: {
    marginTop: 20,
    display: "flex",
    flex: 1,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
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
  nextTrafficLightImageView: {
    flex: 1,
    alignItems: "center",
  },
  nextTrafficLightImage: {
    width: 100,
    height: 100,
  },
  nextTrafficLightTextView: {
    flex: 1,
    borderLeftColor: "#5D5D5D",
    borderLeftWidth: 3,
  },
  nextTrafficLightText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5D5D5D"
  },
});
