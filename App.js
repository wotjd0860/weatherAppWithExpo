import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator  } from 'react-native';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// openweather API KEY (https://openweathermap.org/api)
const API_KEY = "";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather  = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    const filteredJson = json.list.filter((weather) => {
      if (weather.dt_txt.includes("00:00:00")) {
        return weather;
      }
    })
    setDays(filteredJson);
    
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        ActivityIndicator 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {true === 0 
          ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator color="white" size="large" style={{marginTop: 10}}/>
          </View> )
          : (
          days.map((day, index) => 
            <View key={index} style={styles.day}>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                <Text style={styles.temp}>
                  {day.main.temp.toFixed(1)}
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View> )
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "tomato"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },
});