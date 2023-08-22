import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import {colors, fonts} from '../../../utils';

const Input = ({label, value, onChangeText, secureTextEntry, disabled}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputStyles = [
    styles.input,
    {
      borderColor: isFocused ? colors.tertiary : colors.border,
    },
  ];

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        selectTextOnFocus={!disabled}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  label: {
    fontSize: 16,
    color: colors.text.secondary,
    fontFamily: fonts.primary[400],
  },
});
