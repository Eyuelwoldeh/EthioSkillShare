import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Switch, Button, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../../lib/supabase';
import Slider from '@react-native-community/slider';

export default function PricingStep({ userId, profile, onComplete, isLoading }) {
  const [pricingModel, setPricingModel] = useState('hourly');
  const [hourlyRate, setHourlyRate] = useState('');
  const [flatRates, setFlatRates] = useState({
    consultation: '',
    smallProject: '',
    mediumProject: '',
    largeProject: ''
  });
  const [negotiable, setNegotiable] = useState(true);
  const [offerDiscounts, setOfferDiscounts] = useState(false);
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  
  // Initialize with existing data if available
  useEffect(() => {
    if (profile) {
      if (profile.pricing_model) setPricingModel(profile.pricing_model);
      if (profile.hourly_rate) setHourlyRate(profile.hourly_rate.toString());
      if (profile.flat_rates) setFlatRates(profile.flat_rates);
      if (profile.price_negotiable !== undefined) setNegotiable(profile.price_negotiable);
      if (profile.offers_discounts !== undefined) setOfferDiscounts(profile.offers_discounts);
    }
  }, [profile]);

  const validate = () => {
    if (pricingModel === 'hourly' && (!hourlyRate || isNaN(parseFloat(hourlyRate)))) {
      setError('Please enter a valid hourly rate');
      return false;
    }
    
    if (pricingModel === 'flat' && 
        (!flatRates.consultation || isNaN(parseFloat(flatRates.consultation)))) {
      setError('Please enter at least a consultation rate');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setLocalLoading(true);
    setError(null);
    
    try {
      const pricingData = {
        pricing_model: pricingModel,
        price_negotiable: negotiable,
        offers_discounts: offerDiscounts,
        onboarding_complete: true
      };
      
      if (pricingModel === 'hourly') {
        pricingData.hourly_rate = parseFloat(hourlyRate);
      } else {
        pricingData.flat_rates = flatRates;
      }
      
      const { error } = await supabase
        .from('professional_profiles')
        .update(pricingData)
        .eq('user_id', userId);
      
      if (error) throw error;
      onComplete();
    } catch (err) {
      setError('Failed to save pricing information. Please try again.');
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Pricing Model</Text>
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segment,
            pricingModel === 'hourly' && styles.activeSegment
          ]}
          onPress={() => setPricingModel('hourly')}
        >
          <Text style={pricingModel === 'hourly' ? styles.activeSegmentText : styles.segmentText}>
            Hourly Rate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            pricingModel === 'flat' && styles.activeSegment
          ]}
          onPress={() => setPricingModel('flat')}
        >
          <Text style={pricingModel === 'flat' ? styles.activeSegmentText : styles.segmentText}>
            Flat Rates
          </Text>
        </TouchableOpacity>
      </View>
      
      {pricingModel === 'hourly' ? (
        <View style={styles.rateContainer}>
          <Text style={styles.subLabel}>Hourly Rate ($)</Text>
          <TextInput
            style={styles.input}
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="numeric"
            placeholder="e.g. 85"
          />
          
          {hourlyRate && !isNaN(parseFloat(hourlyRate)) && (
            <View style={styles.estimateContainer}>
              <Text style={styles.estimateLabel}>Estimated Project Costs:</Text>
              <View style={styles.estimateRow}>
                <Text>Small project (5 hours)</Text>
                <Text style={styles.estimateValue}>${(parseFloat(hourlyRate) * 5).toFixed(2)}</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text>Medium project (20 hours)</Text>
                <Text style={styles.estimateValue}>${(parseFloat(hourlyRate) * 20).toFixed(2)}</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text>Large project (50 hours)</Text>
                <Text style={styles.estimateValue}>${(parseFloat(hourlyRate) * 50).toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.flatRatesContainer}>
          <Text style={styles.subLabel}>Initial Consultation ($)</Text>
          <TextInput
            style={styles.input}
            value={flatRates.consultation}
            onChangeText={(text) => setFlatRates({...flatRates, consultation: text})}
            keyboardType="numeric"
            placeholder="e.g. 100"
          />
          
          <Text style={styles.subLabel}>Small Project ($)</Text>
          <TextInput
            style={styles.input}
            value={flatRates.smallProject}
            onChangeText={(text) => setFlatRates({...flatRates, smallProject: text})}
            keyboardType="numeric"
            placeholder="e.g. 500"
          />
          
          <Text style={styles.subLabel}>Medium Project ($)</Text>
          <TextInput
            style={styles.input}
            value={flatRates.mediumProject}
            onChangeText={(text) => setFlatRates({...flatRates, mediumProject: text})}
            keyboardType="numeric"
            placeholder="e.g. 2000"
          />
          
          <Text style={styles.subLabel}>Large Project ($)</Text>
          <TextInput
            style={styles.input}
            value={flatRates.largeProject}
            onChangeText={(text) => setFlatRates({...flatRates, largeProject: text})}
            keyboardType="numeric"
            placeholder="e.g. 5000"
          />
        </View>
      )}
      
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Prices are negotiable</Text>
        <Switch
          value={negotiable}
          onValueChange={setNegotiable}
        />
      </View>
      
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Offer discounts for returning clients</Text>
        <Switch
          value={offerDiscounts}
          onValueChange={setOfferDiscounts}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Button 
        title={localLoading || isLoading ? "Finishing..." : "Complete Setup"} 
        onPress={handleSave}
        disabled={localLoading || isLoading}
      />
      
      {(localLoading || isLoading) && (
        <ActivityIndicator style={styles.loader} />
      )}
      
      <Text style={styles.finishNote}>
        You'll be able to update your pricing information later in your profile settings.
      </Text>
    </ScrollView>
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
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: '#1890ff',
  },
  segmentText: {
    color: '#333',
  },
  activeSegmentText: {
    color: 'white',
    fontWeight: '500',
  },
  rateContainer: {
    marginBottom: 16,
  },
  flatRatesContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  estimateContainer: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  estimateLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  estimateValue: {
    fontWeight: '500',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLabel: {
    flex: 1,
    paddingRight: 8,
  },
  errorText: {
    color: 'red',
    marginVertical: 16,
  },
  loader: {
    marginTop: 16,
  },
  finishNote: {
    marginTop: 24,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  }
});