import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  FadeInDown,
  FadeInUp 
} from 'react-native-reanimated';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const navigation = useNavigation();

  const validate = () => {
    const newErrors = {
      email: !email ? 'Email is required' : 
             !/^\S+@\S+\.\S+$/.test(email) ? 'Invalid email format' : '',
      password: !password ? 'Password is required' : 
                password.length < 6 ? 'Password too short' : ''
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(error.message);
      } else {
        console.log("Logged in");
        const { data: userData, error: userError } = await supabase
                  .from('user_profiles')
                  .select('id, full_name, account_type')
                  .eq('id', user.id)
                  .single();
        if (!userData) return;
        if (userData.account_type=="professional"){
          navigation.navigate("ProDetails")
        }
        else{
          navigation.replace('Home');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.duration(1000)}
        style={styles.header}
      >
        <Text style={styles.title}>EthioSkillShare</Text>
        <Text style={styles.subtitle}>Connect with local professionals</Text>
      </Animated.View>

      {/* Form */}
      <Animated.View 
        entering={FadeInDown.duration(1000)}
        style={styles.form}
      >
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons 
            name="mail-outline" 
            size={20} 
            color="#666" 
            style={styles.inputIcon} 
          />
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
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons 
            name="lock-closed-outline" 
            size={20} 
            color="#666" 
            style={styles.inputIcon} 
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Forgot Password */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ForgotPassword' as never)}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4A78EF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
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
  inputIcon: {
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
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4A78EF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4A78EF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#4A78EF',
    fontWeight: '600',
  },
});