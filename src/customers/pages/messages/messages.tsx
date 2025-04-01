import React, { useState } from 'react';
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
import Layout from '../../../layout';

type Message = {
  id: string;
  sender: {
    id: string;
    name: string;
    image: string;
    isOnline?: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
};

// Mock data for message conversations
const conversations: Message[] = [
  {
    id: '1',
    sender: {
      id: '101',
      name: 'Alemayehu K.',
      image: 'https://picsum.photos/id/1060/400/300',
      isOnline: true,
    },
    lastMessage: 'I can help you with Amharic lessons. When would you like to start?',
    timestamp: '10:30 AM',
    unread: 2,
  },
  {
    id: '2',
    sender: {
      id: '102',
      name: 'Tewodros M.',
      image: 'https://picsum.photos/id/1074/400/300',
      isOnline: false,
    },
    lastMessage: "I'll be there tomorrow at 2pm to fix your sink.",
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    sender: {
      id: '103',
      name: 'Selam W.',
      image: 'https://picsum.photos/id/1027/400/300',
      isOnline: true,
    },
    lastMessage: "I've uploaded the photos from your event. Please check and let me know what you think!",
    timestamp: 'Mar 27',
    unread: 1,
  },
  {
    id: '4',
    sender: {
      id: '104',
      name: 'Yonas T.',
      image: 'https://picsum.photos/id/1012/400/300',
      isOnline: false,
    },
    lastMessage: 'The quote for your website development is ETB 15,000. This includes all the features you requested.',
    timestamp: 'Mar 25',
    unread: 0,
  },
  {
    id: '5',
    sender: {
      id: '105',
      name: 'Hanna B.',
      image: 'https://picsum.photos/id/1014/400/300',
      isOnline: true,
    },
    lastMessage: "I'm available for the cooking class this Saturday. Looking forward to it!",
    timestamp: 'Mar 22',
    unread: 0,
  },
];

const MessageCard = ({ message }: { message: Message }) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      style={styles.messageCard}
      onPress={() => navigation.navigate('ChatDetail' as never)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: message.sender.image }} style={styles.avatar} />
        {message.sender.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{message.sender.name}</Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
        
        <View style={styles.messagePreview}>
          <Text 
            style={[
              styles.previewText, 
              message.unread > 0 && styles.unreadText
            ]}
            numberOfLines={1}
          >
            {message.lastMessage}
          </Text>
          
          {message.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{message.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MessageScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.newMessageButton}>
            <Feather name="edit" size={22} color="#4A78EF" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search messages"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
            onPress={() => setActiveTab('unread')}
          >
            <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>Unread</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'archived' && styles.activeTab]}
            onPress={() => setActiveTab('archived')}
          >
            <Text style={[styles.tabText, activeTab === 'archived' && styles.activeTabText]}>Archived</Text>
          </TouchableOpacity>
        </View>
        
        {/* Messages List */}
        <FlatList
          data={activeTab === 'unread' ? conversations.filter(msg => msg.unread > 0) : conversations}
          renderItem={({ item }) => <MessageCard message={item} />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="message-circle" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No messages to display</Text>
            </View>
          }
        />
        
        {/* Empty State */}
        {conversations.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No messages yet</Text>
            <Text style={styles.emptyStateSubtext}>Your conversations with service providers will appear here</Text>
            <TouchableOpacity style={styles.emptyStateButton}>
              <Text style={styles.emptyStateButtonText}>Find Services</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Layout>
  );
};

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
  newMessageButton: {
    backgroundColor: '#F0F4FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
  },
  activeTab: {
    backgroundColor: '#4A78EF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadText: {
    fontWeight: '600',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#4A78EF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyStateButton: {
    backgroundColor: '#4A78EF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MessageScreen;