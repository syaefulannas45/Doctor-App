import {StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Profile, ProfileItem} from '../../components';
import {colors} from '../../utils';

const DoctorProfile = ({navigation, route}) => {
  const dataDoctor = route.params;
  return (
    <View style={styles.page}>
      <Header title="Doctor Profile" onPress={() => navigation.goBack()} />
      <Profile
        name={dataDoctor.fullName}
        desc={dataDoctor.profession}
        photo={{uri: dataDoctor.photo}}
      />
      <Gap height={10} />
      <ProfileItem value={dataDoctor.university} label="Alumnus" />
      <ProfileItem value={dataDoctor.hospital_address} label="Tempat Praktik" />
      <ProfileItem value={dataDoctor.str_number} label="No. STR" />

      <View style={styles.action}>
        <Button
          title="Mulai Konsultasi"
          onPress={() => navigation.navigate('Chatting', dataDoctor)}
        />
      </View>
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  action: {
    paddingHorizontal: 40,
    paddingTop: 23,
  },
});
