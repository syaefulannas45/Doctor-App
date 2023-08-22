import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Button, Gap, Header, Link} from '../../components';
import {ILNullPhoto, IconAddPhoto, IconButtonRemove} from '../../assets';
import {colors, fonts, showError, storeData} from '../../utils';
import {launchImageLibrary} from 'react-native-image-picker';
import {db, ref as dbRef, storage, update} from '../../config';

import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import uriToBlob from '../../utils/blob';

const UploadPhoto = ({navigation, route}) => {
  const {fullName, profession, uid} = route.params;

  const [hasPhoto, setHasPhoto] = useState(false);
  const [photo, setPhoto] = useState(ILNullPhoto);

  const handleImageSelection = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel || response.errorCode) {
        showError('Opps, sepertinya anda tidak memilih foto');
      } else {
        setPhoto({uri: response.assets[0].uri});
        setHasPhoto(true);
      }
    });
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 100000);
  };

  const uploadAndContinue = async () => {
    const randomNumber = getRandomNumber();
    const ext = photo.uri.split('.').pop();
    const imageName = `photo_profile/img_${randomNumber}_${Date.now()}.${ext}`;
    const imageReference = ref(storage, imageName);
    try {
      const blob = await uriToBlob(photo.uri);

      await uploadBytes(imageReference, blob, {contentType: `image/${ext}`});

      const urlImage = await getDownloadURL(imageReference);
      const userRef = dbRef(db, `users/${uid}`);
      const data = {...route.params, photo: urlImage};

      await update(userRef, data);

      await storeData('user', data);

      navigation.replace('MainApp');
    } catch (error) {
      showError(error.message);
    }
  };
  return (
    <View style={styles.page}>
      <Header title="Uplad Photo" />
      <View style={styles.content}>
        <View style={styles.profile}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handleImageSelection}>
            <Image source={photo} style={styles.avatar} />

            {hasPhoto ? (
              <IconButtonRemove style={styles.addPhoto} />
            ) : (
              <IconAddPhoto style={styles.addPhoto} />
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.profession}>{profession}</Text>
        </View>
        <View>
          <Button
            title="Upload dan Lanjut"
            onPress={uploadAndContinue}
            disable={!hasPhoto}
          />
          <Gap height={30} />
          <Link
            title="Skip for this"
            align="center"
            size={16}
            onPress={() => navigation.replace('MainApp')}
          />
        </View>
      </View>
    </View>
  );
};

export default UploadPhoto;

const styles = StyleSheet.create({
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
  },
  profile: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 130 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  addPhoto: {
    position: 'absolute',
    bottom: 8,
    right: 6,
  },
  name: {
    fontSize: 24,
    color: colors.text.primary,
    fontFamily: fonts.primary[600],
    textAlign: 'center',
  },
  profession: {
    fontSize: 18,
    color: colors.text.secondary,
    fontFamily: fonts.primary.normal,
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 64,
  },
});
