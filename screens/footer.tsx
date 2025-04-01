// components/Footer.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MessageScreen from './pages/messages';
import { useNavigation } from '@react-navigation/native';


const Footer = () => {

    const navigation = useNavigation();

    const handleMessagePress = () => {
        navigation.navigate('Inbox');
    };

    const handleProfilePress = () => {
      navigation.navigate('Details');
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton}>
        <Ionicons name="home" size={24} color="#4A78EF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <Ionicons name="search" size={24} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <Ionicons name="mail-outline" size={24} color="#666" onPress={handleMessagePress} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <Ionicons name="person" size={24} color="#666" onPress={handleProfilePress} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingBottom: 35,
  },
  footerButton: {
    padding: 8,
  },
});

export default Footer;