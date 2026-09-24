import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';

type OrderConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderConfirmation'
>;

export default function OrderConfirmationScreen({
  route,
  navigation,
}: OrderConfirmationScreenProps) {
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon & Heading */}
        <View style={styles.heroSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your meal order has been transmitted directly to the campus kitchen.
          </Text>
        </View>

        {/* Order Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.ticketLabel}>ORDER NUMBER</Text>
              <Text style={styles.orderIdText}>{order.id}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{order.status}</Text>
            </View>
          </View>

          <View style={styles.dividerDashed} />

          {/* Pickup Highlight Box */}
          <View style={styles.pickupHighlight}>
            <Ionicons name="time" size={24} color="#FF5722" />
            <View style={{ flex: 1 }}>
              <Text style={styles.pickupHighlightLabel}>ESTIMATED PICKUP TIME</Text>
              <Text style={styles.pickupHighlightTime}>{order.pickupTime}</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pickup Location</Text>
            <Text style={styles.detailValue}>{order.pickupLocation}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student Name</Text>
            <Text style={styles.detailValue}>{order.userName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{order.paymentMethod}</Text>
          </View>

          <View style={styles.divider} />

          {/* Items Summary */}
          <Text style={styles.itemsHeader}>Items in this order</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.quantity}x</Text>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                LKR {item.price * item.quantity}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid / Due</Text>
            <Text style={styles.totalAmount}>LKR {order.subtotal}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() =>
              navigation.replace('OrderTracking', { orderId: order.id })
            }
            activeOpacity={0.85}
          >
            <Ionicons name="navigate-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.trackButtonText}>Track Order Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={18} color="#0F172A" />
            <Text style={styles.homeButtonText}>Back to Home Menu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  successCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 20,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  orderIdText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF5722',
  },
  statusPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  dividerDashed: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  pickupHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1EE',
    padding: 14,
    borderRadius: 14,
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD7CC',
  },
  pickupHighlightLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5722',
    letterSpacing: 0.5,
  },
  pickupHighlightTime: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  itemsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemQty: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5722',
    width: 28,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF5722',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  trackButton: {
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
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  homeButton: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  homeButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
});
