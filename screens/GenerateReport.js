import React from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";  // Import Ionicons

const GenerateReport = ({ farmerData }) => {
    const createPDF = async () => {
        if (!farmerData) {
            Alert.alert("Error", "No farmer data available.");
            return;
        }

        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; }
                .container { padding: 20px; background: white; border-radius: 10px; }
                p { font-size: 16px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Farmer Report</h1>
                <p><strong>Name:</strong> ${farmerData.name}</p>
                <p><strong>Phone:</strong> ${farmerData.phone}</p>
              </div>
            </body>
          </html>
        `;

        try {
            // Generate PDF
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Define the new path
            const fileName = `Farmer_Report_${farmerData.name}.pdf`;
            const newPath = FileSystem.documentDirectory + fileName;

            // Move file to a permanent location
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

// Styles for React Native
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#2c3e50",
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GenerateReport;
