import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Category } from '../types';

type CategoryButtonProps = {
  title: Category;
  isSelected: boolean;
  onPress: () => void;
};

export default function CategoryButton({
  title,
  isSelected,
  onPress,
}: CategoryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, isSelected && styles.buttonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonSelected: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  textSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
