import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {ILLogo} from '../../assets';
import {colors} from '../../utils';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../../config';

const Splash = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      const destinationScreen = user ? 'MainApp' : 'GetStarted';
      setTimeout(() => {
        navigation.replace(destinationScreen);
      }, 1000);
    });
    return () => unsubscribe();
  }, []);
  return (
    <View style={styles.page}>
      <ILLogo />
      <Text style={styles.title}>My Doctor</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 20,
  },
});
