import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DetailsScreen() {

  const navigation = useNavigation();

  const menuItems = [
    { title: 'Account', icon: 'person', screen: 'Account' },
    { title: 'Privacy Policy', icon: 'lock-closed', screen: 'PrivacyPolicy' },
    { title: 'Notifications', icon: 'notifications', screen: 'Notifications' },
    { title: 'Help', icon: 'help-circle', screen: 'Help' },
    { title: 'Terms of Use', icon: 'document-text', screen: 'Terms' },
    { title: 'Acknowledgements', icon: 'thumbs-up', screen: 'Acknowledgements' },
    { title: 'Report a Technical Problem', icon: 'bug', screen: 'ReportProblem' },
    { title: 'Logout', icon: 'log-out', action: () => console.log('Logging out...') },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle" size={80} color="#4A78EF" />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john@example.com</Text>
        </View>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.menuItem}
            onPress={() => item.screen ? navigation.navigate(item.screen as never) : item.action?.()}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as never} size={22} color="#555" />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});