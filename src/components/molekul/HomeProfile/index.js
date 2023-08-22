import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {ILNullPhoto} from '../../../assets';
import {colors, fonts, getData} from '../../../utils';
import {useEffect} from 'react';

const HomeProfile = ({onPress}) => {
  const [profile, setProfile] = useState({
    photo: ILNullPhoto,
    fullName: '',
    profession: '',
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
      console.error('Error loading user profile:', error);
    }
  };
  return (
    <TouchableOpacity style={styles.containter} onPress={onPress}>
      <Image style={styles.avatar} source={profile.photo} />
      <View>
        <Text style={styles.name}>{profile.fullName}</Text>
        <Text style={styles.profession}>{profile.profession}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeProfile;

const styles = StyleSheet.create({
  containter: {
    flexDirection: 'row',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
  },
  profession: {
    fontSize: 12,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
  },
});
