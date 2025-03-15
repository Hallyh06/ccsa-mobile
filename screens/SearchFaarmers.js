import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const SearchFaarmers = ({ navigation }) => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    state: "",
    gender: "",
    primaryCrop: "",
    secondaryCrop: "",
    farmingSeason: "",
    farmOwnership: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFarmers = async () => {
      const farmersCollection = collection(firestore, "farmers");
      const farmersSnapshot = await getDocs(farmersCollection);
      const farmersList = farmersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFarmers(farmersList);
    };
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) => {
    return (
      (farmer.name.toLowerCase().includes(search.toLowerCase()) ||
        farmer.nin.includes(search) ||
        farmer.phone.includes(search)) &&
      (filter.state ? farmer.state === filter.state : true) &&
      (filter.gender ? farmer.gender === filter.gender : true) &&
      (filter.primaryCrop ? farmer.primaryCrop === filter.primaryCrop : true) &&
      (filter.secondaryCrop ? farmer.secondaryCrop === filter.secondaryCrop : true) &&
      (filter.farmingSeason ? farmer.farmingSeason === filter.farmingSeason : true) &&
      (filter.farmOwnership ? farmer.farmOwnership === filter.farmOwnership : true)
    );
  });

  const indexOfLastFarmer = currentPage * itemsPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - itemsPerPage;
  const currentFarmers = filteredFarmers.slice(indexOfFirstFarmer, indexOfLastFarmer);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
        <Image source={require("../assets/cosmologo.png")} style={styles.logo} />
        <View>
          <Text style={styles.title}>Centre for Climate Smart Agriculture</Text>
          <Text style={styles.subtitle}>Search Registered Farmers</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by Name, NIN, or Phone"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={filter.state}
        onValueChange={(value) => setFilter({ ...filter, state: value })}
        style={styles.picker}
      >
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
      </View>
      
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={filter.gender}
        onValueChange={(value) => setFilter({ ...filter, gender: value })}
        style={styles.picker}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>
      </View>

      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={filter.primaryCrop}
        onValueChange={(value) => setFilter({ ...filter, primaryCrop: value })}
        style={styles.picker}
      >
        <Picker.Item label="Select Primary Crop" value="" />
        <Picker.Item label="Maize" value="Maize" />
        <Picker.Item label="Groundnut" value="Groundnut" />
        <Picker.Item label="Beans" value="Beans" />
      </Picker>
      </View>

      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={filter.secondaryCrop}
        onValueChange={(value) => setFilter({ ...filter, secondaryCrop: value })}
        style={styles.picker}
      >
        <Picker.Item label="Select Secondary Crop" value="" />
        <Picker.Item label="Maize" value="Maize" />
        <Picker.Item label="Groundnut" value="Groundnut" />
        <Picker.Item label="Beans" value="Beans" />
      </Picker>
      </View>

      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={filter.farmingSeason}
        onValueChange={(value) => setFilter({ ...filter, farmingSeason: value })}
        style={styles.picker}
      >
        <Picker.Item label="Select Farming Season" value="" />
        <Picker.Item label="Rainy Season" value="Rainy Season" />
        <Picker.Item label="Dry Season" value="Dry Season" />
      </Picker>
      </View>

      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={filter.farmOwnership}
        onValueChange={(value) => setFilter({ ...filter, farmOwnership: value })}
        style={styles.picker}
      >
        <Picker.Item label="Select Farm Ownership" value="" />
        <Picker.Item label="Self Owned" value="Self Owned" />
        <Picker.Item label="Rent" value="Rent" />
      </Picker>
      </View>

      <FlatList
        data={currentFarmers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("FarmerDetail", { id: item.id })}
          >
            <Text style={styles.cardText}>{indexOfFirstFarmer + index + 1}. {item.name}</Text>
            <Text style={styles.cardText}>📞 {item.phone} | NIN: {item.nin}</Text>
            <Text style={styles.cardText}>🌾 {item.primaryCrop} | 📍 {item.state} | ⚥ {item.gender}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 20, marginTop: 20 },
    logo: { width: 50, height: 50, marginRight: 10 },
    title: { fontSize: 14, fontWeight: "bold", color: "#333" },
    subtitle: { fontSize: 14, color: "#666" },
    backButton: {
      marginRight: 5,
      padding: 5,
    },
    searchInput: {
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    card: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    cardText: { fontSize: 14, color: "#333" },
    pagination: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
    pageButton: { marginHorizontal: 5, padding: 10, color: "#007bff", fontSize: 16 },
    activePage: { fontWeight: "bold", color: "#0056b3" },
    pickerContainer: {
      backgroundColor: "#fff",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      height: 50,
      justifyContent: "center",
    },
    picker: {
      width: "100%",
      height: 55,
      color: "#333",
    },
  });

export default SearchFaarmers;
