import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons'; // Importing icons

const FarmAreaCalculator = () => {
  const navigation = useNavigation();
  const [coordinates, setCoordinates] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
      }
    })();
  }, []);

  // Start tracking coordinates
  const startTracking = async () => {
    setIsTracking(true);
    const startTime = Date.now();
    
    // Clear any existing timer
    if (timer) {
      clearInterval(timer);
    }

    const newTimer = setInterval(async () => {
      const currentTime = Date.now();
      if (currentTime - startTime >= 30 * 60 * 1000) {
        // Stop tracking after 30 minutes
        stopTracking();
      } else {
        // Fetch current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        setCoordinates((prevCoordinates) => [...prevCoordinates, { latitude, longitude }]);
      }
    }, 1000); // Update every second

    setTimer(newTimer);
  };

  // Stop tracking coordinates
  const stopTracking = () => {
    clearInterval(timer);
    setIsTracking(false);
    console.log('Tracking stopped');
    alert('Tracking stopped. However, tracking will stop automatically after 30 minutes');
  };

  // Calculate and display area when tracking is stopped
  const calculateFarmArea = () => {
    if (coordinates.length >= 3) {
      const area = calculateArea(coordinates); // Call a function to calculate area
      alert(`The farm area is: ${area} square meters`);
      // Pass the result to the previous screen
      navigation.navigate('RegsiterFarmer', { area }); // Change "PreviousScreen" to your actual screen name
    } else {
      alert('Please walk around the perimeter of the farm and stop to calculate the area.');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Image source={require("../assets/cosmologo.png")} style={styles.logo} />
                <View>
                  <Text style={styles.title}>Centre for Climate Smart Agriculture</Text>
                  <Text style={styles.subtitle}>Farmer Area Calculator</Text>
                </View>
              </View>
      
      <Text style={styles.info}>Press start and track the perimeter of the farm by moving around.</Text>
      
      <View style={styles.iconContainer}>
       {isTracking ? (
        <TouchableOpacity onPress={stopTracking} style={styles.button}>
          <FontAwesome name="stop-circle" size={50} color="white" />
          <Text style={styles.buttonText}>Stop Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startTracking} style={styles.button}>
          <FontAwesome name="play-circle" size={50} color="white" />
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
      )}
    </View>

    <View style={styles.iconContainer}>
    <TouchableOpacity onPress={calculateFarmArea} style={styles.button} disabled={!coordinates.length}>
      <FontAwesome name="area-chart" size={50} color="gray" />
      <Text style={styles.buttonText}>Calculate Area</Text>
    </TouchableOpacity>
  </View>

      <Text style={styles.coordinates}>
        {coordinates.length > 0 ? `Captured ${coordinates.length} coordinates.` : 'No coordinates captured yet.'}
      </Text>
    </View>
  );
};

// Function to calculate area using the Shoelace Theorem
const calculateArea = (coordinates) => {
  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i].latitude * coordinates[j].longitude;
    area -= coordinates[j].latitude * coordinates[i].longitude;
  }

  area = Math.abs(area) / 2;
  return area; // in square meters
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    marginRight: 5,
    padding: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: { 
    fontSize: 14, 
    color: "#666" 
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  coordinates: {
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    width: "100%",
    backgroundColor: "#13274F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default FarmAreaCalculator;
