import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  IconDoctor,
  IconDoctorActive,
  IconHospitals,
  IconHospitalsActive,
  IconMessages,
  IconMessagesActive,
} from '../../../assets';
import {colors, fonts} from '../../../utils';

const TabItems = ({title, active, onPress, onLongPress}) => {
  const getIcon = () => {
    switch (title) {
      case 'Doctor':
        return active ? <IconDoctorActive /> : <IconDoctor />;
      case 'Messages':
        return active ? <IconMessagesActive /> : <IconMessages />;
      case 'Hospitals':
        return active ? <IconHospitalsActive /> : <IconHospitals />;
      default:
        return <IconDoctor />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}>
      {getIcon()}
      <Text style={styles.text(active)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabItems;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: active => ({
    fontFamily: fonts.primary[600],
    color: active ? colors.text.active : colors.text.inactive,
    fontSize: 10,
    marginTop: 4,
  }),
});
