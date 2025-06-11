// screens/UpdateFarmerForm.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firestore } from '../firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from "expo-location";
import { Dropdown } from 'react-native-element-dropdown';
import nigeriaData from './data/nigeriaData.json';
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "react-native-elements"; // Import CheckBox


const cropOptions = ["Beans", "Cabbage", "Carrot", "Cassava", "Corn", "Onions", "Rice", "Tomato", "Wheat"]; // Crop List

const searchCropOptions = [
  { label: "Maize", value: "Maize" },
  { label: "Rice", value: "Rice" },
  { label: "Cassava", value: "Cassava" },
  { label: "Yam", value: "Yam" },
  { label: "Beans", value: "Beans" },
];

//Produce Categories
const produceCategories = {
  Livestock: ["Cows", "Rams", "Goats"],
  Poultry: ["Local Chickens", "Broilers", "Layers"],
  Crops: {
    Vegetables: ["Carrot", "Tomato", "Onion", "Cabbage"],
    Fruits: ["Mango", "Banana", "Orange", "Pineapple"],
    Tubers: ["Cassava", "Yam", "Irish Potato", "Sweet Potato", "Cocoa Yam"],
    Grains: ["Rice", "Millet", "Wheat"]
  }
};


const UpdateFarmerForm = () => {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
    const [selectedLGA, setSelectedLGA] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedPU, setSelectedPU] = useState('');
    const [subOptions, setSubOptions] = useState([]);
    const [cropSubOptions, setCropSubOptions] = useState([]);

  const [area, setArea] = useState(route.params?.area || '');
  const [farmYields, setFarmYields] = useState([{ year: "", season: "", crop: "", quantity: "" }]);

  const [formData, setFormData] = useState({
    // Add more fields as needed
    farmState: selectedState,
    farmLocalGovernment: selectedLGA,
    farmWard: selectedWard,
    farmPollingUnit: "",
    farmSoilType: "",
    pHLevel: "",
    fertility: "",
    produceCategory: "",       // Top level: Livestock, Poultry, Crops
        cropType: "",              // Crops only: Vegetables, Fruits, etc.
        primaryProduce: "",        // Final produce selection
        secondaryCrop: [],
        farmSize: "",
        farmingSeason: "",
        farmOwnership: "",
        farmLatitude: "",
        farmLongitude: "",
        farmCoordinateFormat: "",
        farmCoordinateSystem: "",
        farmCalculatedArea: ""
  });


  const states = nigeriaData.map(item => item.state);
  
    const lgas = selectedState
      ? nigeriaData.find(s => s.state === selectedState)?.lgas.map(lga => lga.lga) || []
      : [];
  
    const wards = selectedState && selectedLGA
      ? nigeriaData
          .find(s => s.state === selectedState)?.lgas
          .find(lga => lga.lga === selectedLGA)?.wards.map(w => w.ward) || []
      : [];
  
  const pollingUnits = selectedState && selectedLGA && selectedWard
      ? nigeriaData
          .find(s => s.state === selectedState)?.lgas
          .find(lga => lga.lga === selectedLGA)?.wards
          .find(w => w.ward === selectedWard)?.pollingUnits || []
      : [];


    const addYieldEntry = () => {
    setFarmYields([...farmYields, { year: "", season: "", crop: "", quantity: "" }]);
  };

  const handleYieldChange = (index, name, value) => {
    const updatedYields = [...farmYields];
    updatedYields[index][name] = value;
    setFarmYields(updatedYields);
  };

  useEffect(() => {
    const fetchFarmer = async () => {
      const docRef = doc(firestore, 'farmers', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setFormData(snapshot.data());
      }
    };
    fetchFarmer();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

     //.....produce slection
    if (field === "produceCategory") {
      setFormData({ ...formData, produceCategory: value, cropType: "", primaryProduce: "" });
  
      if (value === "Crops") {
        setSubOptions(Object.keys(produceCategories.Crops));
      } else {
        setSubOptions(produceCategories[value]);
      }
    } else if (field === "cropType") {
      setFormData({ ...formData, cropType: value, primaryProduce: "" });
      setCropSubOptions(produceCategories.Crops[value]);
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };



  const handleUpdate = async () => {
    const docRef = doc(firestore, 'farmers', id);
    await updateDoc(docRef, formData);
    navigation.goBack(); // Navigate back to detail screen
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

   const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to fetch coordinates.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setFormData({
      ...formData,
      farmLatitude: location.coords.latitude.toString(),
      farmLongitude: location.coords.longitude.toString(),
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

      <Text style={styles.title}>Update Farmer Details</Text>

      {/* Farm Information */}
      <View style={styles.sectionHeader}>
        <Icon name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Farm Information</Text>
      </View>
      <View style={styles.formGroup}>
      
      
        <Picker selectedValue={formData.farmingSeason} style={styles.picker} onValueChange={(value) => handleChange("farmingSeason", value)}>
          <Picker.Item label="Farming Season" value="" />
          <Picker.Item label="Dry Season" value="Dry Season" />
          <Picker.Item label="Rainy Season" value="Rainy Season" />
          <Picker.Item label="Both Seasons" value="Both Seasons" />
        </Picker>

        {/*
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
        */}


        <Picker
          selectedValue={formData.produceCategory}
          style={styles.picker}
          onValueChange={(value) => handleChange("produceCategory", value)}
        >
          <Picker.Item label="Select Produce Category" value="" />
          <Picker.Item label="Livestock" value="Livestock" />
          <Picker.Item label="Poultry" value="Poultry" />
          <Picker.Item label="Crops" value="Crops" />
        </Picker>

        {formData.produceCategory === "Crops" && (
          <Picker
            selectedValue={formData.cropType}
            style={styles.picker}
            onValueChange={(value) => handleChange("cropType", value)}
          >
            <Picker.Item label="Select Crop Type" value="" />
            {subOptions.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
        )}

        {formData.produceCategory && formData.produceCategory !== "Crops" && (
          <Picker
            selectedValue={formData.primaryProduce}
            style={styles.picker}
            onValueChange={(value) => handleChange("primaryProduce", value)}
          >
            <Picker.Item label="Select Produce" value="" />
            {subOptions.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        )}

        {formData.cropType && (
          <Picker
            selectedValue={formData.primaryProduce}
            style={styles.picker}
            onValueChange={(value) => handleChange("primaryProduce", value)}
          >
            <Picker.Item label="Select Produce" value="" />
            {cropSubOptions.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        )}















        {/* Secondary Crops as Checkboxes */}
        <Text style={styles.label}>Select Secondary Crops:</Text>
        <Dropdown
              style={styles.input}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={searchCropOptions}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Crop"
              searchPlaceholder="Search crop..."
              value={cropOptions}
              onChange={item => {
                handleYieldChange(index, "crop", item.value);
              }}
            />
        <Picker selectedValue={formData.farmOwnership} style={styles.picker} onValueChange={(value) => handleChange("farmOwnership", value)}>
          <Picker.Item label="Farm Ownership" value="" />
          <Picker.Item label="Corporative" value="Corporative" />
          <Picker.Item label="Farm/Service" value="Farm/Service" />
          <Picker.Item label="Government Owned" value="Government Owned" />
          <Picker.Item label="Inherited" value="Inherited" />
          <Picker.Item label="NGO" value="NGO" />
          <Picker.Item label="Rent" value="Rent" />
          <Picker.Item label="Self Owned" value="Self Owned" />
        </Picker>

        <Picker selectedValue={formData.soilType} style={styles.picker} onValueChange={(value) => handleChange("soilType", value)}>
          <Picker.Item label="Select Soil Type" value="" />
          <Picker.Item label="Clay Soil" value="Clay Soil" />
        <Picker.Item label="Loamy Soil" value="Loamy Soil" />
        <Picker.Item label="Sandy Soil" value="Sandy Soil" />
        <Picker.Item label="Silty Soil" value="Silty Soil" />
        <Picker.Item label="Peaty Soil" value="Peaty Soil" />
        </Picker>

        <TextInput style={styles.input} placeholder="Soil pH Level" value={formData.pHLevel} keyboardType="phone-pad" onChangeText={(text) => handleChange("pHLevel", text)} />

        <Picker selectedValue={formData.fertility} style={styles.picker} onValueChange={(value) => handleChange("fertility", value)}>
          <Picker.Item label="Select Soil Fertility" value="" />
          <Picker.Item label="Low Fertility" value="Low Fertility" />
          <Picker.Item label="Medium Fertility" value="Medium Fertility" />
          <Picker.Item label="High Fertility" value="High Fertility" />
        </Picker>


      </View>

      {/* Farm Yield Information */}
      <View style={styles.sectionHeader}>
        <Icon name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Estimated Farm Yield</Text>
      </View>
      <View style={{ marginTop: 20 }}>

        {farmYields.map((yieldItem, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Picker
              selectedValue={yieldItem.year}
              style={styles.picker}
              onValueChange={(value) => handleYieldChange(index, "year", value)}
            >
              <Picker.Item label="Select Year" value="" />
              <Picker.Item label="2021" value="2021" />
              <Picker.Item label="2022" value="2022" />
              <Picker.Item label="2023" value="2023" />
              <Picker.Item label="2024" value="2024" />
              <Picker.Item label="2025" value="2025" />
            </Picker>

            <Picker
              selectedValue={yieldItem.season}
              style={styles.picker}
              onValueChange={(value) => handleYieldChange(index, "season", value)}
            >
              <Picker.Item label="Select Farming Season" value="" />
              <Picker.Item label="Rainy Season" value="Rainy Season" />
              <Picker.Item label="Dry Season" value="Dry Season" />
            </Picker>

            <Dropdown
              style={styles.input}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={searchCropOptions}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Crop"
              searchPlaceholder="Search crop..."
              value={yieldItem.crop}
              onChange={item => {
                handleYieldChange(index, "crop", item.value);
              }}
            />


            <TextInput
              style={styles.input}
              placeholder="Enter Quantity (e.g., 100 bags)"
              value={yieldItem.quantity}
              onChangeText={(text) => handleYieldChange(index, "quantity", text)}
            />
          </View>
        ))}

        <TouchableOpacity onPress={addYieldEntry} style={styles.addYieldButton}>
          <Text style={{ color: "#fff", textAlign: "center" }}>+ Add Yield</Text>
        </TouchableOpacity>
      </View>





      {/* Geospatial Information */}
      <View style={styles.sectionHeader}>
        <Icon name="map" size={24} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Geospatial Information</Text>
      </View>

      
      
          
            <Picker
              selectedValue={selectedState}
              style={styles.picker}
              onValueChange={(value) => {
                setSelectedState(value);
                setSelectedLGA('');
                setSelectedWard('');
                setSelectedPU('');
              }}>
              <Picker.Item label="Select State of Farm Land" value="" />
              {states.map((state, index) => (
                <Picker.Item key={index} label={state} value={state} />
              ))}
            </Picker>
      
            {lgas.length > 0 && (
              <>
                <Picker
                  selectedValue={selectedLGA}
                  style={styles.picker}
                  onValueChange={(value) => {
                    setSelectedLGA(value);
                    setSelectedWard('');
                    setSelectedPU('');
                  }}>
                  <Picker.Item label="Select Local Government Area" value="" />
                  {lgas.map((lga, index) => (
                    <Picker.Item key={index} label={lga} value={lga} />
                  ))}
                </Picker>
              </>
            )}
      
            {wards.length > 0 && (
              <>
                <Picker
                  selectedValue={selectedWard}
                  style={styles.picker}
                  onValueChange={(value) => {
                    setSelectedWard(value);
                    setSelectedPU('');
                  }}>
                  <Picker.Item label="Select Ward" value="" />
                  {wards.map((ward, index) => (
                    <Picker.Item key={index} label={ward} value={ward} />
                  ))}
                </Picker>
              </>
            )}
      
            {pollingUnits.length > 0 && (
              <>
                <Text style={styles.label}>Polling Unit</Text>
                <Picker
                  selectedValue={selectedPU}
                  style={styles.picker}
                  onValueChange={(value) => setSelectedPU(value)}>
                  <Picker.Item label="Select Polling Unit" value="" />
                  {pollingUnits.map((pu, index) => (
                    <Picker.Item key={index} label={pu} value={pu} />
                  ))}
                </Picker>
              </>
            )}


      <Picker selectedValue={formData.coordinateSystem} style={styles.picker} onValueChange={(value) => handleChange("coordinateSystem", value)}>
          <Picker.Item label="Coordinate System" value="" />
          <Picker.Item label="WGS 84" value="WGS 84" />
        </Picker>
        <Picker selectedValue={formData.coordinateFormat} style={styles.picker} onValueChange={(value) => handleChange("coordinateFormat", value)}>
          <Picker.Item label="Coordinate Format" value="" />
            <Picker.Item label="Degrees, Minutes and Seconds" value="Degrees, Minutes and Seconds" />
        </Picker>
        <TextInput style={styles.input} placeholder="Calculated Area" value={formData.calculatedArea} onPress={() => navigation.navigate("FarmAreaCalculator")} onChangeText={(text) => handleChange("calculatedArea", text)} />
      <View style={styles.formGroup}>
        <TextInput style={styles.input} didabled placeholder="Latitude" value={formData.latitude} onChangeText={(text) => handleChange("latitude", text)} />
        <TextInput style={styles.input} didabled placeholder="Longitude" value={formData.longitude} onChangeText={(text) => handleChange("longitude", text)} />
      </View>
      <TouchableOpacity style={styles.buttonCoord} onPress={getCoordinates}>
        <Icon name="location-on" size={24} color="black" style={styles.icon} />
        <Text style={styles.buttonTextCoord}>Get Farm Coordinates</Text>
      </TouchableOpacity>

      {/* Add more fields as needed */}

      

      <TouchableOpacity
        style={styles.buttonX} 
        mode="contained" 
        onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  buttonX: {
    width: "100%",
    backgroundColor: "#13274F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#bdd1d0"
  },
  title:{
    textAlign: "center",
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
    marginTop: 5,
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginLeft: 10, // Adjust space between the icon and text
  },
  buttonCoord: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    borderRadius: 5,
    marginBottom: 20
  },
  buttonTextCoord: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    marginLeft: 10, // Adjust space between the icon and text
  },
  addYieldButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
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
});

export default UpdateFarmerForm;
