import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, Modal, Image,  TouchableOpacity } from 'react-native';
import { Text, RadioButton, TextInput, Button, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { CheckBox } from "react-native-elements"; // Import CheckBox
import axios from 'axios'; // For making HTTP requests
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';  // your Firestore configuration
import Icon from 'react-native-vector-icons/MaterialIcons';
import nigeriaData from './data/nigeriaData.json';
import { verifyNIN } from '../utils/ninVerification'; // Adjust path if different


const API_ENDPOINT = 'https://e-nvs.digitalpulseapi.net/api/lookup/nin'; // Replace with your provider's URL
const API_KEY = 'CCVb73G1EDmPpU4z13s4BWA'; // Replace with your provider's API key



const RegisterFarmer = () => {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false); // Controls WhatsApp input visibility
  const navigation = useNavigation();
  const [selectedState, setSelectedState] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedPU, setSelectedPU] = useState('');
  const [formData, setFormData] = useState({
    nin: '',
    firstname: '',
    middlename: '',
    lastname: '',
    dob: new Date(),
    gender: '',
    maritalStatus: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    highestQualification: '',
    employmentStatus: '',
    state: '',
    lga: '',
    ward: '',
    address: '',
    addressType: 'home',
    latitude: '',
    longitude: '',
    bvn: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    cluster: '',
    referees: referees,
    //refereename: '', 
    //refereeemail: '', 
    //refereenin: '', 
    //refereephone: '',    
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clusterList, setClusterList] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
   const [referees, setReferees] = useState([
    { refereename: "", refereeemail: "", refereenin: "", refereephone: "" },
  ]);


  const generateFarmerID = () => {
    const date = new Date();
    return `CCSA-${date.toISOString().replace(/[-:.TZ]/g, "")}`;
  };


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





  const handleChange = (name, value) => {
    //setFormData((prev) => ({ ...prev, [key]: value }));
    setFormData((prev) => ({ ...prev, [name]: value }));


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


  //addd referee dynamically
    
// For updating a specific referee's field
const handleRefereeChange = (index, field, value) => {
    const updatedReferees = [...referees];
    updatedReferees[index][field] = value;
    setReferees(updatedReferees);
}

  const handleDateChange = (event, selectedDate) => {
     setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dob: selectedDate });
    }
  };

  const dobAsDate = new Date(formData.dob);
