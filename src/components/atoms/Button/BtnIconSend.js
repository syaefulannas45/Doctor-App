import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {BtnSendActive, BtnSendDeactive} from '../../../assets';
import {colors} from '../../../utils';

const BtnIconSend = ({disable, onPress}) => {
  if (disable) {
    return (
      <View style={styles.container(disable)}>
        <BtnSendActive />
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.container(disable)}>
      <BtnSendDeactive />
    </TouchableOpacity>
  );
};

export default BtnIconSend;

const styles = StyleSheet.create({
  container: disable => ({
    backgroundColor: disable ? colors.disable : colors.tertiary,
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }),
});
