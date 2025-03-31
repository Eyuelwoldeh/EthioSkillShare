import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default function DetailsScreen() {

    const navigation = useNavigation();

  return (
    <View>
          <Text>This is the profile page.</Text>
        </View>
  );
}