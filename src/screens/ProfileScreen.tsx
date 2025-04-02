import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { supabase } from "../library/db_conn";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define types
type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

type DonorData = {
  id?: string;
  first_name?: string;
  surname?: string;
  email?: string;
  mobile?: string;
  sex?: string;
  age?: number;
  civil_status?: string;
  permanent_address?: string;
  office_address?: string;
  nationality?: string;
  religion?: string;
  education?: string;
  occupation?: string;
  [key: string]: any; // Allow for other fields
};

// Define type for InfoItem props
type InfoItemProps = {
  label: string;
  value: string | number | undefined;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState<DonorData | null>(null);

  useEffect(() => {
    fetchDonorDetails();
  }, []);

  const fetchDonorDetails = async () => {
    try {
      setLoading(true);
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      const userEmail = authData?.user?.email;

      if (userEmail) {
        // Fetch donor details by email
        const { data, error } = await supabase
          .from('donors_detail')
          .select('*')
          .eq('email', userEmail)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching donor details:', error);
          Alert.alert('Error', 'Failed to fetch profile information');
        } else if (data) {
          setDonorData(data);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", "Logout failed. Try again.");
      return;
    }
    
    // Reset navigation stack completely to prevent going back
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Donor Profile</Text>
        
        {donorData ? (
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <InfoItem label="Name" value={`${donorData.first_name || ''} ${donorData.surname || ''}`} />
            <InfoItem label="Email" value={donorData.email || ''} />
            <InfoItem label="Mobile" value={donorData.mobile || ''} />
            <InfoItem label="Sex" value={donorData.sex || ''} />
            <InfoItem label="Age" value={donorData.age ? donorData.age.toString() : ''} />
            <InfoItem label="Civil Status" value={donorData.civil_status || ''} />
            
            <Text style={styles.sectionTitle}>Address</Text>
            <InfoItem label="Permanent Address" value={donorData.permanent_address || ''} />
            <InfoItem label="Office Address" value={donorData.office_address || ''} />
            
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <InfoItem label="Nationality" value={donorData.nationality || ''} />
            <InfoItem label="Religion" value={donorData.religion || ''} />
            <InfoItem label="Education" value={donorData.education || ''} />
            <InfoItem label="Occupation" value={donorData.occupation || ''} />
          </View>
        ) : (
          <Text style={styles.noDataText}>No profile information available</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontWeight: "bold",
    width: 140,
    color: "#555",
  },
  infoValue: {
    flex: 1,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#d32f2f",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
