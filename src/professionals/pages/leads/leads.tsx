import { FlatList, View, Text } from 'react-native';
import LeadCard from '../../../../components/pro/LeadCard';
import { useProLeads } from '../../../../hooks/useProLeads';

export default function LeadsScreen() {
  const { leads, loading } = useProLeads();

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, padding: 16 }}>Your Leads</Text>
      <FlatList
        data={leads}
        renderItem={({ item }) => <LeadCard lead={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ padding: 20 }}>No leads yet</Text>}
      />
    </View>
  );
}