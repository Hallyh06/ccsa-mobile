import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { firestore } from "../firebaseConfig";
import * as Location from "expo-location";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CheckBox } from "react-native-elements"; // Import CheckBox

const cropOptions = ["Beans", "Cabbage", "Carrot", "Cassava", "Corn", "Onions", "Rice", "Tomato", "Wheat"]; // Crop List

const RegisterFarmer = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    nin: "",
    bvn: "",
    state: "",
    localGovernment: "",
    ward: "",
    pollingUnit: "",
    age: "",
    maritalStatus: "",
    highestQualification: "",
    employmenyStatus: "",
    gender: "",
    primaryCrop: "",
    secondaryCrop: [], // an array
    farmSize: "",
    farmingSeason: "",
    farmOwnership: "",
    latitude: "",
    longitude: "",
  });
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false); // Controls WhatsApp input visibility

  const generateFarmerID = () => {
    const date = new Date();
    return `CCSA-${date.toISOString().replace(/[-:.TZ]/g, "")}`;
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });

     // Check if phone number is exactly 11 digits
     if (name === "phone" && value.length === 11) {
      Alert.alert(
        "WhatsApp Number",
        "Is this your WhatsApp number?",
        [
          {
            text: "Yes",
            onPress: () => setFormData({ ...formData, whatsappNumber: value }),
          },
          {
            text: "No",
            onPress: () => setShowWhatsAppInput(true),
          },
        ],
        { cancelable: false }
      );
    }


  };


  const handleCheckboxChange = (crop) => {
    setFormData((prevState) => {
      const { secondaryCrop } = prevState;
      if (secondaryCrop.includes(crop)) {
        return { ...prevState, secondaryCrop: secondaryCrop.filter((item) => item !== crop) };
      } else {
        return { ...prevState, secondaryCrop: [...secondaryCrop, crop] };
      }
    });
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
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        phone: "",
        whatsappNumber: "",
        address: "",
        nin: "",
        bvn: "",
        state: "",
        localGovernment: "",
        ward: "",
        pollingUnit: "",
        age: "",
        maritalStatus: "",
        highestQualification: "",
        employmenyStatus: "",
        gender: "",
        primaryCrop: "",
        secondaryCrop: [],
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
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
        <TextInput style={styles.input} placeholder="First Name" value={formData.firstname} onChangeText={(text) => handleChange("firstname", text)} />
        <TextInput style={styles.input} placeholder="Middle Name" value={formData.middlename} onChangeText={(text) => handleChange("middlename", text)} />
        <TextInput style={styles.input} placeholder="Last Name" value={formData.lastname} onChangeText={(text) => handleChange("lastname", text)} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={formData.email} onChangeText={(text) => handleChange("email", text)} />
        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" maxLength={11} value={formData.phone} onChangeText={(text) => handleChange("phone", text)} />
          {/* Show WhatsApp number input if user selects 'No' */}
        {showWhatsAppInput && (
          <TextInput
            style={styles.input}
            placeholder="WhatsApp Number"
            keyboardType="phone-pad"
            maxLength={11}
            value={formData.whatsappNumber}
            onChangeText={(text) => handleChange("whatsappNumber", text)}
          />
        )}
        <TextInput style={styles.input} placeholder="NIN" keyboardType="phone-pad" value={formData.nin} onChangeText={(text) => handleChange("nin", text)} />
        <TextInput style={styles.input} placeholder="BVN" keyboardType="phone-pad" value={formData.bvn} onChangeText={(text) => handleChange("bvn", text)} />
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
        <Picker selectedValue={formData.maritalStatus} style={styles.picker} onValueChange={(value) => handleChange("maritalStatus", value)}>
          <Picker.Item label="Marital Status" value="" />
          <Picker.Item label="Single" value="Single" />
          <Picker.Item label="Married" value="Married" />
          <Picker.Item label="Devorced" value="Devorced" />
          <Picker.Item label="Widow" value="Widow" />
          <Picker.Item label="Widower" value="Widower" />
          <Picker.Item label="Seperated" value="Seperated" />
          <Picker.Item label="Engaged" value="Engaged" />
        </Picker>
        <Picker selectedValue={formData.gender} style={styles.picker} onValueChange={(value) => handleChange("gender", value)}>
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
        <Picker selectedValue={formData.highestQualification} style={styles.picker} onValueChange={(value) => handleChange("highestQualification", value)}>
          <Picker.Item label="Select Highest Qualification" value="" />
          <Picker.Item label="Ph.D" value="Ph.D" />
          <Picker.Item label="M.Sc" value="M.Sc" />
          <Picker.Item label="B.Sc" value="B.Sc" />
          <Picker.Item label="HND" value="HND" />
          <Picker.Item label="ND" value="ND" />
          <Picker.Item label="OND" value="OND" />
          <Picker.Item label="WASSCE" value="WASSCE" />
          <Picker.Item label="Primary School Certificate" value="Primary School Certificate" />
        </Picker>
        <Picker selectedValue={formData.employmenyStatus} style={styles.picker} onValueChange={(value) => handleChange("employmenyStatus", value)}>
          <Picker.Item label="Select Employment Status" value="" />
          <Picker.Item label="Employed" value="Employed" />
          <Picker.Item label="Unemployed" value="Unemployed" />
          <Picker.Item label="Self-Employed" value="Self-Employed" />
          <Picker.Item label="Retired" value="Retired" />
          <Picker.Item label="Resigned" value="Resigned" />
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

        <TextInput style={styles.input} placeholder="Ward" value={formData.ward} onChangeText={(text) => handleChange("ward", text)} />
        <TextInput style={styles.input} placeholder="Polling Unit" value={formData.pollingUnit} onChangeText={(text) => handleChange("pollingUnit", text)} />

        <Picker selectedValue={formData.farmingSeason} style={styles.picker} onValueChange={(value) => handleChange("farmingSeason", value)}>
          <Picker.Item label="Farming Season" value="" />
          <Picker.Item label="Dry Season" value="Dry Season" />
          <Picker.Item label="Rainy Season" value="Rainy Season" />
          <Picker.Item label="Both Seasons" value="Both Seasons" />
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
        {/* Secondary Crops as Checkboxes */}
        <Text style={styles.label}>Select Secondary Crops:</Text>
        {cropOptions.map((crop) => (
          <CheckBox
            key={crop}
            title={crop}
            checked={formData.secondaryCrop.includes(crop)}
            onPress={() => handleCheckboxChange(crop)}
          />
        ))}
        <Picker selectedValue={formData.farmOwnership} style={styles.picker} onValueChange={(value) => handleChange("farmOwnership", value)}>
          <Picker.Item label="Farm Ownership" value="" />
          <Picker.Item label="Self Owned" value="Self Owned" />
          <Picker.Item label="Inherited" value="Inherited" />
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
