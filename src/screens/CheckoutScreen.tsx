import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useCart } from '../context/CartContext';
import HeaderBar from '../components/HeaderBar';

type CheckoutScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Checkout'
>;

const PICKUP_COUNTERS = [
  'Central Cafeteria - Express Counter 1',
  'Central Cafeteria - Meals Counter 2',
  'Faculty of Applied Sciences Kiosk',
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Campus Student Card', icon: 'card-outline' },
  { id: 'cash', name: 'Cash on Pickup', icon: 'cash-outline' },
  { id: 'qr', name: 'Student LankaQR / App', icon: 'qr-code-outline' },
];

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const { items, itemCount, subtotal, userName, setUserName, placeNewOrder } =
    useCart();
  const [selectedCounter, setSelectedCounter] = useState(PICKUP_COUNTERS[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].name);
  const [pickupNote, setPickupNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items before placing an order.');
      navigation.navigate('Home');
      return;
    }

    setIsSubmitting(true);
    // Simulate brief order processing
    setTimeout(() => {
      const order = placeNewOrder(selectedCounter, selectedPayment);
      setIsSubmitting(false);
      navigation.replace('OrderConfirmation', { order });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar title="Order Checkout" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pickup Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location" size={20} color="#FF5722" />
            <Text style={styles.cardTitle}>Pickup Information</Text>
          </View>

          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>Student Customer</Text>
            <TextInput
              style={styles.fieldInput}
              value={userName}
              onChangeText={setUserName}
              placeholder="Your Name"
            />
          </View>

          <Text style={styles.fieldLabel}>Select Campus Pickup Counter</Text>
          {PICKUP_COUNTERS.map((counter) => (
            <TouchableOpacity
              key={counter}
              style={[
                styles.optionRow,
                selectedCounter === counter && styles.optionRowSelected,
              ]}
              onPress={() => setSelectedCounter(counter)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  selectedCounter === counter
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={18}
                color={selectedCounter === counter ? '#FF5722' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedCounter === counter && styles.optionTextSelected,
                ]}
              >
                {counter}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={[styles.infoField, { marginTop: 12 }]}>
            <Text style={styles.fieldLabel}>Special Request (Optional)</Text>
            <TextInput
              style={styles.fieldInput}
              value={pickupNote}
              onChangeText={setPickupNote}
              placeholder="e.g. Less spicy, pack separately"
            />
          </View>
        </View>

        {/* Payment Selection Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="wallet-outline" size={20} color="#FF5722" />
            <Text style={styles.cardTitle}>Payment Simulation</Text>
          </View>

          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.optionRow,
                selectedPayment === method.name && styles.optionRowSelected,
              ]}
              onPress={() => setSelectedPayment(method.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  selectedPayment === method.name
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={18}
                color={selectedPayment === method.name ? '#FF5722' : '#94A3B8'}
              />
              <Ionicons
                name={method.icon as any}
                size={18}
                color="#64748B"
                style={{ marginLeft: 6 }}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedPayment === method.name && styles.optionTextSelected,
                ]}
              >
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Review List */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="receipt-outline" size={20} color="#FF5722" />
            <Text style={styles.cardTitle}>Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})</Text>
          </View>

          {items.map((item) => (
            <View key={item.id} style={styles.orderItemRow}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.orderItemQty}>{item.quantity}x</Text>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.orderItemPrice}>
                LKR {item.price * item.quantity}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalPrice}>LKR {subtotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order CTA */}
      <View style={styles.bottomDock}>
        <TouchableOpacity
          style={[styles.placeOrderBtn, isSubmitting && styles.placeOrderBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-done-circle" size={22} color="#FFFFFF" />
          <Text style={styles.placeOrderBtnText}>
            {isSubmitting ? 'Placing Order...' : `Place Order (LKR ${subtotal})`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoField: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    gap: 8,
  },
  optionRowSelected: {
    borderColor: '#FF5722',
    backgroundColor: '#FFF7F5',
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  optionTextSelected: {
    color: '#FF5722',
    fontWeight: '700',
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  orderItemQty: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5722',
  },
  orderItemName: {
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF5722',
  },
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  placeOrderBtn: {
    backgroundColor: '#FF5722',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  placeOrderBtnDisabled: {
    opacity: 0.7,
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
