import React from 'react';
import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import {ILGetStarted, ILLogo} from '../../assets';
import {Button, Gap} from '../../components';
import {colors, fonts} from '../../utils';

const GetStarted = ({navigation}) => {
  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground source={ILGetStarted} style={styles.page}>
      <View style={styles.header}>
        <ILLogo />
        <Text style={styles.title}>
          Konsultasi dengan dokter jadi lebih mudah & fleksibel
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Get Started" onPress={handleNavigateToRegister} />
        <Gap height={16} />
        <Button
          type="secondary"
          title="Sign in"
          onPress={handleNavigateToLogin}
        />
      </View>
    </ImageBackground>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 40,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  header: {
    marginTop: 91,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.primary[600],
    color: colors.white,
    marginTop: 26,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
