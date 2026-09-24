import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
};

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
}: QuantitySelectorProps) {
  const isMin = quantity <= minQuantity;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrease}
        disabled={isMin}
        style={[styles.button, isMin && styles.buttonDisabled]}
        activeOpacity={0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="remove"
          size={18}
          color={isMin ? '#CBD5E1' : '#1E293B'}
        />
      </TouchableOpacity>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{quantity}</Text>
      </View>

      <TouchableOpacity
        onPress={onIncrease}
        style={styles.button}
        activeOpacity={0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="add" size={18} color="#1E293B" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonDisabled: {
    backgroundColor: '#F8FAFC',
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityContainer: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
});
