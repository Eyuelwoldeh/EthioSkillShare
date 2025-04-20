import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../../hooks/useAuth';
import { supabase } from '../../../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import ProfessionalLayout from '../../../../prolayout';

// Simplified types
type UserProfile = {
  id: string;
  full_name: string;
}

type ProfessionalProfile = {
  user_id: string;
  headline: string;
  bio: string;
  hourly_rate: number;
  profile_photo_url: string | null;
  services: string[] | null;
  verified: boolean | null;
}

export default function ProfessionalProfileDetails() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [proProfile, setProProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    async function fetchProfileData() {
      try {
        if (!user) console.log("Theres no user");
        if (!user) return;
        
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .single();
          
        if (userError) throw userError;
        
        // Fetch professional profile
        const { data: proData, error: proError } = await supabase
          .from('professional_profiles')
          .select('user_id, headline, bio, hourly_rate, profile_photo_url, services, verified')
          .eq('user_id', user.id)
          .single();
          
        if (proError) throw proError;
        
        setUserProfile(userData);
        setProProfile(proData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (userProfile) console.log("We have a user profile!");

  if (!userProfile || !proProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found. Please complete your onboarding.</Text>
      </View>
    );
  }

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.bioText}>{proProfile.bio}</Text>
    </View>
  );

  const renderServicesTab = () => (
    <View style={styles.tabContent}>
      {!proProfile.services || proProfile.services.length === 0 ? (
        <Text style={styles.emptyStateText}>No services added yet.</Text>
      ) : (
        <View>
          {proProfile.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceName}>{service}</Text>
            </View>
          ))}
          
          <View style={styles.pricingContainer}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <Text style={styles.pricingValue}>{proProfile.hourly_rate} ETB per hour</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ProfessionalLayout>
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {proProfile.profile_photo_url ? (
            <Image 
              source={{ uri: proProfile.profile_photo_url }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>
                {userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : 'P'}
              </Text>
            </View>
          )}
          {proProfile.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
            </View>
          )}
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userProfile.full_name}</Text>
          <Text style={styles.headline}>{proProfile.headline}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'about' && styles.activeTab]} 
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
            About
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'services' && styles.activeTab]} 
          onPress={() => setActiveTab('services')}
        >
          <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
            Services
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'about' && renderAboutTab()}
      {activeTab === 'services' && renderServicesTab()}
    </ScrollView>
    </ProfessionalLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    marginRight: 15,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  placeholderImage: {
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0066cc',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headline: {
    fontSize: 16,
    color: '#666',
  },
  actionsContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 2,
    minHeight: 200,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  serviceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceName: {
    fontSize: 16,
  },
  pricingContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pricingValue: {
    fontWeight: '600',
    fontSize: 15,
  },
  emptyStateText: {
    textAlign: 'center',
    paddingVertical: 30,
    color: '#999',
  },
});