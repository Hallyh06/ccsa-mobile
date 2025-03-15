import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Picker, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Icon from 'react-native-vector-icons/MaterialIcons';

const FarmersList = ({ navigation }) => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ cropType: "", state: "", gender: "" });
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
      (filter.cropType ? farmer.primaryCrop === filter.cropType : true) &&
      (filter.state ? farmer.state === filter.state : true) &&
      (filter.gender ? farmer.gender === filter.gender : true)
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
          <Text style={styles.subtitle}>Registered Farmers</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by Name, NIN, or Phone"
        value={search}
        onChangeText={setSearch}
      />

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

      <View style={styles.pagination}>
        {[...Array(Math.ceil(filteredFarmers.length / itemsPerPage)).keys()].map((num) => (
          <TouchableOpacity key={num} onPress={() => setCurrentPage(num + 1)}>
            <Text style={[styles.pageButton, currentPage === num + 1 && styles.activePage]}>
              {num + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
});

export default FarmersList;
