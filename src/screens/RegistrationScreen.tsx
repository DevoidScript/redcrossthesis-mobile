import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { supabase } from '../library/db_conn';
import { useNavigation } from '@react-navigation/native';

const RegistrationScreen: React.FC = () => {
  const navigation = useNavigation();

  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Select Sex');
  const [civilStatus, setCivilStatus] = useState('Select Civil Status');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [nationality, setNationality] = useState('');
  const [religion, setReligion] = useState('');
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [telephoneNo, setTelephoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    if (!surname || !firstName || sex === 'Select Sex' || civilStatus === 'Select Civil Status' || !birthdate || !permanentAddress || !nationality || !occupation || !mobileNo || !email || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      // Register the user using Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.log("Auth Error:", error.message);
        Alert.alert('Registration Failed', error.message);
        return;
      }
  
      // Extract the user ID after successful registration
      const userId = data.user?.id;
      if (!userId) {
        console.log("User ID not found after registration");
        Alert.alert('Error', 'User ID not found after registration');
        return;
      }
  
      // Insert donor details into donors_detail
      const { error: insertError } = await supabase.from('donors_detail').insert([
        {
          id: userId, // Link to auth user
          surname,
          first_name: firstName,
          middle_name: middleName,
          birthdate,
          age,
          sex,
          civil_status: civilStatus,
          permanent_address: permanentAddress,
          office_address: officeAddress,
          nationality,
          religion,
          education,
          occupation,
          mobile: mobileNo,
          telephone: telephoneNo,
          email,
        }
      ]);
  
      if (insertError) {
        console.log("Database Insertion Error:", insertError.message);
        Alert.alert('Error', insertError.message);
        return;
      }
  
      // Success Message
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
  
      // Clear all input fields after successful submission
      setSurname('');
      setFirstName('');
      setMiddleName('');
      setBirthdate(new Date());
      setSex('Select Sex');
      setCivilStatus('Select Civil Status');
      setPermanentAddress('');
      setOfficeAddress('');
      setNationality('');
      setReligion('');
      setEducation('');
      setOccupation('');
      setMobileNo('');
      setEmail('');
      setTelephoneNo('');
      setPassword('');
      setConfirmPassword('');
  
    } catch (error) {
      console.log("Unexpected Error:", error);
      Alert.alert('Unexpected Error', error.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#f2f2f2' }}>
      <Text style={styles.title}>BLOOD DONOR DETAILS</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>NAME:</Text>
        <TextInput placeholder="Surname *" style={styles.input} value={surname} onChangeText={setSurname} />
        <TextInput placeholder="First Name *" style={styles.input} value={firstName} onChangeText={setFirstName} />
        <TextInput placeholder="Middle Name" style={styles.input} value={middleName} onChangeText={setMiddleName} />

        <Text style={styles.label}>Birthdate (MM/DD/YYYY) *</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{moment(birthdate).format('MM/DD/YYYY')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthdate}
            mode="date"
            display="calendar"
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setBirthdate(selectedDate);
            }}
          />
        )}
        <TextInput placeholder="Age" style={styles.input} value={age} onChangeText={setAge} />
        <Text style={styles.label}>Sex:</Text>
        <Picker selectedValue={sex} onValueChange={setSex} style={styles.input}>
          <Picker.Item label="Select Sex" value="Select Sex" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Others" value="Others" />
        </Picker>

        <Text style={styles.label}>Civil Status:</Text>
        <Picker selectedValue={civilStatus} onValueChange={setCivilStatus} style={styles.input}>
          <Picker.Item label="Select Civil Status" value="Select Civil Status" />
          <Picker.Item label="Single" value="Single" />
          <Picker.Item label="Married" value="Married" />
          <Picker.Item label="Widowed" value="Widowed" />
          <Picker.Item label="Divorced" value="Divorced" />
        </Picker>

        <TextInput placeholder="Permanent Address *" style={styles.input} value={permanentAddress} onChangeText={setPermanentAddress} />
        <TextInput placeholder="Office Address" style={styles.input} value={officeAddress} onChangeText={setOfficeAddress} />
        <TextInput placeholder="Nationality *" style={styles.input} value={nationality} onChangeText={setNationality} />
        <TextInput placeholder="Religion" style={styles.input} value={religion} onChangeText={setReligion} />
        <TextInput placeholder="Education" style={styles.input} value={education} onChangeText={setEducation} />
        <TextInput placeholder="Occupation *" style={styles.input} value={occupation} onChangeText={setOccupation} />

        <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
        <TextInput placeholder="Mobile No. *" style={styles.input} value={mobileNo} onChangeText={setMobileNo} />
        <TextInput placeholder="Telephone No. (Optional)" style={styles.input} value={telephoneNo} onChangeText={setTelephoneNo} />

        <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
        <TextInput placeholder="Email Address *" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password *" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput placeholder="Confirm Password *" style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
});

export default RegistrationScreen;
