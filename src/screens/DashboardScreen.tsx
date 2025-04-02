import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, BackHandler } from "react-native";
import { supabase } from "../library/db_conn"; // Ensure this is correctly set up
import { useFocusEffect } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
  // Prevent going back to login screen with hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent default back behavior when on Dashboard
        return true;
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleDonateBlood = () => {
    navigation.navigate("DonorForm"); // Ensure DonorForm is defined in navigation
  };

  const handleProfile = () => {
    navigation.navigate("Profile"); // Navigate to Profile Screen
  };

  return (
    <View style={styles.container}>
      {/* Clickable Profile Image */}
      <TouchableOpacity onPress={handleProfile} style={styles.profileContainer}>
        <Image
          source={require("../../assets/profile_icon.png")} // Ensure correct path
          style={styles.profileImage}
          resizeMode="cover" // Ensures the image scales correctly
        />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome to the Donor Dashboard!</Text>

      {/* Donate Button with Image and Text */}
      <TouchableOpacity style={styles.donateContainer} onPress={handleDonateBlood}>
        <Image
          source={require("../../assets/donate_icon.png")} // Ensure correct path
          style={styles.donateIcon}
          resizeMode="cover"
        />
        <Text style={styles.donateText}>Donate</Text>
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
  profileContainer: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50, // Ensure it's a perfect circle
    borderWidth: 2,
    borderColor: "#007bff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    position: "absolute",
    top: 125,
  },
  donateContainer: {
    flexDirection: "row", // Aligns image and text horizontally
    alignItems: "center", // Centers items vertically
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  donateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular icon
    borderWidth: 2,
    borderColor: "#fff",
  },
  donateText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10, // Spacing between image and text
  }
});

export default DashboardScreen;
