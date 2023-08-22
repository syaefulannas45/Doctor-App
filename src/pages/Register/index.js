import {StyleSheet, View, ScrollView} from 'react-native';
import {useState} from 'react';
import {Button, Gap, Header, Input, Loading} from '../../components';
import {colors, storeData, useForm} from '../../utils';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, db, ref, set} from '../../config';

const Register = ({navigation}) => {
  const [form, setForm] = useForm({
    fullName: '',
    profession: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      const newUsersRef = ref(db, `users/${userCredential.user.uid}`);

      const newData = {
        fullName: form.fullName,
        profession: form.profession,
        email: form.email,
        uid: userCredential.user.uid,
      };

      await set(newUsersRef, newData);

      await storeData('user', newData);

      setLoading(false);
      setForm('reset');

      navigation.navigate('UploadPhoto', newData);
    } catch (error) {
      setLoading(false);
      showError(error.message);
    }
  };

  return (
    <>
      <View style={styles.page}>
        <Header onPress={() => navigation.goBack()} title="Daftar Akun" />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Input
            label="Nama Lengkap"
            value={form.fullName}
            onChangeText={value => setForm('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Pekerjaan"
            value={form.profession}
            onChangeText={value => setForm('profession', value)}
          />
          <Gap height={24} />
          <Input
            label="Email"
            value={form.email}
            onChangeText={value => setForm('email', value)}
          />

          <Gap height={24} />
          <Input
            label="Password"
            value={form.password}
            onChangeText={value => setForm('password', value)}
            secureTextEntry
          />
          <Gap height={40} />
          <Button title="Continue" onPress={handleRegister} />
        </ScrollView>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  content: {
    padding: 40,
    paddingTop: 0,
  },
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
