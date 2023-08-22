import {StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Gap, Header, Input, Loading, Profile} from '../../components';
import {colors, getData, storeData, showError} from '../../utils';
import {ILNullPhoto} from '../../assets';
import {auth, db, ref as dbRef, storage, update} from '../../config';
import {updatePassword} from 'firebase/auth';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import uriToBlob from '../../utils/blob';

const UpdateProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    email: '',
  });
  const [password, setPassword] = useState('');

  const [photo, setPhoto] = useState(ILNullPhoto);
  const [loading, setLoading] = useState(false);

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
        setPhoto(updatedProfile.photo);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const handleImageSelection = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (!response.didCancel) {
        setPhoto({uri: response.assets[0].uri});
      } else {
        showError('Opps,sepertinya anda tidak memilih foto');
      }
    });
  };
  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      if (password.length > 0 && password.length < 6) {
        showError('Password kurang dari 6');
        setLoading(false);
      } else {
        if (password.length > 0) {
          await updatePassword(user, password);
        }
        await uploadAndDisplayPhoto();
        setLoading(false);
        navigation.replace('MainApp');
      }
    } catch (error) {
      setLoading(false);
      showError(error.message, 'Password kurang dari 6');
    }
  };

  const uploadAndDisplayPhoto = async () => {
    const randomNumber = Math.floor(Math.random() * 100000);
    const ext = photo.uri.split('.').pop();
    const imageName = `photo_profile/img_${randomNumber}_${Date.now()}.${ext}`;
    const imageReference = ref(storage, imageName);

    try {
      const blob = await uriToBlob(photo.uri);
      await uploadBytes(imageReference, blob, {
        contentType: `image/${ext}`,
      });

      const imageUrl = await getDownloadURL(imageReference);

      const data = {...profile, photo: imageUrl};

      const userRef = dbRef(db, `users/${profile.uid}`);
      console.log(data);
      await update(userRef, data);
      storeData('user', data);
    } catch (error) {
      showError(error.message);
      console.log(error);
    }
  };

  const handleChangeText = (key, value) => {
    setProfile({...profile, [key]: value});
  };
  return (
    <>
      <View style={styles.page}>
        <Header title="Edit Profile" onPress={() => navigation.goBack()} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Profile photo={photo} onPress={handleImageSelection} isRemove />
            <Gap height={26} />
            <Input
              label="Nama Lengkap"
              value={profile.fullName}
              onChangeText={value => handleChangeText('fullName', value)}
            />
            <Gap height={24} />
            <Input
              label="Pekerjaan"
              value={profile.profession}
              onChangeText={value => handleChangeText('profession', value)}
            />
            <Gap height={24} />
            <Input label="Email" value={profile.email} disabled />
            <Gap height={24} />
            <Input
              label="Password"
              value={password}
              onChangeText={value => setPassword(value)}
              secureTextEntry
            />
            <Gap height={40} />
            <Button title="Save Profile" onPress={handleEditProfile} />
          </View>
        </ScrollView>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    padding: 40,
    paddingTop: 0,
  },
});
