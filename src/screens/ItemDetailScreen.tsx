import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';
import HeaderBar from '../components/HeaderBar';

type ItemDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ItemDetail'
>;

export default function ItemDetailScreen({
  route,
  navigation,
}: ItemDetailScreenProps) {
  const { item } = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  // Quantity from the last Add to Cart tap, so the banner does not change when the selector changes
  const [addedQuantity, setAddedQuantity] = useState<number | null>(null);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setAddedQuantity(quantity);
  };

  const totalPrice = item.price * quantity;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Food Details"
        onBack={() => navigation.goBack()}
        showCart
        onCartPress={() => navigation.navigate('Cart')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{item.category}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.name}</Text>
            {item.rating && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {/* Meta Info: Time, Calories */}
          <View style={styles.metaRow}>
            {item.prepTime && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{item.prepTime}</Text>
              </View>
            )}
            {item.calories && (
              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={16} color="#EF4444" />
                <Text style={styles.metaText}>{item.calories}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
              <Text style={styles.metaText}>In Stock</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.divider} />

          {/* Quantity Selection Area */}
          <View style={styles.quantitySection}>
            <View>
              <Text style={styles.quantitySectionLabel}>Select Quantity</Text>
              <Text style={styles.unitPriceLabel}>LKR {item.price} each</Text>
            </View>

            <QuantitySelector
              quantity={quantity}
              onIncrease={increase}
              onDecrease={decrease}
            />
          </View>

          {/* Added to Cart Feedback Banner */}
          {addedQuantity !== null && (
            <View style={styles.successBanner}>
              <View style={styles.successLeft}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.successText}>
                  Added {addedQuantity}x {item.name} to cart!
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Cart')}
                style={styles.viewCartButton}
              >
                <Text style={styles.viewCartButtonText}>View Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalAmount}>LKR {totalPrice}</Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="cart" size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryPill: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quantitySectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  unitPriceLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  successBanner: {
    marginTop: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  successLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
    flex: 1,
  },
  viewCartButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  viewCartButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  totalBlock: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF5722',
  },
  addToCartButton: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    height: 50,
    borderRadius: 14,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
