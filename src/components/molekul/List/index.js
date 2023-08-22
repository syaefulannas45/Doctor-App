import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  IconEditProfile,
  IconGiveRate,
  IconHelp,
  IconLanguage,
  IconNextDark,
} from '../../../assets';
import {colors, fonts} from '../../../utils';

const List = ({profile, name, desc, type, onPress, icon}) => {
  const renderIcon = () => {
    if (icon === 'edit-profile') return <IconEditProfile />;
    if (icon === 'language') return <IconLanguage />;
    if (icon === 'give-rate') return <IconGiveRate />;
    if (icon === 'help') return <IconHelp />;
    return <IconEditProfile />;
  };
  const renderAvatar = () => {
    if (icon) {
      return renderIcon();
    } else {
      return <Image source={{uri: profile}} style={styles.avatar} />;
    }
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {renderAvatar()}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
      {type === 'next' && <IconNextDark />}
    </TouchableOpacity>
  );
};

export default List;

const styles = StyleSheet.create({
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    marginRight: 12,
  },
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.primary.normal,
    color: colors.text.primary,
  },
  desc: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
});
