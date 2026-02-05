import React, { ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  icon?: ReactNode;
  secureTextEntry?: boolean; // garante boolean explícito
}

export function Input({
  icon,
  secureTextEntry = false, // default false
  style,
  ...rest
}: InputProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}

      <TextInput
        {...rest}
        style={[styles.input, style]}
        secureTextEntry={!!secureTextEntry} // força boolean
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
