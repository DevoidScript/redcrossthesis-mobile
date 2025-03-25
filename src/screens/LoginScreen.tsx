import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { supabase } from '../library/db_conn'; // Ensure this is correctly set up
import imagePath from '../../components/imagePath';

const LoginScreen = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = useCallback((field) => (value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = async () => {
    const { email, password } = credentials;

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Login Error:', error.message);
        Alert.alert('Login Failed', error.message);
        return;
      }

      // Successful login
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') }, // Navigate to Dashboard After Logging in...
      ]);

    } catch (error) {
      console.log('Unexpected Error:', error);
      Alert.alert('Unexpected Error', 'An error occurred while logging in.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={imagePath.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={credentials.email}
          onChangeText={handleInputChange('email')}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={credentials.password}
          onChangeText={handleInputChange('password')}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: '80%',
    height: 100,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: 'red',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'red',
  },
  registerButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
