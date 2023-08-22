import {TouchableOpacity} from 'react-native';
import React from 'react';
import {IconBackDark, IconBackLight} from '../../../assets';

const IconsOnly = ({onPress, icon}) => {
  const getIcon = () => {
    switch (icon) {
      case 'back-dark':
        return <IconBackDark />;
      case 'back-light':
        return <IconBackLight />;
      default:
        return <IconBackDark />;
    }
  };

  return <TouchableOpacity onPress={onPress}>{getIcon()}</TouchableOpacity>;
};

export default IconsOnly;
