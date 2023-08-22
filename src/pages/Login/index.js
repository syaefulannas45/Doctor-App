import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ILLogo} from '../../assets';
import {Button, Gap, Input, Link} from '../../components';
import {colors, fonts, showError, storeData, useForm} from '../../utils';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth, db, get} from '../../config';
import {ref} from '../../config';
import {useDispatch} from 'react-redux';

const Login = ({navigation}) => {
  const [form, setForm] = useForm({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const handleLogin = async () => {
    dispatch({type: 'SET_LOADING', value: true});
    try {
      const userLogin = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const dataRef = ref(db, `users/${userLogin.user.uid}/`);

      const snapshot = await get(dataRef);
      dispatch({type: 'SET_LOADING', value: false});
      if (snapshot.val()) {
        await storeData('user', snapshot.val());
      }
      navigation.replace('MainApp');
    } catch (error) {
      dispatch({type: 'SET_LOADING', value: false});
      showError(error.message);
    }
  };
  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={40} />
        <ILLogo />
        <Text style={styles.title}>Masuk dan mulai berkonsultasi</Text>
        <Input
          label="Email Address"
          value={form.email}
          onChangeText={value => setForm('email', value)}
        />
        <Gap height={24} />
        <Input
          label="Password"
          onChangeText={value => setForm('password', value)}
          secureTextEntry
        />
        <Gap height={10} />
        <Link title="Forgot My Password" size={12} />
        <Gap height={40} />
        <Button title="Sign in" onPress={handleLogin} />
        <Gap height={30} />
        <Link
          title="Create New Account"
          size={16}
          align="center"
          onPress={() => navigation.navigate('Register')}
        />
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[700],
    color: colors.text.primary,
    marginTop: 40,
    marginBottom: 40,
    maxWidth: 180,
  },
});
