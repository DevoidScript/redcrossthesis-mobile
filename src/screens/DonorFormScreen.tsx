import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { supabase } from '../library/db_conn';
import { useNavigation } from '@react-navigation/native';
import type { DonorFormData } from '../types/donor';

const DonorForm: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  
  // Generate PRC Donor Number (Format: PRC-YYYY-XXXXX where X is random number)
  const generatePrcDonorNumber = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `PRC-${year}-${randomNum}`;
  };

  // Generate DOH NNBNETS Barcode (Format: DOH-YYYYMMDD-XXXXX where X is random number)
  const generateDohBarcode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `DOH-${year}${month}${day}-${randomNum}`;
  };

  // Form Fields
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
    const [mobile, setMobile] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [idSchool, setIdSchool] = useState('');
    const [idCompany, setIdCompany] = useState('');
    const [idPrc, setIdPrc] = useState('');
    const [idDrivers, setIdDrivers] = useState('');
    const [idSssGsisBir, setIdSssGsisBir] = useState('');
    const [idOthers, setIdOthers] = useState('');


  // Fetch donor details from Supabase
  useEffect(() => {
    const fetchDonorDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('donors_detail').select('*').single();

      if (error) {
        Alert.alert('Error', 'Failed to fetch donor details.');
        console.error('Fetch error:', error);
      } else if (data) {
        setSurname(data.surname || '');
        setFirstName(data.first_name || '');
        setMiddleName(data.middle_name || '');
        setBirthdate(data.birthdate ? new Date(data.birthdate) : new Date());
        setAge(data.age?.toString() || '');
        setSex(data.sex || 'Select Sex');
        setCivilStatus(data.civil_status || 'Select Civil Status');
        setPermanentAddress(data.permanent_address || '');
        setOfficeAddress(data.office_address || '');
        setNationality(data.nationality || '');
        setReligion(data.religion || '');
        setEducation(data.education || '');
        setOccupation(data.occupation || '');
        setMobile(data.mobile || '');
        setTelephone(data.telephone || '');
        setEmail(data.email || '');
        setIdSchool(data.id_school || '');
        setIdCompany(data.id_company || '');
        setIdPrc(data.id_prc || '');
        setIdDrivers(data.id_drivers || '');
        setIdSssGsisBir(data.id_sss_gsis_bir || '');
        setIdOthers(data.id_others || '');
      }
      setLoading(false);
    };

    fetchDonorDetails();
  }, []);

  const validateForm = () => {
    if (!surname || !firstName || sex === 'Select Sex' || civilStatus === 'Select Civil Status' || !birthdate || !permanentAddress || !nationality || !occupation || !mobile || !email) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      const prcDonorNumber = generatePrcDonorNumber();
      const dohBarcode = generateDohBarcode();

      const donorData = {
        prc_donor_number: prcDonorNumber,
        doh_nnbnets_barcode: dohBarcode,
        surname,
        first_name: firstName,
        middle_name: middleName || null,
        birthdate: moment(birthdate).format('YYYY-MM-DD'),
        age: parseInt(age),
        sex,
        civil_status: civilStatus,
        permanent_address: permanentAddress,
        office_address: officeAddress || null,
        nationality: nationality || null,
        religion: religion || null,
        education: education || null,
        occupation: occupation || null,
        telephone: telephone || null,
        mobile: mobile || null,
        email: email || null,
        id_school: idSchool || null,
        id_company: idCompany || null,
        id_prc: idPrc || null,
        id_drivers: idDrivers || null,
        id_sss_gsis_bir: idSssGsisBir || null,
        id_others: idOthers || null
      };

      // @ts-ignore - Navigate to Declaration screen with donor data
      navigation.navigate('Declaration', { donorData });
      
    } catch (error: any) {
      console.error("Unexpected Error:", error);
      Alert.alert('Unexpected Error', error?.message || 'An unexpected error occurred');
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text>Loading donor details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
        <TextInput placeholder="Mobile No. *" style={styles.input} value={mobile} onChangeText={setMobile} />
        <TextInput placeholder="Telephone No. (Optional)" style={styles.input} value={telephone} onChangeText={setTelephone} />

        <Text style={styles.sectionTitle}>Identification No.</Text>
        <TextInput placeholder="School" style={styles.input} value={idSchool} onChangeText={setIdSchool} />
        <TextInput placeholder="Company" style={styles.input} value={idCompany} onChangeText={setIdCompany} />
        <TextInput placeholder="PRC" style={styles.input} value={idPrc} onChangeText={setIdPrc} />
        <TextInput placeholder="Driver's License" style={styles.input} value={idDrivers} onChangeText={setIdDrivers} />
        <TextInput placeholder="SSS/GSIS/BIR" style={styles.input} value={idSssGsisBir} onChangeText={setIdSssGsisBir} />
        <TextInput placeholder="Others" style={styles.input} value={idOthers} onChangeText={setIdOthers} />


        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
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
    marginBottom:25
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
  }
});

export default DonorForm;