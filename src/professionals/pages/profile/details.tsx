import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    businessName: '',
    hourlyRate: ''
  });

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Business Name"
        value={profile.businessName}
        onChangeText={text => setProfile({...profile, businessName: text})}
        style={styles.input}
      />
      <TextInput
        placeholder="Hourly Rate ($)"
        keyboardType="numeric"
        value={profile.hourlyRate}
        onChangeText={text => setProfile({...profile, hourlyRate: text})}
        style={styles.input}
      />
      <Button title="Save Profile" />
    </View>
  );
}

const styles = {
  input: { 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10 
  }
};