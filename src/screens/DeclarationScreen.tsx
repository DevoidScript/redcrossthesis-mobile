import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../library/db_conn';
import * as ImagePicker from 'expo-image-picker';
import SignatureScreen from 'react-native-signature-canvas';

const DeclarationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [donorSignature, setDonorSignature] = useState('');
  const [guardianSignature, setGuardianSignature] = useState('');
  const [signatureMethod, setSignatureMethod] = useState('draw'); // 'draw' or 'upload'
  const [signatureType, setSignatureType] = useState('donor'); // 'donor' or 'guardian'
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Create a ref for the signature pad
  const signatureRef = useRef(null);
  
  // @ts-ignore - Get donor data from navigation params
  const { donorData } = route.params;

  // Request camera permissions for image upload
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload your signature.');
        return false;
      }
      return true;
    }
    return true;
  };

  // Handle signature image upload
  const handleUploadSignature = async (type: 'donor' | 'guardian') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        if (type === 'donor') {
          setDonorSignature(imageUri);
        } else {
          setGuardianSignature(imageUri);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'An error occurred while uploading your signature.');
    }
  };

  // Handle signature drawing
  const handleSignatureDrawing = (type: 'donor' | 'guardian') => {
    setSignatureType(type);
    setShowSignaturePad(true);
  };

  // Handle saving the drawn signature
  const handleSignature = (signature: string) => {
    setShowSignaturePad(false);
    
    if (signatureType === 'donor') {
      setDonorSignature(signature);
    } else {
      setGuardianSignature(signature);
    }
  };

  // Function to save the signature
  const saveSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.readSignature();
    }
  };

  // Function to clear the signature pad
  const clearSignaturePad = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  // Style for signature canvas
  const style = `.m-signature-pad--footer
    { display: none; }
    .m-signature-pad {
      box-shadow: none;
      border: 1px solid #e8e8e8;
    }
    body {margin: 0; padding: 0}`;

  // Clear signature
  const clearSignature = (type: 'donor' | 'guardian') => {
    if (type === 'donor') {
      setDonorSignature('');
    } else {
      setGuardianSignature('');
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!donorSignature && !guardianSignature) {
      Alert.alert('Error', 'Please provide either donor or guardian signature');
      return false;
    }

    if (guardianSignature && !relationship) {
      Alert.alert('Error', 'Please provide relationship for guardian signature');
      return false;
    }

    return true;
  };

  // Show confirmation modal before submitting
  const handleConfirmation = () => {
    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  // Handle form submission to Supabase
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setShowConfirmationModal(false);

      // Base64 encoding for signatures will be handled here if needed
      // For now, we'll just store the URIs as they are
      
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
          
          <Text style={styles.paragraph}>
            I <Text style={styles.bold}>understand</Text> that all information hereinto is treated confidential in compliance with the <Text style={styles.bold}>Data Privacy Act of 2012</Text>.
          </Text>
        </View>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Sign Your Form:</Text>
          <Text style={styles.instructionsText}>• Draw Signature: Sign directly on your device screen</Text>
          <Text style={styles.instructionsText}>• Upload Image: Upload an image of your signature</Text>
          <Text style={styles.instructionsText}>• For ages 16-17, a parent/guardian signature is required</Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Donor Signature</Text>
          
          <View style={styles.signatureMethodSelector}>
            <TouchableOpacity 
              style={[styles.methodButton, signatureMethod === 'draw' ? styles.methodButtonActive : null]}
              onPress={() => setSignatureMethod('draw')}
            >
              <Text style={styles.methodButtonText}>Draw Signature</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.methodButton, signatureMethod === 'upload' ? styles.methodButtonActive : null]}
              onPress={() => setSignatureMethod('upload')}
            >
              <Text style={styles.methodButtonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
          
          {signatureMethod === 'draw' ? (
            <TouchableOpacity 
              style={styles.signatureBox} 
              onPress={() => handleSignatureDrawing('donor')}
            >
              {donorSignature ? (
                <Image 
                  source={{ uri: donorSignature }} 
                  style={styles.signatureImage} 
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.signatureBoxText}>Tap to sign</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.signatureBox} 
              onPress={() => handleUploadSignature('donor')}
            >
              {donorSignature ? (
                <Image 
                  source={{ uri: donorSignature }} 
                  style={styles.signatureImage} 
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.signatureBoxText}>Tap to upload signature</Text>
              )}
            </TouchableOpacity>
          )}
          
          {donorSignature && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => clearSignature('donor')}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>For ages 16-17 only:</Text>
          
          <Text style={styles.label}>Guardian Signature</Text>
          <TouchableOpacity 
            style={styles.signatureBox} 
            onPress={() => signatureMethod === 'draw' 
              ? handleSignatureDrawing('guardian') 
              : handleUploadSignature('guardian')}
          >
            {guardianSignature ? (
              <Image 
                source={{ uri: guardianSignature }} 
                style={styles.signatureImage} 
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.signatureBoxText}>
                {signatureMethod === 'draw' ? 'Tap to sign' : 'Tap to upload signature'}
              </Text>
            )}
          </TouchableOpacity>
          
          {guardianSignature && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => clearSignature('guardian')}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.label}>Relationship to Blood Donor</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Parent, Legal Guardian"
            value={relationship}
            onChangeText={setRelationship}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleConfirmation}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      
      {/* Signature Pad Modal */}
      <Modal
        visible={showSignaturePad}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {signatureType === 'donor' ? 'Donor Signature' : 'Guardian Signature'}
            </Text>
            <Text style={styles.modalSubtitle}>Please sign in the box below</Text>
            
            <View style={styles.signaturePadContainer}>
              <SignatureScreen
                ref={signatureRef}
                onOK={(signature) => handleSignature(signature)}
                onEmpty={() => Alert.alert('Error', 'Please provide a signature')}
                clearText="Clear"
                confirmText="Save"
                descriptionText={signatureType === 'donor' ? "Donor's Signature" : "Guardian's Signature"}
                webStyle={style}
                autoClear={false}
                imageType="image/png"
              />
            </View>
            
            <View style={styles.signatureButtonsContainer}>
              <TouchableOpacity 
                style={[styles.signatureButton, styles.clearSignatureButton]}
                onPress={clearSignaturePad}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.signatureButton, styles.saveSignatureButton]}
                onPress={saveSignature}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowSignaturePad(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Do you want to continue?</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.cancelConfirmButton]} 
                onPress={() => setShowConfirmationModal(false)}
              >
                <Text style={styles.confirmationButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.submitConfirmButton]} 
                onPress={handleSubmit}
              >
                <Text style={styles.confirmationButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  instructionsContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b22222',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 15,
    marginBottom: 5,
    lineHeight: 22,
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
  signatureMethodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  methodButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  methodButtonActive: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
  },
  methodButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  signatureBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  signatureBoxText: {
    color: '#888',
    fontSize: 16,
  },
  signatureImage: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 15,
  },
  clearButtonText: {
    color: '#d32f2f',
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#b22222',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  signaturePadContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmationModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelConfirmButton: {
    backgroundColor: '#aaa',
  },
  submitConfirmButton: {
    backgroundColor: '#d32f2f',
  },
  confirmationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signatureButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  clearSignatureButton: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveSignatureButton: {
    backgroundColor: '#d32f2f',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signatureButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
});

export default DeclarationScreen;