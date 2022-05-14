import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , setState, Image} from 'react-native';
import MapView from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import MainView from './components/MainView';


export default function App() {
  return (
    <MainView />
  );
}


