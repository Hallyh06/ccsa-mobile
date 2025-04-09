import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { firestore } from "../firebaseConfig";
import * as Location from "expo-location";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CheckBox } from "react-native-elements"; // Import CheckBox
import { Dropdown } from 'react-native-element-dropdown';
import statesAndLgas from '../statesAndLgas';


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


//...States and LGAs Data
const nigeriaStatesLGA = [
  {
    state: "Abia",
    lgas: ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"]
  },
  {
    state: "Adamawa",
    lgas: ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"]
  },
  {
    state: "Akwa Ibom",
    lgas: ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"]
  },
  {
    state: "Anambra",
    lgas: ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"]
  },
  {
    state: "Bauchi",
    lgas: ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"]
  },
  {
    state: "Bayelsa",
    lgas: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"]
  },
  {
    state: "Benue",
    lgas: ["Agatu", "Apa", "Ado", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"]
  },
  {
    state: "Borno",
    lgas: ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"]
  },
  {
    state: "Cross River",
    lgas: ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"]
  },
  {
    state: "Delta",
    lgas: ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"]
  },
  {
    state: "Ebonyi",
    lgas: ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"]
  },
  {
    state: "Edo",
    lgas: ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"]
  },
  {
    state: "Ekiti",
    lgas: ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"]
  },
  {
    state: "Enugu",
    lgas: ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"]
  },
  {
    state: "Federal Capital Territory",
    lgas: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"]
  },
  {
    state: "Gombe",
    lgas: ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"]
  },
  {
    state: "Imo",
    lgas: ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"]
  },
  {
    state: "Jigawa",
    lgas: ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"]
  },
  {
    state: "Kaduna",
    lgas: ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"]
  },
  {
    state: "Kano",
    lgas: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"]
  },
  {
    state: "Katsina",
    lgas: ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"]
  },
  {
    state: "Kebbi",
    lgas: ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"]
  },
  {
    state: "Kogi",
    lgas: ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"]
  },
  {
    state: "Kwara",
    lgas: ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"]
  },
  {
    state: "Lagos",
    lgas: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"]
  },
  {
    state: "Nasarawa",
    lgas: ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"]
  },
  {
    state: "Niger",
    lgas: ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"]
  },
  {
      state: "Ogun",
      lgas: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"]
    },
    {
      state: "Ondo",
      lgas: ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"]
    },
    {
      state: "Osun",
      lgas: ["Aiyedaade", "Aiyedire", "Atakumosa East", "Atakumosa West", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"]
    },
    {
      state: "Oyo",
      lgas: ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"]
    },
    {
      state: "Plateau",
      lgas: ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"]
    },
    {
      state: "Rivers",
      lgas: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"]
    },
    {
      state: "Sokoto",
      lgas: ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"]
    },
    {
      state: "Taraba",
      lgas: ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"]
    },
    {
      state: "Yobe",
      lgas: ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"]
    },
    {
      state: "Zamfara",
      lgas: ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"]
    },
]


const RegisterFarmer = ({ route }) => {
  const navigation = useNavigation();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [area, setArea] = useState(route.params?.area || '');
  const [farmYields, setFarmYields] = useState([
    { year: "", season: "", crop: "", quantity: "" },
  ]);
  
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
    bankname: "",
    accountname: "",
    accountnumber: "",
    state: "",
    localGovernment: "",
    ward: "",
    pollingUnit: "",
    soilType: "",
    pHLevel: "",
    fertility: "",
    age: "",
    maritalStatus: "",
    highestQualification: "",
    employmenyStatus: "",
    gender: "",
    //primaryCrop: "",
    produceCategory: "",       // Top level: Livestock, Poultry, Crops
    cropType: "",              // Crops only: Vegetables, Fruits, etc.
    primaryProduce: "",        // Final produce selection
    secondaryCrop: [], // an array
    farmSize: "",
    farmingSeason: "",
    farmOwnership: "",
    latitude: "",
    longitude: "",
    calculatedArea: `${area} square meters`, // Ensure area is included as a string with units
  });
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false); // Controls WhatsApp input visibility

  const [subOptions, setSubOptions] = useState([]);
  const [cropSubOptions, setCropSubOptions] = useState([]);


  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [lgas, setLgas] = useState([]);

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    const stateData = nigeriaStatesLGA.find((state) => state.state === stateName);
    setLgas(stateData ? stateData.lgas : []);
    setSelectedLGA(""); // Reset LGA on state change
  };


  const generateFarmerID = () => {
    const date = new Date();
    return `CCSA-${date.toISOString().replace(/[-:.TZ]/g, "")}`;
  };

  const addYieldEntry = () => {
    setFarmYields([...farmYields, { year: "", season: "", crop: "", quantity: "" }]);
  };

  const handleYieldChange = (index, name, value) => {
    const updatedYields = [...farmYields];
    updatedYields[index][name] = value;
    setFarmYields(updatedYields);
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


//....state and LGA dynamic selection
    if (name === "state") {
      const selected = statesAndLgas.find((item) => item.state === value);
      setFilteredLgas(selected ? selected.lgas : []);
      setFormData({ ...formData, state: value, localGovernment: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }



    //.....produce slection
    if (name === "produceCategory") {
      setFormData({ ...formData, produceCategory: value, cropType: "", primaryProduce: "" });
  
      if (value === "Crops") {
        setSubOptions(Object.keys(produceCategories.Crops));
      } else {
        setSubOptions(produceCategories[value]);
      }
    } else if (name === "cropType") {
      setFormData({ ...formData, cropType: value, primaryProduce: "" });
      setCropSubOptions(produceCategories.Crops[value]);
    } else {
      setFormData({ ...formData, [name]: value });
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
        calculatedArea: `${area} square meters`, // Set fresh value just before submitting
        farmerID: generateFarmerID(),
        estimatedYields: farmYields,
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
        bankname: "",
        accountname: "",
        accountnumber: "",
        state: "",
        localGovernment: "",
        ward: "",
        pollingUnit: "",
        soilType: "",
        pHLevel: "",
        fertility: "",
        age: "",
        maritalStatus: "",
        highestQualification: "",
        employmenyStatus: "",
        gender: "",
        //primaryCrop: "",
        produceCategory: "",       // Top level: Livestock, Poultry, Crops
        cropType: "",              // Crops only: Vegetables, Fruits, etc.
        primaryProduce: "",        // Final produce selection
        secondaryCrop: [],
        farmSize: "",
        farmingSeason: "",
        farmOwnership: "",
        latitude: "",
        longitude: "",
        coordinateFormat: "",
        coordinateSystem: "",
        calculatedArea: ""
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
        <TextInput style={styles.input} placeholder="NIN" keyboardType="phone-pad" value={formData.nin} maxLength={11}  onChangeText={(text) => handleChange("nin", text)} />
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
        <Picker selectedValue={formData.state} style={styles.picker} onValueChange={(value) => handleChange("state", value)}>
          <Picker.Item label="Select State of Residence" value="" />
          <Picker.Item label="Abia" value="Abia" />
          <Picker.Item label="Adamawa" value="Adamawa" />
          <Picker.Item label="Akwa Ibom" value="Akwa Ibom" />
          <Picker.Item label="Anambra" value="Anambra" />
          <Picker.Item label="Bauchi" value="Bauchi" />
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
      
      <Picker
        selectedValue={selectedState}
        style={styles.picker}
        onValueChange={(itemValue) => handleStateChange(itemValue)}
      >
        <Picker.Item label="Select State" value="" />
        {nigeriaStatesLGA.map((state) => (
          <Picker.Item key={state.state} label={state.state} value={state.state} />
        ))}
      </Picker>

  
      <Picker
        selectedValue={selectedLGA}
        style={styles.picker}
        enabled={lgas.length > 0}
        onValueChange={(itemValue) => setSelectedLGA(itemValue)}
      >
        <Picker.Item label="Select Local Government Area" value="" />
        {lgas.map((lga) => (
          <Picker.Item key={lga} label={lga} value={lga} />
        ))}
      </Picker>

        <TextInput style={styles.input} placeholder="Ward" value={formData.ward} onChangeText={(text) => handleChange("ward", text)} />
        <TextInput style={styles.input} placeholder="Polling Unit" value={formData.pollingUnit} onChangeText={(text) => handleChange("pollingUnit", text)} />

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
{/*
        <Picker selectedValue={formData.soilType} style={styles.picker} onValueChange={(value) => handleChange("soilType", value)}>
          <Picker.Item label="Select Soil Type" value="" />
          <Picker.Item label="Clay Soil" value="Clay Soil" />
          <Picker.Item label="Loamy Soil" value="Loamy Soil" />
          <Picker.Item label="Sandy Soil" value="Sandy Soil" />
        </Picker>

        <TextInput style={styles.input} placeholder="Soil pH Level" value={formData.pHLevel} keyboardType="phone-pad" onChangeText={(text) => handleChange("pHLevel", text)} />

        <Picker selectedValue={formData.fertility} style={styles.picker} onValueChange={(value) => handleChange("fertility", value)}>
          <Picker.Item label="Select Soil Fertility" value="" />
          <Picker.Item label="Low Fertility" value="Low Fertility" />
          <Picker.Item label="Medium Fertility" value="Medium Fertility" />
          <Picker.Item label="High Fertility" value="High Fertility" />
        </Picker>
*/}

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
        <TextInput style={styles.input} placeholder="Calculated Area" value={formData.calculatedArea} onPress={() => navigation.navigate("FarmAreaCalculator")} onChangeText={(text) => handleChange("calculatedArea", text)} />
      <View style={styles.formGroup}>
        <TextInput style={styles.input} placeholder="Latitude" value={formData.latitude} onChangeText={(text) => handleChange("latitude", text)} />
        <TextInput style={styles.input} placeholder="Longitude" value={formData.longitude} onChangeText={(text) => handleChange("longitude", text)} />
      </View>
      <TouchableOpacity style={styles.buttonCoord} onPress={getCoordinates}>
        <Icon name="location-on" size={24} color="black" style={styles.icon} />
        <Text style={styles.buttonTextCoord}>Get Farm Coordinates</Text>
      </TouchableOpacity>

         {/* Banking Details Information */}
      <View style={styles.sectionHeader}>
        <Icon name="money" size={24} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Banking Details</Text>
      </View>

      <View style={styles.formGroup}>
        <TextInput style={styles.input} placeholder="BVN" keyboardType="phone-pad" value={formData.bvn} maxLength={11} onChangeText={(text) => handleChange("bvn", text)} />
        <TextInput style={styles.input} placeholder="Bank Name" value={formData.bankname} onChangeText={(text) => handleChange("bankname", text)} />
        <TextInput style={styles.input} placeholder="Account Name" value={formData.accountname} onChangeText={(text) => handleChange("accountname", text)} />
        <TextInput style={styles.input} placeholder="Account Number" value={formData.accountnumber} keyboardType="phone-pad" maxLength={10} onChangeText={(text) => handleChange("accountnumber", text)} />
     </View>



      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} /*</ScrollView>onPress={handleSubmit}*/
        onPress={() => setShowConsentModal(true)}>
        <Text style={styles.submitButtonText}>Register Farmer</Text>
      </TouchableOpacity>


      {/*Modal codes */}
      {showConsentModal && (
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
      )}


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
//...Modal Information
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    maxHeight: 200,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify'
  },
 
  cancelText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#f44336',
    fontWeight: 'bold',
  },
  

  //search csv stylings
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  
};

export default RegisterFarmer;
