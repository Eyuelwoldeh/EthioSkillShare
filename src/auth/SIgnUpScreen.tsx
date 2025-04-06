import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { Link } from '@react-navigation/native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'customer' | 'professional'>('customer');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fullName, setFullName] = useState(''); // Add this at the top with other states
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const validate = () => {
    const newErrors = {
      email: !email ? 'Email is required' : 
             !/^\S+@\S+\.\S+$/.test(email) ? 'Invalid email format' : '',
      password: !password ? 'Password is required' : 
                password.length < 6 ? 'Must be at least 6 characters' : '',
      confirmPassword: password !== confirmPassword ? 'Passwords do not match' : ''
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSignUp = async () => {
    if (!validate()) return;
  
    setLoading(true);
    try {
      // 1. Sign up with Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { // This adds metadata to auth.user
            account_type: accountType,
            full_name: fullName,
            phone: phone
          }
        }
      });
  
      if (authError) throw authError;

      if (!user) {
        throw new Error('User creation failed');
      }
      
      // 2. Create profile in your 'profiles' table
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id, // Critical! Use the auth-generated ID
            account_type: accountType,
            email: email,
            full_name: fullName,
            phone: phone
          });
  
        if (profileError) throw profileError;
      
        if (accountType === 'professional') {
          const { error: proError } = await supabase
            .from('professional_profiles')
            .upsert({
              user_id: user.id,
              headline: `${fullName}'s Services`, // Default value
              hourly_rate: 0, // Initialize with 0
              introduction: 'Tell clients about your services...'
            });

            navigation.navigate('ProfessionalOnboarding', { userId: user.id });
      
          if (proError) throw proError;
        }
  
        Alert.alert(
          'Confirm Your Email',
          'Check your inbox for a confirmation link',
          [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
        );
      }
    } catch (error) {
      Alert.alert(error.message);
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Join EthioSkillShare</Text>
        <Text style={styles.subtitle}>Find professionals or grow your business</Text>
      </View>

      <View style={styles.form}>
        {/* Account Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton, 
              accountType === 'customer' && styles.toggleActive
            ]}
            onPress={() => setAccountType('customer')}
          >
            <Text style={[
              styles.toggleText,
              accountType === 'customer' && styles.toggleTextActive
            ]}>
              I Need a Pro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton, 
              accountType === 'professional' && styles.toggleActive
            ]}
            onPress={() => setAccountType('professional')}
          >
            <Text style={[
              styles.toggleText,
              accountType === 'professional' && styles.toggleTextActive
            ]}>
              I'm a Professional
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

      {/* Phone Input (Optional) */}
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            onPress={() => setSecureText(!secureText)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={secureText ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureText}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        {errors.confirmPassword ? (
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        ) : null}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4A78EF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#fff',
    shadowColor: '#4A78EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    color: '#666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#4A78EF',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#4A78EF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#4A78EF',
    fontWeight: '600',
  },
});