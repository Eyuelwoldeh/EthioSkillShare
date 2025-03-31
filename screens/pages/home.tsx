import React from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput,
  FlatList,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import Header from '../header';
import Layout from '../../layout';

type Professional = {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  price: string;
  isVerified: boolean;
  image: string;
};

// Mock data for professionals
const featuredPros: Professional[] = [
  {
    id: '1',
    name: 'Alemayehu K.',
    profession: 'Amharic Tutor',
    rating: 4.9,
    reviews: 42,
    price: 'ETB 1,500/hr',
    isVerified: true,
    image: 'https://picsum.photos/id/1060/400/300',
  },
  {
    id: '2',
    name: 'Tewodros M.',
    profession: 'Plumber',
    rating: 4.7,
    reviews: 28,
    price: 'ETB 800/service',
    isVerified: true,
    image: 'https://picsum.photos/id/1074/400/300',
  },
  {
    id: '3',
    name: 'Selam W.',
    profession: 'Event Photographer',
    rating: 5.0,
    reviews: 15,
    price: 'ETB 5,000/day',
    isVerified: false,
    image: 'https://picsum.photos/id/1027/400/300',
  },
];

const ProCard = ({ pro }: { pro: Professional }) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      style={styles.proCard}
      onPress={() => navigation.navigate('Details')}
    >
      <Image source={{ uri: pro.image }} style={styles.proImage} />
      <View style={styles.proInfo}>
        <View style={styles.proHeader}>
          <Text style={styles.proName}>{pro.name}</Text>
          {pro.isVerified && (
            <MaterialIcons name="verified" size={16} color="#4A78EF" />
          )}
        </View>
        <Text style={styles.proProfession}>{pro.profession}</Text>
        <View style={styles.proMeta}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{pro.rating}</Text>
            <Text style={styles.reviewsText}>({pro.reviews})</Text>
          </View>
          <Text style={styles.proPrice}>{pro.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Layout>
    <SafeAreaView style={styles.container}>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="What service do you need?"
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="map-pin" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="construct" size={24} color="#1976D2" />
              </View>
              <Text style={styles.serviceText}>Home Repair</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialIcons name="cleaning-services" size={24} color="#388E3C" />
              </View>
              <Text style={styles.serviceText}>Cleaning</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcons name="camera-alt" size={24} color="#FB8C00" />
              </View>
              <Text style={styles.serviceText}>Photography</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#FCE4EC' }]}>
                <FontAwesome name="scissors" size={24} color="#E91E63" />
              </View>
              <Text style={styles.serviceText}>Beauty</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Top Professionals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Professionals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllPros')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredPros}
            renderItem={({ item }) => <ProCard pro={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
        
        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Describe your need</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Get matched with pros</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Hire the best fit</Text>
            </View>
          </View>
        </View>
        
        {/* CTA Banner */}
        <TouchableOpacity 
          style={styles.ctaBanner}
          onPress={() => navigation.navigate('PostRequest')}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Need something done?</Text>
            <Text style={styles.ctaSubtitle}>Post a request and get quotes</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Post a Request</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://picsum.photos/id/160/800/400' }} 
            style={styles.ctaImage} 
            resizeMode="cover"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: '#4A78EF',
    padding: 10,
    borderRadius: 8,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    backgroundColor: '#F0F4FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#4A78EF',
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  serviceItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  featuredList: {
    paddingRight: 16,
  },
  proCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  proImage: {
    width: '100%',
    height: 120,
  },
  proInfo: {
    padding: 12,
  },
  proHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  proName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  proProfession: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  proMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  proPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A78EF',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  step: {
    alignItems: 'center',
    width: '30%',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A78EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  ctaBanner: {
    marginHorizontal: 16,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  ctaImage: {
    width: '100%',
    height: '100%',
  },
  ctaContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 2,
  },
  ctaTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ctaSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#4A78EF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
});