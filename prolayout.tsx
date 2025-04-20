// components/Layout.tsx
import React from 'react';
import { View } from 'react-native';
import ProfessionalFooter from './src/professionals/footer';

const ProfessionalLayout = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      <ProfessionalFooter />
    </View>
  );
};

export default ProfessionalLayout;