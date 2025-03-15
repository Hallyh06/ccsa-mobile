import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { firestore } from "../firebaseConfig";
import * as Location from "expo-location";
import Icon from 'react-native-vector-icons/MaterialIcons';


const RegisterFarmer = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nin: "",
    bvn: "",
    state: "",
    localGovernment: "",
    age: "",
    gender: "",
    primaryCrop: "",
    secondaryCrop: "",
    farmSize: "",
    farmingSeason: "",
    farmOwnership: "",
    latitude: "",
    longitude: "",
  });

  const generateFarmerID = () => {
    const date = new Date();
    return `CCSA-${date.toISOString().replace(/[-:.TZ]/g, "")}`;
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(firestore, "farmers"), {
        ...formData,
        farmerID: generateFarmerID(),
        createdAt: serverTimestamp(),
      });
      Alert.alert("Success", "Farmer Registered Successfully!");
      navigation.navigate("Dashboard");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        nin: "",
        bvn: "",
        state: "",
        localGovernment: "",
        age: "",
        gender: "",
        primaryCrop: "",
        secondaryCrop: "",
        farmSize: "",
        farmingSeason: "",
        farmOwnership: "",
        latitude: "",
        longitude: "",
        coordinateFormat: "",
        coordinateSystem: "",
        calculatedArea: "",
      });
    } catch (error) {
      console.error("Error adding farmer: ", error);
      Alert.alert("Error", "Failed to register farmer.");
    }
  };

  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to fetch coordinates.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setFormData({
      ...formData,
      latitude: location.coords.latitude.toString(),
      longitude: location.coords.longitude.toString(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/cosmologo.png")} style={styles.logo} />
        <View>
          <Text style={styles.title}>Centre for Climate Smart Agriculture</Text>
          <Text style={styles.subtitle}>Farmer Registration</Text>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.sectionHeader}>
        <Icon name="person" size={24} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Farmer Personal Information</Text>
      </View>

      <View style={styles.formGroup}>
        <TextInput style={styles.input} placeholder="Full Name" value={formData.name} onChangeText={(text) => handleChange("name", text)} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={formData.email} onChangeText={(text) => handleChange("email", text)} />
        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={formData.phone} onChangeText={(text) => handleChange("phone", text)} />
        <TextInput style={styles.input} placeholder="NIN" value={formData.nin} onChangeText={(text) => handleChange("nin", text)} />
        <TextInput style={styles.input} placeholder="BVN" value={formData.bvn} onChangeText={(text) => handleChange("bvn", text)} />
        <Picker selectedValue={formData.state} style={styles.picker} onValueChange={(value) => handleChange("state", value)}>
          <Picker.Item label="Select State" value="" />
          <Picker.Item label="Abia" value="Abia" />
          <Picker.Item label="Adamawa" value="Adamawa" />
          <Picker.Item label="Akwa Ibom" value="Akwa Ibom" />
          <Picker.Item label="Anambra" value="Anambra" />
          <Picker.Item label="Bauch" value="Bauchi" />
          <Picker.Item label="Bayelsa" value="Bayelsa" />
          <Picker.Item label="Benue" value="Benue" />
          <Picker.Item label="Borno" value="Borno" />
          <Picker.Item label="Cross River" value="Cross River" />
          <Picker.Item label="Delta" value="Delta" />
          <Picker.Item label="Ebonyi" value="Ebonyi" />
          <Picker.Item label="Edo" value="Edo" />
          <Picker.Item label="Ekiti" value="Ekiti" />
          <Picker.Item label="Enugu" value="Enugu" />
          <Picker.Item label="Gombe" value="Gombe" />
          <Picker.Item label="Imo" value="Imo" />
          <Picker.Item label="Jigawa" value="Jigawa" />
          <Picker.Item label="Jos" value="Jos" />
          <Picker.Item label="Kaduna" value="Kaduna" />
          <Picker.Item label="Kano" value="Kano" />
          <Picker.Item label="Katsina" value="Katsina" />
          <Picker.Item label="Kebbi" value="Kebbi" />
          <Picker.Item label="Kogi" value="Kogi" />
          <Picker.Item label="Kwara" value="Kwara" />
          <Picker.Item label="Lagos" value="Lagos" />
          <Picker.Item label="Nasarawa" value="Nasarawa" />
          <Picker.Item label="Niger" value="Niger" />
          <Picker.Item label="Ogun" value="Ogun" />
          <Picker.Item label="Ondo" value="Ondo" />
          <Picker.Item label="Osun" value="Osun" />
          <Picker.Item label="Plateau" value="Plateau" />
          <Picker.Item label="Rivers" value="Rivers" />
          <Picker.Item label="Sokoto" value="Sokoto" />
          <Picker.Item label="Taraba" value="Taraba" />
          <Picker.Item label="Yobe" value="Yobe" />
          <Picker.Item label="Zamfara" value="Zamfara" />
        </Picker>
        <Picker selectedValue={formData.age} style={styles.picker} onValueChange={(value) => handleChange("age", value)}>
          <Picker.Item label="Age" value="" />
          <Picker.Item label="10 - 20" value="10 - 20" />
          <Picker.Item label="20 - 30" value="20 - 30" />
          <Picker.Item label="30 - 40" value="30 - 40" />
          <Picker.Item label="40 - 50" value="40 - 50" />
          <Picker.Item label="50 - 60" value="50 - 60" />
          <Picker.Item label="60 - 70" value="60 - 70" />
          <Picker.Item label="70 - 80" value="70 - 80" />
        </Picker>
        <Picker selectedValue={formData.gender} style={styles.picker} onValueChange={(value) => handleChange("gender", value)}>
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      {/* Farm Information */}
      <View style={styles.sectionHeader}>
        <Icon name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Farm Information</Text>
      </View>
      <View style={styles.formGroup}>
      <Picker selectedValue={formData.state} style={styles.picker} onValueChange={(value) => handleChange("state", value)}>
          <Picker.Item label="Select State" value="" />
            <Picker.Item label="Abia" value="Abia" />
            <Picker.Item label="Adamawa" value="Adamawa" />
            <Picker.Item label="Akwa Ibom" value="Akwa Ibom" />
            <Picker.Item label="Anambra" value="Anambra" />
            <Picker.Item label="Bauch" value="Bauchi" />
            <Picker.Item label="Bayelsa" value="Bayelsa" />
            <Picker.Item label="Benue" value="Benue" />
            <Picker.Item label="Borno" value="Borno" />
            <Picker.Item label="Cross River" value="Cross River" />
            <Picker.Item label="Delta" value="Delta" />
            <Picker.Item label="Ebonyi" value="Ebonyi" />
            <Picker.Item label="Edo" value="Edo" />
            <Picker.Item label="Ekiti" value="Ekiti" />
            <Picker.Item label="Enugu" value="Enugu" />
            <Picker.Item label="Gombe" value="Gombe" />
            <Picker.Item label="Imo" value="Imo" />
            <Picker.Item label="Jigawa" value="Jigawa" />
            <Picker.Item label="Jos" value="Jos" />
            <Picker.Item label="Kaduna" value="Kaduna" />
            <Picker.Item label="Kano" value="Kano" />
            <Picker.Item label="Katsina" value="Katsina" />
            <Picker.Item label="Kebbi" value="Kebbi" />
            <Picker.Item label="Kogi" value="Kogi" />
            <Picker.Item label="Kwara" value="Kwara" />
            <Picker.Item label="Lagos" value="Lagos" />
            <Picker.Item label="Nasarawa" value="Nasarawa" />
            <Picker.Item label="Niger" value="Niger" />
            <Picker.Item label="Ogun" value="Ogun" />
            <Picker.Item label="Ondo" value="Ondo" />
            <Picker.Item label="Osun" value="Osun" />
            <Picker.Item label="Plateau" value="Plateau" />
            <Picker.Item label="Rivers" value="Rivers" />
            <Picker.Item label="Sokoto" value="Sokoto" />
            <Picker.Item label="Taraba" value="Taraba" />
            <Picker.Item label="Yobe" value="Yobe" />
            <Picker.Item label="Zamfara" value="Zamfara" />
        </Picker>
        <Picker selectedValue={formData.localGovernment} style={styles.picker} onValueChange={(value) => handleChange("localGovernment", value)}>
          <Picker.Item label="Local Government" value="" />
          <Picker.Item label="Kaduna" value="Kaduna" />
          <Picker.Item label="Abuja" value="Abuja" />
          <Picker.Item label="Jigawa" value="Jigawa" />
          <Picker.Item label="Katsina" value="Katsina" />
        </Picker>
        <Picker selectedValue={formData.farmingSeason} style={styles.picker} onValueChange={(value) => handleChange("farmingSeason", value)}>
          <Picker.Item label="Farming Season" value="" />
          <Picker.Item label="Dry Season" value="Dry Season" />
          <Picker.Item label="Rainy Season" value="Rainy Season" />
        </Picker>
        <Picker selectedValue={formData.primaryCrop} style={styles.picker} onValueChange={(value) => handleChange("primaryCrop", value)}>
          <Picker.Item label="Primary Crop" value="" />
            <Picker.Item label="Beans" value="Beans" />
            <Picker.Item label="Cabbage" value="Cabbage" />
            <Picker.Item label="Carrot" value="Carrot" />
            <Picker.Item label="Cucumber" value="Cucumber" />
            <Picker.Item label="Garlic" value="Garlic" />
            <Picker.Item label="Groundnut" value="Groundnut" />
            <Picker.Item label="Maize" value="Maize" />
            <Picker.Item label="Onion" value="Onion" />
            <Picker.Item label="Potato" value="Potato" />
            <Picker.Item label="Rice" value="Rice" />
            <Picker.Item label="Sugarcane" value="Sugarcane" />
            <Picker.Item label="Tomato" value="Tomato" />
            <Picker.Item label="Wheat" value="Wheat" />
            <Picker.Item label="Yam" value="Yam" />
        </Picker>
        <Picker selectedValue={formData.secondaryCrop} style={styles.picker} onValueChange={(value) => handleChange("secondaryCrop", value)}>
          <Picker.Item label="Secondary Crop" value="" />
            <Picker.Item label="Beans" value="Beans" />
            <Picker.Item label="Cabbage" value="Cabbage" />
            <Picker.Item label="Carrot" value="Carrot" />
            <Picker.Item label="Cucumber" value="Cucumber" />
            <Picker.Item label="Garlic" value="Garlic" />
            <Picker.Item label="Groundnut" value="Groundnut" />
            <Picker.Item label="Maize" value="Maize" />
            <Picker.Item label="Onion" value="Onion" />
            <Picker.Item label="Potato" value="Potato" />
            <Picker.Item label="Rice" value="Rice" />
            <Picker.Item label="Sugarcane" value="Sugarcane" />
            <Picker.Item label="Tomato" value="Tomato" />
            <Picker.Item label="Wheat" value="Wheat" />
            <Picker.Item label="Yam" value="Yam" />
        </Picker>
        <Picker selectedValue={formData.farmOwnership} style={styles.picker} onValueChange={(value) => handleChange("farmOwnership", value)}>
          <Picker.Item label="Farm Ownership" value="" />
          <Picker.Item label="Self Owned" value="Self Owned" />
          <Picker.Item label="Rent" value="Rent" />
        </Picker>
      </View>

      {/* Geospatial Information */}
      <View style={styles.sectionHeader}>
        <Icon name="map" size={24} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Geospatial Information</Text>
      </View>
      <Picker selectedValue={formData.coordinateSystem} style={styles.picker} onValueChange={(value) => handleChange("coordinateSystem", value)}>
          <Picker.Item label="Coordinate System" value="" />
          <Picker.Item label="WGS 84" value="WGS 84" />
        </Picker>
        <Picker selectedValue={formData.coordinateFormat} style={styles.picker} onValueChange={(value) => handleChange("coordinateFormat", value)}>
          <Picker.Item label="Coordinate Format" value="" />
            <Picker.Item label="Decimal Degrees" value="Decimal Degrees" />
            <Picker.Item label="Degrees, Minutes and Seconds" value="Degrees, Minutes and Seconds" />
            <Picker.Item label="Degrees and Decimal Minutes" value="Degrees and Decimal Minutes" />
        </Picker>
        <TextInput style={styles.input} placeholder="Calculated Area" value={formData.calculatedArea} onChangeText={(text) => handleChange("calculatedArea", text)} />
      <View style={styles.formGroup}>
        <TextInput style={styles.input} placeholder="Latitude" value={formData.latitude} onChangeText={(text) => handleChange("latitude", text)} />
        <TextInput style={styles.input} placeholder="Longitude" value={formData.longitude} onChangeText={(text) => handleChange("longitude", text)} />
      </View>
      <TouchableOpacity style={styles.button} onPress={getCoordinates}>
        <Icon name="location-on" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Get Farm Coordinates</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Register Farmer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    padding: 20,
    backgroundColor: "#F4F4F4",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#bdd1d0"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8, // Space between icon and text
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginLeft: 10, // Adjust space between the icon and text
  },
  submitButton: {
    backgroundColor: "#231369",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    marginRight: 10, // Adjust space between the icon and the text
  },
};

export default RegisterFarmer;
