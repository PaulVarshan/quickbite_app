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
import { OrderStatus, RootStackParamList } from '../types';
import { useCart } from '../context/CartContext';
import HeaderBar from '../components/HeaderBar';

type OrderTrackingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderTracking'
>;

const STATUS_STEPS: {
  status: OrderStatus;
  title: string;
  desc: string;
  icon: any;
}[] = [
  {
    status: 'Placed',
    title: 'Order Placed',
    desc: 'Your ticket has been sent to the kitchen',
    icon: 'receipt',
  },
  {
    status: 'Preparing',
    title: 'Preparing Food',
    desc: 'The kitchen chefs are preparing your meal',
    icon: 'flame',
  },
  {
    status: 'Ready for Pickup',
    title: 'Ready for Pickup',
    desc: 'Collect your order at the cafeteria counter',
    icon: 'bag-check',
  },
];

export default function OrderTrackingScreen({
  route,
  navigation,
}: OrderTrackingScreenProps) {
  const { orders, currentOrder, advanceOrderStatus } = useCart();
  const routeOrderId = route.params?.orderId;

  // Resolve target order
  const activeOrder =
    (routeOrderId ? orders.find((o) => o.id === routeOrderId) : null) ||
    currentOrder ||
    orders[0] ||
    null;

  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="Track Order" onBack={() => navigation.navigate('Home')} />
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={56} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No active order to track</Text>
          <Text style={styles.emptySubtitle}>
            Place a food order from the home screen first to track its real-time preparation.
          </Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.actionBtnText}>Go to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.status === activeOrder.status
  );

  const isCompleted = activeOrder.status === 'Ready for Pickup';

  const handleAdvance = () => {
    advanceOrderStatus(activeOrder.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title={`Track #${activeOrder.id}`}
        onBack={() => navigation.navigate('Home')}
        rightAction={
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileBtn}
          >
            <Ionicons name="person-circle-outline" size={26} color="#0F172A" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card Header */}
        <View style={styles.statusHeaderCard}>
          <View style={styles.statusBadgeRow}>
            <View
              style={[
                styles.liveDot,
                isCompleted ? styles.liveDotGreen : styles.liveDotOrange,
              ]}
            />
            <Text style={styles.liveText}>
              {isCompleted ? 'READY NOW' : 'LIVE STATUS'}
            </Text>
          </View>

          <Text style={styles.currentStatusHeading}>
            {STATUS_STEPS[currentStepIndex]?.title || activeOrder.status}
          </Text>
          <Text style={styles.pickupTimeNote}>
            Target Pickup: {activeOrder.pickupTime}
          </Text>
          <Text style={styles.locationNote}>
            📍 {activeOrder.pickupLocation}
          </Text>
        </View>

        {/* Step-by-Step Progress Stepper */}
        <View style={styles.stepperCard}>
          <Text style={styles.stepperCardTitle}>Kitchen Progression</Text>

          {STATUS_STEPS.map((step, index) => {
            const isDone = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === STATUS_STEPS.length - 1;

            return (
              <View key={step.status} style={styles.stepRow}>
                {/* Left Indicator & Connecting Line */}
                <View style={styles.stepIndicatorCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      isDone && styles.stepCircleDone,
                      isCurrent && styles.stepCircleCurrent,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name={step.icon}
                        size={16}
                        color={isCurrent ? '#FFFFFF' : '#94A3B8'}
                      />
                    )}
                  </View>

                  {!isLast && (
                    <View
                      style={[
                        styles.stepLine,
                        isDone && styles.stepLineDone,
                      ]}
                    />
                  )}
                </View>

                {/* Right Text Content */}
                <View style={[styles.stepContent, !isLast && { paddingBottom: 28 }]}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCurrent && styles.stepTitleCurrent,
                      isDone && styles.stepTitleDone,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Manual Advance Button (Required for Testing Flow) */}
        <View style={styles.advanceCard}>
          <View style={styles.advanceCardHeader}>
            <Ionicons name="sparkles" size={18} color="#FF5722" />
            <Text style={styles.advanceCardTitle}>Order Simulation Controls</Text>
          </View>
          <Text style={styles.advanceCardDesc}>
            Advance status through stages: Placed ➔ Preparing ➔ Ready for Pickup.
          </Text>

          <TouchableOpacity
            style={[
              styles.advanceBtn,
              isCompleted && styles.advanceBtnDisabled,
            ]}
            onPress={handleAdvance}
            disabled={isCompleted}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'play-forward'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.advanceBtnText}>
              {isCompleted ? 'Order Ready for Pickup' : 'Advance to Next Status'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order Items Recap */}
        <View style={styles.recapCard}>
          <Text style={styles.recapTitle}>Order Details ({activeOrder.id})</Text>
          {activeOrder.items.map((item) => (
            <View key={item.id} style={styles.recapRow}>
              <Text style={styles.recapQty}>{item.quantity}x</Text>
              <Text style={styles.recapName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.recapPrice}>
                LKR {item.price * item.quantity}
              </Text>
            </View>
          ))}
          <View style={styles.recapDivider} />
          <View style={styles.recapTotalRow}>
            <Text style={styles.recapTotalLabel}>Subtotal</Text>
            <Text style={styles.recapTotalValue}>
              LKR {activeOrder.subtotal}
            </Text>
          </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  profileBtn: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  statusHeaderCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveDotGreen: {
    backgroundColor: '#10B981',
  },
  liveDotOrange: {
    backgroundColor: '#FF5722',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 1,
  },
  currentStatusHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pickupTimeNote: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7A50',
    marginBottom: 2,
  },
  locationNote: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  stepperCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 14,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    zIndex: 1,
  },
  stepCircleCurrent: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  stepCircleDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  stepLineDone: {
    backgroundColor: '#10B981',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  stepTitleCurrent: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF5722',
  },
  stepTitleDone: {
    color: '#0F172A',
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  advanceCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  advanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  advanceCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
  },
  advanceCardDesc: {
    fontSize: 12,
    color: '#C2410C',
    lineHeight: 16,
    marginBottom: 12,
  },
  advanceBtn: {
    backgroundColor: '#EA580C',
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  advanceBtnDisabled: {
    backgroundColor: '#10B981',
  },
  advanceBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  recapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  recapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  recapQty: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5722',
    width: 28,
  },
  recapName: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  recapPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  recapDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  recapTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recapTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  recapTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF5722',
  },
});
