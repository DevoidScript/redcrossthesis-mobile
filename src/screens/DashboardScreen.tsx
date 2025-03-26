import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "../library/db_conn"; // Ensure this is correctly set up

const DashboardScreen = ({ navigation }) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", "Logout failed. Try again.");
      return;
    }
    navigation.replace("Login"); // Redirect to Login after logout
  };

  const handleDonateBlood = () => {
    navigation.navigate("DonorForm"); // Ensure DonateBloodScreen is defined in navigation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Donor Dashboard!</Text>
      
      <TouchableOpacity style={styles.donateButton} onPress={handleDonateBlood}>
        <Text style={styles.donateButtonText}>Donate Blood</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  donateButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardScreen;