import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../library/db_conn';

const DeclarationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [donorSignature, setDonorSignature] = useState('');
  const [guardianSignature, setGuardianSignature] = useState('');

  // @ts-ignore - Get donor data from navigation params
  const { donorData } = route.params;

  const handleSubmit = async () => {
    if (!donorSignature && !guardianSignature) {
      Alert.alert('Error', 'Please provide either donor or guardian signature');
      return;
    }

    if (guardianSignature && !relationship) {
      Alert.alert('Error', 'Please provide relationship for guardian signature');
      return;
    }

    try {
      setLoading(true);

      const finalData = {
        ...donorData,
        relationship: relationship || null,
        submitted_at: new Date().toISOString(),
        donor_signature: donorSignature || null,
        guardian_signature: guardianSignature || null
      };

      const { error } = await supabase
        .from('donor_form')
        .insert([finalData]);

      if (error) {
        console.error("Database Insertion Error:", error.message);
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert(
        'Success',
        'Donor form submitted successfully!',
        [{
          text: 'OK',
          onPress: () => {
            // @ts-ignore - Navigate back to Dashboard
            navigation.navigate('Dashboard');
          }
        }]
      );
    } catch (error: any) {
      console.error("Unexpected Error:", error);
      Alert.alert('Error', error?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text>Submitting form...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>III. Donor's Declaration</Text>
        
        <View style={styles.declarationText}>
          <Text style={styles.paragraph}>
            I <Text style={styles.bold}>certify</Text> that I am the person referred to above and that all the entries are read and well <Text style={styles.bold}>understood</Text> by me and to the best of my knowledge, <Text style={styles.bold}>truthfully</Text> answered all the questions in this Blood Donor Interview Sheet.
          </Text>
          
          <Text style={styles.paragraph}>
            I <Text style={styles.bold}>understand</Text> that all questions are pertinent for my safety and for the benefit of the patient who will undergo blood transfusion.
          </Text>
          
          <Text style={styles.paragraph}>
            I am <Text style={styles.bold}>voluntarily</Text> giving my blood through the Philippine Red Cross, without remuneration, for the use of persons in need of this vital fluid without regard to rank, race, color, creed, religion, or political persuasion.
          </Text>
          
          <Text style={styles.paragraph}>
            I <Text style={styles.bold}>understand</Text> that my blood will be screened for malaria, syphilis, hepatitis B, hepatitis C, and HIV. I am aware that the screening tests are not diagnostic and may yield false positive results.
          </Text>
          
          <Text style={styles.paragraph}>
            I <Text style={styles.bold}>confirm</Text> that I am over the age of 18 years.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Donor Signature"
            value={donorSignature}
            onChangeText={setDonorSignature}
          />

          <Text style={styles.label}>For ages 16-17:</Text>
          <TextInput
            style={styles.input}
            placeholder="Guardian Signature"
            value={guardianSignature}
            onChangeText={setGuardianSignature}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Relationship to Blood Donor"
            value={relationship}
            onChangeText={setRelationship}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b22222',
    marginBottom: 20,
    textAlign: 'center',
  },
  declarationText: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#b22222',
  },
  signatureSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});

export default DeclarationScreen;