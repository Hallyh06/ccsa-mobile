import React, { useState } from "react";
import { 
  View, Text, TextInput, Button, Alert, ActivityIndicator, ScrollView, Image, StyleSheet 
} from "react-native";
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import GenerateReport from "./GenerateReport";

const GenerateFarmerData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFarmer = async () => {
    if (!searchTerm) {
      Alert.alert("Error", "Please enter a phone number or NIN");
      return;
    }

    setLoading(true);
    try {
      const farmersRef = collection(firestore, "farmers");

      // Query for both phone number and NIN
      const q = query(
        farmersRef,
        or(where("phone", "==", searchTerm), where("nin", "==", searchTerm))
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        Alert.alert("Not Found", "No farmer found with this phone number or NIN.");
        setFarmerData(null);
      } else {
        querySnapshot.forEach((doc) => setFarmerData(doc.data()));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch farmer data.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={require("../assets/cosmologo.png")} style={styles.logo} />
        <View>
          <Text style={styles.title}>Centre for Climate Smart Agriculture</Text>
          <Text style={styles.subtitle}>Generate Farmer Certificate</Text>
        </View>
      </View> 
      
      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number or NIN"
        value={searchTerm}
        onChangeText={setSearchTerm}
        keyboardType="numeric"
      />

      {/* Fetch Button */}
      <Button title="Submit" onPress={fetchFarmer} color="#2c3e50" />
      
      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}

      {/* Display Farmer Data */}
      {farmerData && (
        <View style={styles.farmerCard}>
          <Text style={styles.sectionTitle}>Farmer Details</Text>
          <Text style={styles.detail}><Text style={styles.label}>Name:</Text> {farmerData.name}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Phone:</Text> {farmerData.phone}</Text>
          <Text style={styles.detail}><Text style={styles.label}>NIN:</Text> {farmerData.nin}</Text>
          <Text style={styles.detail}><Text style={styles.label}>State:</Text> {farmerData.state}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Primary Crop:</Text> {farmerData.primaryCrop}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Farm Size:</Text> {farmerData.farmSize} acres</Text>

          {/* Generate PDF Button */}
          <GenerateReport farmerData={farmerData} />
        </View>
      )}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#333"
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  loader: {
    marginVertical: 10,
  },
  farmerCard: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
});

export default GenerateFarmerData;
