import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, ActivityIndicator  } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, getDoc, doc, onSnapshot  } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { Appbar, Card } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons';


const Dashboard = () => {
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [farmersByState, setFarmersByState] = useState({});
  const [farmersByCrop, setFarmersByCrop] = useState({});
  //...other 
  const [farmersByGender, setFarmersByGender] = useState({});
  const [farmersByfarmOwnership, setfarmersByfarmOwnership] = useState({});
  const [farmersByFarmingSeason, setfarmersByFarmingSeason] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnim] = useState(new Animated.Value(-250));

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState('');


  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const farmersCollection = collection(firestore, "farmers");

    // Real-time listener for Firestore
    const unsubscribe = onSnapshot(farmersCollection, (snapshot) => {
      const farmersList = snapshot.docs.map((doc) => doc.data());
      setTotalFarmers(farmersList.length);

      const stateCount = {};
      const cropCount = {};
      const genderCount = {};
      const ownershipCount = {};
      const seasonCount = {};

      farmersList.forEach((farmer) => {
        stateCount[farmer.state] = (stateCount[farmer.state] || 0) + 1;
        cropCount[farmer.primaryCrop] = (cropCount[farmer.primaryCrop] || 0) + 1;
        genderCount[farmer.gender] = (genderCount[farmer.gender] || 0) + 1;
        ownershipCount[farmer.farmOwnership] = (ownershipCount[farmer.farmOwnership] || 0) + 1;
        seasonCount[farmer.farmingSeason] = (seasonCount[farmer.farmingSeason] || 0) + 1;
      });

      setFarmersByState(stateCount);
      setFarmersByCrop(cropCount);
      setFarmersByGender(genderCount);
      setfarmersByfarmOwnership(ownershipCount);
      setfarmersByFarmingSeason(seasonCount);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };

  const toggleMenu = () => {
    Animated.timing(menuAnim, {
      toValue: menuOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuOpen(!menuOpen);
  };



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Set current date and time
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    setCurrentDateTime(formatted);
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (!userData) return <Text>No user data found.</Text>;




  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={toggleMenu} />
        <Appbar.Content title="Dashboard" titleStyle={{ color: "white" }} />
       
      </Appbar.Header>

      {/* Update to bring menu forward */}
     <Animated.View style={[styles.menuContainer, { left: menuAnim, zIndex: 1, opacity: menuOpen ? 1 : 0.8 }]}>  
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("RegsiterFarmer")}>
          <Ionicons name="person-add" size={20} color="white" />
          <Text style={styles.menuText}>Register Farmer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("FarmerList")}>
          <Ionicons name="list" size={20} color="white" />
          <Text style={styles.menuText}>Farmer List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("SearchFarmer")}>
          <Ionicons name="search" size={20} color="white" />
          <Text style={styles.menuText}>Search Farmers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("GenerateFarmerData")}>
          <Ionicons name="document" size={20} color="white" />
          <Text style={styles.menuText}>Generate certificate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content}>

        <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="My Profile" style={{backgroundColor:"#bdd1d0", marginBottom: "45px", color: "#ffffff", fontWeight: "bolder"}} left={() => <Icon name="person" size={28} color="#4CAF50"/>} />
        <Card.Content>
          <View style={styles.infoRow}>
            <Icon name="person-outline" size={20} color="#555" style={styles.icon} />
            <Text style={styles.text}>Name: {userData.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#555" style={styles.icon} />
            <Text style={styles.text}>Email: {userData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="access-time" size={20} color="#555" style={styles.icon} />
            <Text style={styles.text}>Login: {currentDateTime}</Text>
          </View>
        </Card.Content>
      </Card>
    </View>








 {/*
        <Card style={styles.card}>
          <Text style={styles.title}>Total Number of Registered Farmers</Text>
          <Text style={styles.number}>{totalFarmers}</Text>
        </Card>

        <Card style={styles.card}>
        <BarChart
          data={{
            labels: Object.keys(farmersByState),
            datasets: [{ data: Object.values(farmersByState) }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={styles.chartConfig}
          style={styles.chart}
        />
        <Text style={styles.chartTitle}>Registered farmer per state</Text>
        </Card>
    
        <Card style={styles.card}>
        <PieChart
          data={Object.keys(farmersByCrop).map((key, index) => ({
            name: `${key} (${farmersByCrop[key]})`,
            population: farmersByCrop[key],
            color: ["#FFA500", "#008000", "#800080", "#D7D7D7", "#A3C1AD", "#008E97"][index % 6],
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))}
          width={Dimensions.get("window").width - 40}
          height={200}
          chartConfig={styles.chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        <Text style={styles.chartTitle}>Registered farmer based on primary crop type</Text>
        </Card>


        <Card style={styles.card}>
        <PieChart
          data={Object.keys(farmersByGender).map((key, index) => ({
            name: `${key} (${farmersByGender[key]})`,
            population: farmersByGender[key],
            color: ["#A3C1AD", "#008E97", "#800080"][index % 3],
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))}
          width={Dimensions.get("window").width - 40}
          height={200}
          chartConfig={styles.chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        <Text style={styles.chartTitle}>Registered farmer based on gender</Text>
        </Card>

        <Card style={styles.card}>
        <PieChart
          data={Object.keys(farmersByfarmOwnership).map((key, index) => ({
            name: `${key} (${farmersByfarmOwnership[key]})`,
            population: farmersByfarmOwnership[key],
            color: ["#005f69", "#AFDBF5", "#800080"][index % 3],
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))}
          width={Dimensions.get("window").width - 40}
          height={200}
          chartConfig={styles.chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        <Text style={styles.chartTitle}>Registered farmer based on farm ownership</Text>
        </Card>


        <Card style={styles.card}>
        <PieChart
          data={Object.keys(farmersByFarmingSeason).map((key, index) => ({
            name: `${key} (${farmersByFarmingSeason[key]})`,
            population: farmersByFarmingSeason[key],
            color: ["#007791", "#008000", "#800080"][index % 3],
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))}
          width={Dimensions.get("window").width - 40}
          height={200}
          chartConfig={styles.chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        <Text style={styles.chartTitle}>Registered farmer based on farming season</Text>
        </Card>
*/}

      </ScrollView>
    </View>
  );
};

const styles = {
  container: { 
    flex: 1, 
    backgroundColor: "#F4F4F4" 
  },
  header: { 
    backgroundColor: "#002244"
  },
  menuContainer: {
    position: "absolute", 
    left: -250, 
    top: 60, 
    width: 250,
    backgroundColor: "#002244", 
    paddingVertical: 20,
    borderRadius: 10, 
    elevation: 10, 
    shadowColor: "#000", 
    marginTop: 0
  },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15 },
  menuText: { 
    color: "white", 
    fontSize: 16, 
    marginLeft: 10 
  },
  content: { 
    padding: 20 
  },
  card: {
    backgroundColor: "white", 
    padding: 10, borderRadius: 10,
    alignItems: "center", 
    marginBottom: 20, 
    elevation: 5,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333" 
  },
  chartTitle: { 
    fontSize: 12, 
    fontWeight: "lighter", 
    color: "#333", 
    textAlign: "center" 
  },
  number: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#007AFF", 
    marginTop: 10, 
    textAlign: "center" 
  },
  chart: { 
    borderRadius: 10, 
    marginVertical: 10 
  },
  chartConfig: {
    backgroundGradientFrom: "#FFF",
    backgroundGradientTo: "#FFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  },

   infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
};

export default Dashboard;
