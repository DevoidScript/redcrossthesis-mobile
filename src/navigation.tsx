import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import DashboardScreen from "./screens/DashboardScreen"; 
import DonorFormScreen from "./screens/DonorFormScreen"; // Import the Donor Interview Form
import ProfileScreen from "./screens/ProfileScreen";
import DeclarationScreen from "./screens/DeclarationScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="DonorForm" 
          component={DonorFormScreen} 
          options={{ title: "Blood Donor Interview" }} 
        />
        <Stack.Screen
        name="Declaration"
        component={DeclarationScreen}
        options={{ title: "Declaration of Donor"}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
