import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Header, List} from '../../components';
import {colors, showError} from '../../utils';
import {onValue, ref} from 'firebase/database';
import {db} from '../../config';

const ChooseDoctor = ({navigation, route}) => {
  const {category} = route.params;

  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    callDoctorByCategory(category);
  }, [category]);
  const callDoctorByCategory = async category => {
    try {
      const doctorsRef = ref(db, 'doctors');
      onValue(doctorsRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const filteredDoctors = Object.values(data).filter(
            doctor => doctor.category === category,
          );
          setDoctors(filteredDoctors);
        }
      });
    } catch (error) {
      showError(error);
    }
  };
  return (
    <View style={styles.page}>
      <Header
        type="dark"
        title={`Pilih ${category}`}
        onPress={() => navigation.goBack()}
      />
      {doctors.map((doctor, index) => (
        <List
          key={index}
          profile={doctor.photo}
          name={doctor.fullName}
          desc={doctor.profession}
          type="next"
          onPress={() => navigation.navigate('DoctorProfile', doctor)}
        />
      ))}
    </View>
  );
};

export default ChooseDoctor;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
