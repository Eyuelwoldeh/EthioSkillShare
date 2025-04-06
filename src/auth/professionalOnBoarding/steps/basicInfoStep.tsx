import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { supabase } from '../../../../lib/supabase';

export default function BasicInfoStep({ userId, profile, onComplete, isLoading }) {
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  // Initialize with existing data if available
  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const validate = () => {
    if (!headline.trim()) {
      setError('Please enter a professional headline');
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
        .update({ 
          headline,
          bio
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      onComplete();
    } catch (err) {
      setError('Failed to save information. Please try again.');
      alert(error)
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Professional Headline</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Experienced Interior Designer"
        value={headline}
        onChangeText={setHeadline}
        maxLength={100}
      />
      <Text style={styles.charCount}>{headline.length}/100</Text>
      
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tell clients about your background, experience, and approach"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <Text style={styles.charCount}>{bio.length}/500</Text>
      
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
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#888',
    fontSize: 12,
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  loader: {
    marginTop: 16,
  }
});