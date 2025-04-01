import { View, Text, TouchableOpacity } from 'react-native';

const creditPacks = [
  { id: '1', credits: 5, price: 10 },
  { id: '2', credits: 10, price: 18 }
];

export default function CreditsScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Buy Credits</Text>
      {creditPacks.map(pack => (
        <TouchableOpacity 
          key={pack.id}
          style={{ 
            padding: 16, 
            borderWidth: 1, 
            marginBottom: 10 
          }}
        >
          <Text>{pack.credits} credits</Text>
          <Text>${pack.price}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}