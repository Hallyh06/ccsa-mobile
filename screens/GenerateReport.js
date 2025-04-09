import React from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const GenerateReport = ({ farmerData }) => {
  const createPDF = async () => {
    if (!farmerData) {
      Alert.alert("Error", "No farmer data available.");
      return;
    }

    const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png"; // Replace with your real logo
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${farmerData.farmerID}`;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; }
            .logo { height: 60px; vertical-align: middle; margin-right: 10px; }
            .title { font-size: 22px; font-weight: bold; display: inline-block; vertical-align: middle; }
            .container { padding: 20px; background: white; border-radius: 10px; }
            .subheader { font-size: 18px; margin-top: 20px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .row { display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 10px; }
            .row p { flex: 1; margin: 0 10px; }
            p { font-size: 16px; margin: 6px 0; }
            .qr-container { margin-top: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="{require("../assets/cosmologo.png")}" class="logo" />
              <span class="title">Centre for Climate Smart Agriculture</span>
            </div>
            <h2 style="text-align: center;">Registered Farmer Certificate</h2>

            <p><strong>Registered ID:</strong> ${farmerData.farmerID}</p>

            <div class="subheader">Farmer Information</div>
            <p><strong>NIN:</strong> ${farmerData.nin}</p>

            <div class="row">
              <p><strong>Last Name:</strong> ${farmerData.lastname}</p>
              <p><strong>First Name:</strong> ${farmerData.firstname}</p>
              <p><strong>Middle Name:</strong> ${farmerData.middlename}</p>
            </div>

            <div class="row">
              <p><strong>Email:</strong> ${farmerData.email}</p>
              <p><strong>Phone Number:</strong> ${farmerData.phone}</p>
              <p><strong>WhatsApp Number:</strong> ${farmerData.whatsappNumber}</p>
            </div>

            <p><strong>Gender:</strong> ${farmerData.gender}</p>
            <p><strong>Marital Status:</strong> ${farmerData.maritalStatus}</p>
            <p><strong>Highest Educational Qualification:</strong> ${farmerData.highestQualification}</p>
            
            <div class="subheader">Farm Information</div>
            <div class="row">
              <p><strong>State:</strong> ${farmerData.state}</p>
              <p><strong>Local Government:</strong> ${farmerData.state}</p>
              <p><strong>Ward:</strong> ${farmerData.ward}</p>
              <p><strong>Polling Unit:</strong> ${farmerData.pollingUnit}</p>
            </div>

            <div class="row">
              <p><strong>Latitude:</strong> ${farmerData.latitude}</p>
              <p><strong>Longitude:</strong> ${farmerData.longitude}</p>
              <p><strong>Farming Season:</strong> ${farmerData.farmingSeason}</p>
            </div>
            <p><strong>Farm Size:</strong> ${farmerData.farmSize}</p>
            
            <div class="subheader">Farm Information</div>
            <div class="row">
              <p><strong>Bank Name:</strong> ${farmerData.bankName}</p>
              <p><strong>Account Name:</strong> ${farmerData.accountName}</p>
            </div>

            <div class="row">
              <p><strong>Account Number:</strong> ${farmerData.accountNumber}</p>
              <p><strong>BVN:</strong> ${farmerData.bvn}</p>
            </div>

            <div class="qr-container">
              <p><strong>Farmer Code</strong></p>
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      const fileName = `Farmer_Report_${farmerData.farmerID}.pdf`;
      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.moveAsync({ from: uri, to: newPath });

      Alert.alert("Success", "PDF saved successfully!", [
        { text: "Open", onPress: () => openPDF(newPath) },
        { text: "OK", style: "cancel" },
      ]);

      console.log("PDF saved at:", newPath);
    } catch (error) {
      console.error("PDF Error:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  const openPDF = async (path) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path);
      } else {
        Alert.alert("Error", "Cannot open PDF on this device.");
      }
    } catch (error) {
      console.error("PDF Open Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Certificate" onPress={createPDF} color="#2c3e50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default GenerateReport;
