import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Gap, Header, List, Profile} from '../../components';
import {colors, getData, removeData} from '../../utils';
import {ILNullPhoto} from '../../assets';
import {signOut} from 'firebase/auth';
import {auth} from '../../config';

const UserProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    photo: ILNullPhoto,
  });
  useEffect(() => {
    loadUserProfile();
  }, []);
  const loadUserProfile = async () => {
    try {
      const data = await getData('user');
      if (data) {
        const updatedProfile = {
          ...data,
          photo: data.photo ? {uri: data.photo} : ILNullPhoto,
        };
        setProfile(updatedProfile);
      }
    } catch (error) {
      showError(error.message);
    }
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        removeData('user');
        navigation.replace('GetStarted');
      })
      .catch(error => {
        showError(error.message);
      });
  };
  return (
    <View style={styles.page}>
      <Header title="Profile" onPress={() => navigation.goBack()} />
      <Gap height={10} />
      {profile.fullName.length > 0 && (
        <Profile
          name={profile.fullName}
          desc={profile.profession}
          photo={profile.photo}
        />
      )}
      <Gap height={14} />
      <List
        name="Edit Profile"
        desc="Last Update Yesterday"
        type="next"
        icon="edit-profile"
        onPress={() => navigation.navigate('UpdateProfile')}
      />
      <List
        name="Language"
        desc="Last Update Yesterday"
        type="next"
        icon="language"
      />
      <List
        name="Give Us"
        desc="Last Update Yesterday"
        type="next"
        icon="give-rate"
      />
      <List
        name="Sign Out"
        desc="Last Update Yesterday"
        type="next"
        icon="help"
        onPress={handleSignOut}
      />
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
