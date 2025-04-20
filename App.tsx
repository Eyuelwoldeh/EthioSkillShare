import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/customers/pages/home';
import DetailsScreen from './src/customers/pages/profile/details';
import MessageScreen from './src/customers/pages/messages/messages';
import LoginScreen from './src/auth/LoginScreen';
import SignUpScreen from './src/auth/SIgnUpScreen';
import ProProfileScreen from './src/professionals/pages/profile/details';
import ProfessionalProfileDetails from './src/professionals/pages/profile/details';
import ProfessionalOnboarding from './src/auth/professionalOnBoarding/professionalOnBoarding';
import LeadsScreen from './src/professionals/pages/leads/leads';

export default function App() {

  const Stack = createStackNavigator();


  return (
    <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Inbox" component={MessageScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ProDetails" component={ProfessionalProfileDetails} />
            <Stack.Screen name="ProfessionalOnboarding" component={ProfessionalOnboarding} />
            <Stack.Screen name="Leads" component={LeadsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
