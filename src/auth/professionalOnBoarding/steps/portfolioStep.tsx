import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Button, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function PortfolioStep({ userId, profile, onComplete, onSkip, isLoading }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize with existing data if available
  useEffect(() => {
    if (profile && profile.portfolio_images) {
      setImages(profile.portfolio_images || []);
    }
  }, [profile]);

  // Request permission to access camera roll
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (err) {
        alert(err)
      setError('Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      setError(null);
      
      // Convert uri to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const fileExt = uri.split('.').pop();
      const fileName = `${userId}/${uuidv4()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, blob);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);
        
      const publicUrl = data.publicUrl;
      
      // Update images array
      const newImages = [...images, {
        url: publicUrl,
        description: '',
        uploaded_at: new Date().toISOString()
      }];
      
      setImages(newImages);
      
      // Update database
      await supabase
        .from('professional_profiles')
        .update({ portfolio_images: newImages })
        .eq('user_id', userId);
        
    } catch (err) {
      alert(err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    try {
      // Create new array without the removed image
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      
      // Update state and database
      setImages(updatedImages);
      
      await supabase
        .from('professional_profiles')
        .update({ portfolio_images: updatedImages })
        .eq('user_id', userId);
    } catch (err) {
      console.error('Error removing image:', err);
      setError('Failed to remove image. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      // Final validation could go here
      onComplete();
    } catch (err) {
      setError('Failed to save portfolio. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Upload Portfolio Images</Text>
      <Text style={styles.helperText}>
        Show off your best work. You can add more images later.
      </Text>
      
      <ScrollView style={styles.imagesContainer}>
        <View style={styles.imageGrid}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image.url }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addImageButton}
            onPress={pickImage}
            disabled={uploading}
          >
            <Text style={styles.addImageText}>+</Text>
            <Text style={styles.addImageLabel}>Add Image</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.buttonsContainer}>
        <Button 
          title="Skip for Now" 
          onPress={onSkip}
          disabled={isLoading || uploading}
        />
        <Button 
          title={isLoading ? "Saving..." : "Continue"} 
          onPress={handleSave}
          disabled={isLoading || uploading}
        />
      </View>
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
  imagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  addImageButton: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 32,
    color: '#999',
  },
  addImageLabel: {
    color: '#999',
    marginTop: 8,
  },
  uploadingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadingText: {
    marginTop: 8,
    color: '#1890ff',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});