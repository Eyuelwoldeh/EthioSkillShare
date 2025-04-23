// components/LeadCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Lead = {
  id: string;
  service: string;
  location: string;
  description?: string;
  budget?: string;
  datePosted: string;
};

const LeadCard = ({ lead, onPress }: { lead: Lead, onPress?: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.service}>{lead.service || '-'}</Text>
        <Text style={styles.date}>{lead.datePosted}</Text>
      </View>
      <Text style={styles.location}><Feather name="map-pin" size={14} /> {lead.location || '-'}</Text>
      <Text style={styles.description}>{lead.description || '-'}</Text>
      <Text style={styles.budget}>Budget: {lead.budget || '-'}</Text>
    </TouchableOpacity>
  );
};

export default LeadCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  service: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  location: {
    fontSize: 14,
    marginTop: 4,
    color: '#444',
  },
  description: {
    marginTop: 8,
    color: '#555',
  },
  budget: {
    marginTop: 8,
    fontWeight: '600',
    color: '#4A78EF',
  },
});
