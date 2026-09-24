import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Category, MenuItem, RootStackParamList } from '../types';
import { MENU_ITEMS } from '../data/menu';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';
import CategoryButton from '../components/CategoryButton';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const CATEGORIES: Category[] = ['All', 'Meals', 'Beverages', 'Snacks'];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const { userName, itemCount, addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Responsive column count based on guide Section 20
  const numColumns = width >= 700 ? 3 : 2;
  const horizontalPadding = 16;
  const gap = 12;
  const totalGapsWidth = gap * (numColumns - 1);
  const availableWidth = width - horizontalPadding * 2 - totalGapsWidth;
  const cardWidth = Math.floor(availableWidth / numColumns);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.description.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, 1);
    setToastMessage(`Added 1x ${item.name} to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const renderHeader = () => (
    <View style={styles.headerArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingSub}>Campus Dining</Text>
          <Text style={styles.greetingTitle}>Hello, {userName} 👋</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={22} color="#0F172A" />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {itemCount > 99 ? '99+' : itemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Campus Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerPill}>
            <Ionicons name="flash" size={12} color="#FF5722" />
            <Text style={styles.bannerPillText}>LUNCH EXPRESS</Text>
          </View>
          <Text style={styles.bannerTitle}>Order ahead & Skip the Cafeteria line!</Text>
          <Text style={styles.bannerSubtitle}>Ready for pickup in ~20 minutes</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          placeholder="Search rice, pasta, burger, drinks..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Horizontal Scroller */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <CategoryButton
            key={cat}
            title={cat}
            isSelected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsMeta}>
        <Text style={styles.resultsCount}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
        </Text>
        {selectedCategory !== 'All' && (
          <TouchableOpacity onPress={() => setSelectedCategory('All')}>
            <Text style={styles.clearFilterText}>Reset filter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <FlatList
        data={filteredItems}
        key={numColumns} // Re-render when layout columns switch
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            cardWidth={cardWidth}
            onPress={() => navigation.navigate('ItemDetail', { item })}
            onQuickAdd={() => handleQuickAdd(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No food items found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with another keyword or pick a different category.
            </Text>
            <TouchableOpacity
              style={styles.emptyResetButton}
              onPress={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.emptyResetText}>View All Menu</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerArea: {
    marginBottom: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF5722',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  banner: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
    overflow: 'hidden',
  },
  bannerContent: {
    zIndex: 1,
  },
  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF1EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginBottom: 8,
  },
  bannerPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF5722',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  categoryScroll: {
    paddingVertical: 4,
    paddingRight: 16,
    marginBottom: 14,
  },
  resultsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  clearFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5722',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyResetText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  toast: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