const formattedDob = dobAsDate.toISOString().split('T')[0]; // "YYYY-MM-DD"


  // Fetch clusters from Firestore
  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, "clusters"));
        const clusters = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClusterList(clusters);
      } catch (error) {
        console.error("Error fetching clusters:", error);
      }
    };

    fetchClusters();
  }, []);


  // Function to verify the NIN using a real API
   const handleVerifyNIN = async () => {
    if (formData.nin.length !== 11) {
      Alert.alert('Invalid NIN', 'NIN must be exactly 11 digits');
      return;
    }

    setLoading(true);

    //const result = await verifyNIN({ nin, firstName, lastName });
    const result = await verifyNIN({
      nin: formData.nin,
      firstName: formData.firstname,
      lastName: formData.lastname,
    });

    setLoading(false);

    if (result.success) {
      const data = result.data;

      console.log("✅ Verified NIN response:", data);

      // ✅ Auto-fill the returned data
      setFormData((prev) => ({
        ...prev,
        firstname: data.firstname || prev.firstname,
        middlename: data.middlename || prev.middlename,
        lastname: data.surname || prev.lastname,
        dob: data.dateofbirth || prev.dob,
        email: data.email || prev.email,
        phone: data.msisdn || prev.phone,
        gender: data.gender || prev.gender,
      }));


      Alert.alert('Success', 'NIN verified successfully!');
      console.log('Verified data:', result.data);
    } else {
      Alert.alert('Verification Failed', result.error);
    }
  };
  

  const handleSubmit = async () => {
    try {
      const farmerData = {
        ...formData,
        dob: formData.dob,
        farmerID: generateFarmerID(),
        state: selectedState,
        lga: selectedLGA,
        ward: selectedWard,
        pollingUnit: selectedPU,
        referees: referees,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(firestore, 'farmers'), farmerData);
      Alert.alert('Success', 'Farmer registered successfully!');
      // Reset form if desired
      setFormData({
        nin: '',
        firstname: '',
        middlename: '',
        lastname: '',
        dob: new Date(),
        gender: '',
        maritalStatus: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        highestQualification: '',
        employmentStatus: '',
        state: selectedState,
        lga: selectedLGA,
        ward: selectedWard,
        address: '',
        addressType: 'home',
        bvn: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        cluster: '',
        latitude: '',
        longitude: '',
        refereename: '', 
        refereeemail: '', 
        refereenin: '', 
        refereephone: '',
      });
       navigation.navigate("Dashboard");
    } catch (error) {
      console.error('Error registering farmer:', error);
      Alert.alert('Error', 'Failed to register farmer.');
    }
  };

  const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toDateString(); // e.g. 'Wed Mar 22 1995'
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


   const handleAddReferee = () => {
    setReferees([...referees, { refereename: "", refereeemail: "", refereenin: "", refereephone: "" }]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

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



      {/* Identity Verification Section */}
      <Card style={styles.card}>
  <Card.Title title="Identity Verification" />
  <Card.Content>
    <TextInput
      label="NIN"
      value={formData.nin}
       onChangeText={(text) => handleChange('nin', text)}
      keyboardType="phone-pad"
      maxLength={11}
      style={styles.smallInput}
      contentStyle={styles.smallContent}
      dense
    />
    <Button
      mode="contained"
      loading={loading}
      disabled={loading}
      onPress={handleVerifyNIN}
    >
      {loading ? 'Verifying...' : 'Verify NIN'}
    </Button>
  </Card.Content>
</Card>

      {/* Personal Information Section */}
      <Card style={styles.card}>
        <Card.Title title="Personal Information" />
        <Card.Content>
          <TextInput
      label="First Name"
      value={formData.firstname}
      onChangeText={(text) => handleChange('firstname', text)}
      style={styles.smallInput}
      contentStyle={styles.smallContent}
      dense
    />
          <TextInput
      label="Middle Name"
      value={formData.middlename}
      onChangeText={(text) => handleChange('middlename', text)}
      style={styles.smallInput}
      contentStyle={styles.smallContent}
      dense
    />
    <TextInput
      label="Last Name"
      value={formData.lastname}
      onChangeText={(text) => handleChange('lastname', text)}
      style={styles.smallInput}
      contentStyle={styles.smallContent}
      dense
    />
          <TextInput
      label="Email Address"
      value={formData.email}
      onChangeText={text => handleChange('email', text)}
      keyboardType="email-address"
      style={styles.smallInput}
      contentStyle={styles.smallContent}
      dense
    />
          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={text => handleChange('phone', text)}
            keyboardType="phone-pad"
            maxLength={11}
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense
          />
          <TextInput
            label="WhatsApp Number"
            value={formData.whatsappNumber}
            onChangeText={text => handleChange('whatsappNumber', text)}
            keyboardType="phone-pad"
            maxLength={11}
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense
          />

          <View>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
      <TextInput
        mode="outlined"
        style={styles.smallInput}
        contentStyle={styles.smallContent}
        dense
        editable={false}
        pointerEvents="none"
        placeholder="Select Date of Birth"
        value={formatDate(formData.dob)}
      />
    </TouchableOpacity>

    {showDatePicker && (
      <DateTimePicker
        value={formData.dob ? new Date(formData.dob) : new Date()}
        mode="date"
        display="default"
        maximumDate={new Date()}
        onChange={(event, selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
    const formatted = selectedDate.toISOString().split('T')[0];
    handleChange('dob', formatted);
  }
}}

      />
    )}
    </View>

          {/* Gender */}
          <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.gender}
            style={styles.picker}
            onValueChange={(itemValue) => setFormData({ ...formData, gender: itemValue })}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
          </View>

          {/* Marital Status */}
          <View style={styles.pickerContainer}>
      <Picker
        selectedValue={formData.maritalStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setFormData({ ...formData, maritalStatus: itemValue })}
      >
            <Picker.Item label="Select Marital Status" value="" />
            <Picker.Item label="Annulled" value="Annulled" />
            <Picker.Item label="Civil Union" value="Civil Union" />
            <Picker.Item label="Cohabiting " value="Cohabiting " />
            <Picker.Item label="Common-law Marriage" value="Common-law Marriage" />
            <Picker.Item label="Complicated" value="Complicated" />
            <Picker.Item label="Customarily Married" value="Customarily Married" />
            <Picker.Item label="Divorced" value="Divorced" />
            <Picker.Item label="Domestic Partnership" value="Domestic Partnership" />
            <Picker.Item label="In a Relationship" value="In a Relationship" />
            <Picker.Item label="Legally Separated" value="Legally Separated" />
            <Picker.Item label="Married" value="Married" />
            <Picker.Item label="Partnered" value="Partnered" />
            <Picker.Item label="Polygamously Married" value="Polygamously Married" />
            <Picker.Item label="Religiously Married" value="Religiously Married" />
            <Picker.Item label="Remarried" value="Remarried" />
            <Picker.Item label="Separated" value="Separated" />
            <Picker.Item label="Single" value="Single" />
            <Picker.Item label="Widowed" value="Widowed" />
      </Picker>
      </View>


          
          {/* Highest Qualification */}
        <View style={styles.pickerContainer}>
      <Picker
        selectedValue={formData.highestQualification}
        style={styles.picker}
        onValueChange={(itemValue) =>
          setFormData({ ...formData, highestQualification: itemValue })
        }
      >
        <Picker.Item label="Select Highest Qualification" value="" />

        <Picker.Item label="First School Leaving Certificate (FSLC)" value="First School Leaving Certificate (FSLC)" />
            <Picker.Item label="Primary School Certificate" value="Primary School Certificate" />
            <Picker.Item label="Junior Secondary School Certificate (JSSCE)" value="Junior Secondary School Certificate (JSSCE)" />
            <Picker.Item label="Senior Secondary School Certificate (SSCE)" value="Senior Secondary School Certificate (SSCE)" />
            <Picker.Item label="West African Senior School Certificate Examination (WASSCE)" value="West African Senior School Certificate Examination (WASSCE)" />
            <Picker.Item label="General Certificate of Education – Ordinary Level (GCE O’Level)" value="General Certificate of Education – Ordinary Level (GCE O’Level)" />
            <Picker.Item label="National Examination Council Certificate (NECO)" value="National Examination Council Certificate (NECO)" />
            <Picker.Item label="National Diploma (ND)" value="National Diploma (ND)" />
            <Picker.Item label="Ordinary National Diploma (OND)" value="Ordinary National Diploma (OND)" />
            <Picker.Item label="Higher National Diploma (HND)" value="Higher National Diploma (HND)" />
            <Picker.Item label="Nigerian Certificate in Education (NCE)" value="Nigerian Certificate in Education (NCE)" />
            <Picker.Item label="Bachelor’s Degree (BA, BSc, BEng, B.Ed, LLB, etc.)" value="Bachelor’s Degree (BA, BSc, BEng, B.Ed, LLB, etc.)" />
            <Picker.Item label="Postgraduate Diploma (PGD / PGDE)" value="Postgraduate Diploma (PGD / PGDE)" />
            <Picker.Item label="Master’s Degree (MA, MSc, M.Ed, MBA, LLM, MEng, etc.)" value="Master’s Degree (MA, MSc, M.Ed, MBA, LLM, MEng, etc.)" />
            <Picker.Item label="Master of Philosophy (MPhil)" value="Master of Philosophy (MPhil)" />
            <Picker.Item label="Doctorate Degree (PhD, EdD, DSc, DLitt, etc.)" value="Doctorate Degree (PhD, EdD, DSc, DLitt, etc.)" />
      </Picker>
      </View>

          {/* Employment Status */}
          <View style={styles.pickerContainer}>
      <Picker
        selectedValue={formData.employmentStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setFormData({ ...formData, employmentStatus: itemValue })}
      >
        <Picker.Item label="Select Employment Status" value="" />
        <Picker.Item label="Employed" value="Employed" />
        <Picker.Item label="Unemployed" value="Unemployed" />
        <Picker.Item label="Self-Employed" value="Self-Employed" />
        <Picker.Item label="Retired" value="Retired" />
        <Picker.Item label="House Wife" value="House Wife" />
      </Picker>
      </View>

        </Card.Content>
      </Card>


        {/* Cluster Info Section */}
      <Card style={styles.card}>
        <Card.Title title="Cluster Information" />
      <Card.Content>
          {/* Cluster */}
      
      <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={formData.cluster}
        onValueChange={(itemValue) => setFormData({ ...formData, cluster: itemValue })}
      >
        <Picker.Item label="Select Cluster" value="" style={styles.picker}/>
        {clusterList.map((cluster) => (
          <Picker.Item key={cluster.id} label={cluster.name || cluster.id} value={cluster.id} />
        ))}
      </Picker>
      </View>
        </Card.Content>
      </Card>




      {/* Location Information Section */}
      <Card style={styles.card}>
        <Card.Title title="Contact Information" />
        <Card.Content>
          <RadioButton.Group onValueChange={value => handleChange('addressType', value)} value={formData.addressType}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="home" />
              <Text>Home Address</Text>
              <RadioButton value="office" />
              <Text>Office Address</Text>
            </View>
          </RadioButton.Group>
          
      <View style={styles.container}>
    
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={selectedState}
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedLGA('');
          setSelectedWard('');
          setSelectedPU('');
        }}>
        <Picker.Item label="Select State of Residence" value="" />
        {states.map((state, index) => (
          <Picker.Item key={index} label={state} value={state} />
        ))}
      </Picker>
      </View>

      {lgas.length > 0 && (
        <>
          <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedLGA}
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
          </View>
        </>
      )}

      {wards.length > 0 && (
        <>
          <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedWard}
            onValueChange={(value) => {
              setSelectedWard(value);
              setSelectedPU('');
            }}>
            <Picker.Item label="Select Ward" value="" />
            {wards.map((ward, index) => (
              <Picker.Item key={index} label={ward} value={ward} />
            ))}
          </Picker>
          </View>
        </>
      )}

      {pollingUnits.length > 0 && (
        <>
          <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedPU}
            onValueChange={(value) => setSelectedPU(value)}>
            <Picker.Item label="Select Polling Unit" value="" />
            {pollingUnits.map((pu, index) => (
              <Picker.Item key={index} label={pu} value={pu} />
            ))}
          </Picker>
          </View>
        </>
      )}
    </View>



          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={text => handleChange('address', text)}
            multiline
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense
          />
          <TextInput
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense 
            disabled
            label="Latitude" value={formData.latitude} onChangeText={(text) => handleChange("latitude", text)} />

          <TextInput 
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense 
            disabled
            label="Longitude" 
            value={formData.longitude} 
            onChangeText={(text) => handleChange("longitude", text)} />
            <TouchableOpacity  onPress={getCoordinates}>
              <Icon name="location-on" size={24} color="black"  />
              <Text >Get Address Coordinates</Text>
            </TouchableOpacity>
        </Card.Content>
      </Card>


    
      {/* Banking Information Section */}
      <Card style={styles.card}>
        <Card.Title title="Banking Details" />
        <Card.Content>
          
           {/* Bank Name */}
           <View style={styles.pickerContainer}>
      <Picker
        selectedValue={formData.bankName}
        style={styles.picker}
        onValueChange={(itemValue) => setFormData({ ...formData, bankName: itemValue })}
      >
        <Picker.Item label="Select Bank" value="" />
        <Picker.Item label="Access Bank Plc" value="Access Bank Plc" />
        <Picker.Item label="Alternative Bank Ltd" value="Alternative Bank Ltd" />
        <Picker.Item label="Citibank Nigeria Ltd" value="Citibank Nigeria Ltd" />
        <Picker.Item label="Ecobank Nigeria Plc" value="Ecobank Nigeria Plc" />
        <Picker.Item label="Fidelity Bank Plc" value="Fidelity Bank Plc" />
        <Picker.Item label="First Bank of Nigeria Ltd" value="First Bank of Nigeria Ltd" />
        <Picker.Item label="First City Monument Bank Ltd (FCMB)" value="First City Monument Bank Ltd (FCMB)" />
        <Picker.Item label="Globus Bank Ltd" value="Globus Bank Ltd" />
        <Picker.Item label="Guaranty Trust Bank Plc (GTBank)" value="Guaranty Trust Bank Plc (GTBank)" />
        <Picker.Item label="Heritage Bank Plc" value="Heritage Bank Plc" />
        <Picker.Item label="Jaiz Bank Plc" value="Jaiz Bank Plc" />
        <Picker.Item label="Keystone Bank Ltd" value="Keystone Bank Ltd" />
        <Picker.Item label="LOTUS Bank Ltd" value="LOTUS Bank Ltd" />
        <Picker.Item label="Parallex Bank Ltd" value="Parallex Bank Ltd" />
        <Picker.Item label="Polaris Bank Ltd" value="Polaris Bank Ltd" />
        <Picker.Item label="Premium Trust Bank Ltd" value="Premium Trust Bank Ltd" />
        <Picker.Item label="Providus Bank Ltd" value="Providus Bank Ltd" />
        <Picker.Item label="Stanbic IBTC Bank Plc" value="Stanbic IBTC Bank Plc" />
        <Picker.Item label="Standard Chartered Bank Nigeria Ltd" value="Standard Chartered Bank Nigeria Ltd" />
        <Picker.Item label="Sterling Bank Plc" value="Sterling Bank Plc" />
        <Picker.Item label="SunTrust Bank Nigeria Ltd" value="SunTrust Bank Nigeria Ltd" />
        <Picker.Item label="TAJ Bank Ltd" value="TAJ Bank Ltd" />
        <Picker.Item label="Titan Trust Bank Ltd" value="Titan Trust Bank Ltd" />
        <Picker.Item label="United Bank for Africa Plc (UBA)" value="United Bank for Africa Plc (UBA)" />
        <Picker.Item label="Unity Bank Plc" value="Unity Bank Plc" />
        <Picker.Item label="Wema Bank Plc" value="Wema Bank Plc" />
        <Picker.Item label="Zenith Bank Plc" value="Zenith Bank Plc" />
      </Picker>
      </View>

          <TextInput
            label="Account Name"
            value={formData.accountName}
            onChangeText={text => handleChange('accountName', text)}
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense
          />

          <TextInput
            label="Account Number"
            value={formData.accountNumber}
            onChangeText={text => handleChange('accountNumber', text)}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense
          />
          <TextInput
            label="BVN"
            value={formData.bvn}
            onChangeText={text => handleChange('bvn', text)}
            keyboardType="number-pad"
            maxLength={11}
            style={styles.smallInput}
            contentStyle={styles.smallContent}
            dense
          />
        </Card.Content>
      </Card>


      <Card style={styles.card}>
        <Card.Title title="Referees Information" />
        <Card.Content>
          {referees.map((referee, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <TextInput
                label="Referee Name"
                value={referee.refereename}
                onChangeText={(text) => handleRefereeChange(index, "refereename", text)}
                style={styles.smallInput}
                contentStyle={styles.smallContent}
                dense
              />
              <TextInput
                label="Referee Email"
                value={referee.refereeemail}
                onChangeText={(text) => handleRefereeChange(index, "refereeemail", text)}
                style={styles.smallInput}
                contentStyle={styles.smallContent}
                dense
              />
              <TextInput
                label="Referee NIN"
                value={referee.refereenin}
                onChangeText={(text) => handleRefereeChange(index, "refereenin", text)}
                keyboardType="number-pad"
                maxLength={11}
                style={styles.smallInput}
                contentStyle={styles.smallContent}
                dense
              />
              <TextInput
                label="Referee Phone"
                value={referee.refereephone}
                onChangeText={(text) => handleRefereeChange(index, "refereephone", text)}
                keyboardType="number-pad"
                maxLength={11}
                style={styles.smallInput}
                contentStyle={styles.smallContent}
                dense
              />
            </View>
          ))}

          <Button
            mode="outlined"
            onPress={handleAddReferee}
            style={{ marginBottom: 20 }}
          >
            Add Referee
          </Button>

        </Card.Content>
      </Card>

      
      {/* Submit Button */}
      <Button 
        mode="contained" 
        //onPress={handleSubmit} 
        onPress={() => setShowConsentModal(true)}
        style={styles.button}
        disabled={loading}>
          {loading ? "Submitting..." : "Save and Proceed"}
      </Button>



          {/*Modal codes */}
      {showConsentModal && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={showConsentModal}
    onRequestClose={() => setShowConsentModal(false)} // required for Android back button
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Consent Agreement</Text>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalText}>
            By clicking Submit, you confirm that all information provided is true and accurate to the best of your knowledge. 
            You also agree to allow the Centre for Climate Smart Agriculture to store and process your data for program-related activities.
          </Text>
        </ScrollView>

        <CheckBox
          title="I agree to the terms and conditions"
          checked={consentGiven}
          onPress={() => setConsentGiven(!consentGiven)}
        />

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: consentGiven ? "#4CAF50" : "#ccc" }]}
          onPress={() => {
            if (consentGiven) {
              setShowConsentModal(false);
              handleSubmit();
            }
          }}
          disabled={!consentGiven}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowConsentModal(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}





    </ScrollView>
  );
};


const styles = {
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
  searchInput: {
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      height: 55,
      borderColor: "#ddd",
    },
    smallInput: {
      marginBottom: 8,
      backgroundColor: 'white',
      borderColor: "#ddd",
      borderWidth: 1,
      fontSize: 14,
      height: 55, // reduce height
    },

    smallContent: {
      fontSize: 14, // text size inside the input
      paddingVertical: 6, // vertical padding inside input
    },

    card: {
      padding: 15,
      borderRadius: 2,
      marginBottom: 2,
      marginTop: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    cardTitle: { fontSize: 14, color: "#333" },
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
  label: {
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  //...Modal Information
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#13274F",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
}


export default RegisterFarmer;