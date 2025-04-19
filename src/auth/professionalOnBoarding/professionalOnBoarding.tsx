import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';
import ProgressBar from '../../../components/progressBar';
import BasicInfoStep from './steps/basicInfoStep';
import ServicesStep from './steps/servicesStep';
import PortfolioStep from './steps/portfolioStep';
import PricingStep from './steps/pricingStep';

export default function ProfessionalOnboarding({ route }) {
  const { userId } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();
  
  const steps = [
    { component: BasicInfoStep, name: 'BasicInfo', required: true },
    { component: ServicesStep, name: 'Services', required: true },
    { component: PortfolioStep, name: 'Portfolio', required: false },
    { component: PricingStep, name: 'Pricing', required: true }
  ];

  // Fetch initial profile data
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('professional_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) throw error;
        setProfile(data);
        
        // If user already started onboarding, resume from last completed step
        if (data.onboarding_steps_completed > 0 && 
            data.onboarding_steps_completed < steps.length) {
          setCurrentStep(data.onboarding_steps_completed);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfile();
  }, [userId]);

  const CurrentStep = steps[currentStep].component;

  const handleCompleteStep = async () => {
    setIsLoading(true);
    try {
      // Update the step counter
      const { error } = await supabase
        .from('professional_profiles')
        .update({ onboarding_steps_completed: currentStep + 1 })
        .eq('user_id', userId);
      
      if (error) throw error;

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Mark onboarding as complete and navigate to dashboard
        await supabase
          .from('professional_profiles')
          .update({ onboarding_complete: true })
          .eq('user_id', userId);
          
        navigation.navigate('ProDetails' as never);
      }
    } catch (error) {
      console.error('Error updating step:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipStep = async () => {
    // Only allow skipping non-required steps
    if (!steps[currentStep].required) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  if (isLoading && !profile) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
        </Text>
        <ProgressBar 
          progress={(currentStep / (steps.length - 1)) * 100} 
          style={styles.progressBar}
        />
      </View>
      
      <View style={styles.stepContainer}>
        <CurrentStep 
          userId={userId}
          profile={profile}
          onComplete={handleCompleteStep}
          onSkip={handleSkipStep}
          isLoading={isLoading}
        />
      </View>
      
      {!steps[currentStep].required && (
        <Text style={styles.skipInfo}>
          This step is optional. You can skip it for now and come back later.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    flex: 1,
  },
  skipInfo: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  }
});