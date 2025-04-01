import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

const FarmerDetail = () => {
  const route = useRoute();
  const { id } = route.params;
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFarmer = async () => {
      const farmerRef = doc(firestore, 'farmers', id);
      const farmerSnapshot = await getDoc(farmerRef);

      if (farmerSnapshot.exists()) {
        setFarmer(farmerSnapshot.data());
      } else {
        console.log('No such farmer!');
      }
      setLoading(false);
    };

    fetchFarmer();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Image source={require("../assets/cosmologo.png")} style={styles.logo} />
        <View>
          <Text style={styles.title}>Centre for Climate Smart Agriculture</Text>
          <Text style={styles.subtitle}>Farmer Information</Text>
        </View>
      </View>
      {farmer ? (
        <View style={styles.detailsContainer}>
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}><Icon name="user" size={18} color="#ffffff" /> Personal Information</Text>
            <Text style={styles.detail}><Text style={styles.label}>Reg ID:</Text> {farmer.farmerID}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Last Name:</Text> {farmer.lastname}</Text>
            <Text style={styles.detail}><Text style={styles.label}>First Name:</Text> {farmer.firstname}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Middle Name:</Text> {farmer.middlename}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Phone:</Text> {farmer.phone}</Text>
            <Text style={styles.detail}><Text style={styles.label}>WhatsApp Number:</Text> {farmer.whatsappNumber}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Email:</Text> {farmer.email}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Gender:</Text> {farmer.gender}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Age:</Text> {farmer.age}</Text>
            <Text style={styles.detail}><Text style={styles.label}>NIN:</Text> {farmer.nin}</Text>
            <Text style={styles.detail}><Text style={styles.label}>BVN:</Text> {farmer.bvn}</Text>
            <Text style={styles.detail}><Text style={styles.label}>State of Residence:</Text> {farmer.state}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Highest Qualification:</Text> {farmer.highestQualification}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Marital State:</Text> {farmer.maritalStatus}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Employment Status:</Text> {farmer.employmenyStatus}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}><Icon name="leaf" size={18} color="#ffffff" /> Farm Information</Text>
            <Text style={styles.detail}><Text style={styles.label}>Farm Size:</Text> {farmer.farmSize} acres</Text>
            <Text style={styles.detail}><Text style={styles.label}>Primary Crops:</Text> {farmer.primaryCrop}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Secondary Crops:</Text> {farmer.secondaryCrop?.length > 0 ? farmer.secondaryCrop.join(", ") : "N/A"}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Farm Ownership:</Text> {farmer.farmOwnership}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Farm Location:</Text> {farmer.state}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Local Government:</Text> {farmer.localGovernment}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Ward:</Text> {farmer.ward}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Polling Unit:</Text> {farmer.pollingUnit}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Farming Season:</Text> {farmer.farmingSeason}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}><Icon name="map-marker" size={18} color="#ffffff" /> Geospatial Information</Text>
            <Text style={styles.detail}><Text style={styles.label}>Coordinates:</Text> {farmer.latitude}, {farmer.longitude}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Coordinate system:</Text> {farmer.coordinateSystem}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Coordinate Format:</Text> {farmer.coordinateFormat}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noData}>No farmer data available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#7998b9",
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});

export default FarmerDetail;
