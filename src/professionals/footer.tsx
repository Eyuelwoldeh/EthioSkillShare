import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const ProfessionalFooter = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <FooterButton
        label="Profile"
        icon="person-outline"
        onPress={() => navigation.navigate('ProDetails')}
      />
      <FooterButton
        label="Leads"
        icon="briefcase-outline"
        onPress={() => navigation.navigate('Leads')}
      />
      <FooterButton
        label="Inbox"
        icon="chatbubble-ellipses-outline"
        onPress={() => navigation.navigate('Inbox')}
      />
      <FooterButton
        label="Credits"
        icon="card-outline"
        onPress={() => navigation.navigate('Credits')}
      />
    </View>
  );
};

const FooterButton = ({ label, icon, onPress }: any) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#333" />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 20,
    paddingBottom: 40,
  },
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
});

export default ProfessionalFooter;