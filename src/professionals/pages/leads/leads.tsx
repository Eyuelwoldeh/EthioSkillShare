import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LeadCard from '../../../../components/pro/LeadCard';
import { supabase } from '../../../../lib/supabase';

const LeadsScreen = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    // Replace with your API call
    const fetchLeads = async () => {
      const { data: proData, error: proError } = await supabase
                .from('leads')
                .select('id, service, location, description, description, budget');
      setLeads(proData);
    };

    fetchLeads();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Available Leads</Text>
      {leads.map((lead: any) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </ScrollView>
  );
};

export default LeadsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});
