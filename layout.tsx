// components/Layout.tsx
import React from 'react';
import { View } from 'react-native';
import Footer from './src/customers/footer';
import Header from './src/customers/header';

const Layout = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1 }}>{children}</View>
      <Footer />
    </View>
  );
};

export default Layout;