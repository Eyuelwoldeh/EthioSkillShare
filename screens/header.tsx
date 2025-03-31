// components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
};

const Header = ({
  title = "EthioSkillShare",
  subtitle = "Find your trusted pro",
  showBackButton = false,
  onBackPress,
  rightIcon,
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Left Section (Back Button/Empty Space) */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4A78EF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Section (Title) */}
      <View style={styles.centerSection}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerTagline}>
          <Ionicons name="flash" size={14} color="#FFD700" />
          <Text style={styles.headerSubtitle}> {subtitle}</Text>
        </View>
      </View>

      {/* Right Section (Profile/Other Icons) */}
      <View style={styles.rightSection}>
        {rightIcon || (
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={24} color="#4A78EF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    width: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    letterSpacing: -0.5,
  },
  headerTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  profileButton: {
    backgroundColor: '#F0F4FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;