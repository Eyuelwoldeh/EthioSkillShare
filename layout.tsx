// components/Layout.tsx
import React from 'react';
import { View } from 'react-native';
import Footer from './screens/footer';
import Header from './screens/header';

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