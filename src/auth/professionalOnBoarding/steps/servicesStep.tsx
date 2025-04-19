import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Button, ActivityIndicator, TextInput } from 'react-native';
import { supabase } from '../../../../lib/supabase';

export default function ServicesStep({ userId, profile, onComplete, isLoading }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [customService, setCustomService] = useState('');
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  
  // Common service categories - replace with your actual service options
  const serviceOptions = [
    'Interior Design', 'Home Staging', 'Furniture Selection',
    'Color Consultation', 'Space Planning', 'Renovation Planning',
    'Commercial Design', 'Residential Design', 'Sustainable Design'
  ];

  // Initialize with existing data if available
  useEffect(() => {
    if (profile && profile.services) {
      setSelectedServices(profile.services);
    }
  }, [profile]);

  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addCustomService = () => {
    if (customService.trim() && !selectedServices.includes(customService.trim())) {
      setSelectedServices([...selectedServices, customService.trim()]);
      setCustomService('');
    }
  };

  const validate = () => {
    if (selectedServices.length === 0) {
      setError('Please select at least one service you offer');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setLocalLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('professional_profiles')
        .update({ services: selectedServices })
        .eq('user_id', userId);
      
      if (error) throw error;
      onComplete();
    } catch (err) {
      setError('Failed to save services. Please try again.');
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Services You Offer</Text>
      <Text style={styles.helperText}>Choose all that apply. These will be visible to potential clients.</Text>
      
      <ScrollView style={styles.optionsContainer}>
        {serviceOptions.map((service) => (
          <TouchableOpacity 
            key={service}
            style={[
              styles.serviceOption,
              selectedServices.includes(service) && styles.selectedOption
            ]}
            onPress={() => toggleService(service)}
          >
            <Text style={[
              styles.serviceText,
              selectedServices.includes(service) && styles.selectedText
            ]}>
              {service}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.customServiceContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add custom service"
          value={customService}
          onChangeText={setCustomService}
          onSubmitEditing={addCustomService}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addCustomService}
          disabled={!customService.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      {selectedServices.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedHeader}>Selected Services ({selectedServices.length})</Text>
          <ScrollView horizontal style={styles.tagsContainer}>
            {selectedServices.map((service) => (
              <View key={service} style={styles.tag}>
                <Text style={styles.tagText}>{service}</Text>
                <TouchableOpacity onPress={() => toggleService(service)}>
                  <Text style={styles.removeTag}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Button 
        title={localLoading || isLoading ? "Saving..." : "Continue"} 
        onPress={handleSave}
        disabled={localLoading || isLoading}
      />
      
      {(localLoading || isLoading) && (
        <ActivityIndicator style={styles.loader} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  helperText: {
    color: '#666',
    marginBottom: 16,
  },
  optionsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  serviceOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  serviceText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#1890ff',
    fontWeight: '500',
  },
  customServiceContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  selectedContainer: {
    marginBottom: 16,
  },
  selectedHeader: {
    fontWeight: '500',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    marginRight: 4,
  },
  removeTag: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  loader: {
    marginTop: 16,
  }
});