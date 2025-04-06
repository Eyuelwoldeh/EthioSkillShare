import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress, style }) {
  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.progress, 
          { width: `${Math.min(100, Math.max(0, progress))}%` }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    backgroundColor: '#e6e6e6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1890ff',
  },
});