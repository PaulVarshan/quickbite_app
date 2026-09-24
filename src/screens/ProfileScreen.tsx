import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Order, RootStackParamList } from '../types';
import { useCart } from '../context/CartContext';
import HeaderBar from '../components/HeaderBar';

type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { userName, orders, setUserName } = useCart();

  const handleSignOut = () => {
    setUserName('Guest Student');
    navigation.replace('Login');
  };

  const renderHeader = () => (
    <View style={styles.headerArea}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>
            {userName ? userName.charAt(0).toUpperCase() : 'G'}
          </Text>
        </View>

        <View style={styles.profileMeta}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.tagRow}>
            <View style={styles.badge}>
              <Ionicons name="school" size={12} color="#FF5722" />
              <Text style={styles.badgeText}>Campus Student</Text>
            </View>
            <View style={[styles.badge, styles.badgeGreen]}>
              <Ionicons name="sparkles" size={12} color="#10B981" />
              <Text style={[styles.badgeText, styles.badgeTextGreen]}>
                QuickBite Member
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Campus Perks Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders Placed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statVal}>
            {orders.reduce((sum, o) => sum + o.items.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Items Ordered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statVal}>~20m</Text>
          <Text style={styles.statLabel}>Avg. Pickup</Text>
        </View>
      </View>

      {/* Order History Header */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleGroup}>
          <Ionicons name="time" size={18} color="#0F172A" />
          <Text style={styles.sectionTitle}>Order History</Text>
        </View>
        <Text style={styles.orderCount}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Student Profile"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Order }) => {
          const isReady = item.status === 'Ready for Pickup';
          const isPreparing = item.status === 'Preparing';

          return (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() =>
                navigation.navigate('OrderTracking', { orderId: item.id })
              }
              activeOpacity={0.7}
            >
              <View style={styles.orderCardHeader}>
                <View>
                  <Text style={styles.orderCardId}>{item.id}</Text>
                  <Text style={styles.orderCardDate}>{item.orderDate}</Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    isReady
                      ? styles.statusPillGreen
                      : isPreparing
                      ? styles.statusPillOrange
                      : styles.statusPillBlue,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isReady
                        ? styles.statusPillTextGreen
                        : isPreparing
                        ? styles.statusPillTextOrange
                        : styles.statusPillTextBlue,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderCardItemsList}>
                {item.items.map((cartItem) => (
                  <Text
                    key={cartItem.id}
                    style={styles.orderCardItemText}
                    numberOfLines={1}
                  >
                    • {cartItem.quantity}x {cartItem.name}
                  </Text>
                ))}
              </View>

              <View style={styles.orderCardFooter}>
                <View style={styles.pickupLocationGroup}>
                  <Ionicons name="location-outline" size={14} color="#64748B" />
                  <Text style={styles.pickupLocationText} numberOfLines={1}>
                    {item.pickupLocation}
                  </Text>
                </View>

                <View style={styles.orderCardPriceGroup}>
                  <Text style={styles.orderCardPriceLabel}>Total:</Text>
                  <Text style={styles.orderCardPrice}>LKR {item.subtotal}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyHistory}>
            <Ionicons name="receipt-outline" size={44} color="#CBD5E1" />
            <Text style={styles.emptyHistoryTitle}>No past orders yet</Text>
            <Text style={styles.emptyHistorySubtitle}>
              When you place orders for campus meals, your receipt history will be shown here.
            </Text>
            <TouchableOpacity
              style={styles.startOrderBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startOrderBtnText}>Start an Order</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  signOutBtn: {
    padding: 4,
  },
  headerArea: {
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileMeta: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF5722',
  },
  badgeTextGreen: {
    color: '#10B981',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderCardId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderCardDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPillGreen: {
    backgroundColor: '#ECFDF5',
  },
  statusPillOrange: {
    backgroundColor: '#FFF7ED',
  },
  statusPillBlue: {
    backgroundColor: '#EFF6FF',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillTextGreen: {
    color: '#10B981',
  },
  statusPillTextOrange: {
    color: '#EA580C',
  },
  statusPillTextBlue: {
    color: '#2563EB',
  },
  orderCardItemsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 4,
  },
  orderCardItemText: {
    fontSize: 13,
    color: '#475569',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pickupLocationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  pickupLocationText: {
    fontSize: 11,
    color: '#64748B',
  },
  orderCardPriceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderCardPriceLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  orderCardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF5722',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  emptyHistoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyHistorySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  startOrderBtn: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  startOrderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
