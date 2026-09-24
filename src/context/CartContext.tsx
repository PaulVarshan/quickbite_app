import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartItem, MenuItem, Order, OrderStatus } from '../types';

type CartContextType = {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  // User state
  userName: string;
  setUserName: (name: string) => void;
  // Orders state
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  placeNewOrder: (pickupLocation: string, paymentMethod: string) => Order;
  advanceOrderStatus: (orderId: string) => OrderStatus;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userName, setUserName] = useState<string>('Guest Student');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const addToCart = (item: MenuItem, quantity: number) => {
    if (quantity <= 0) return;
    setItems((current) => {
      const existing = current.find((x) => x.id === item.id);
      if (existing) {
        return current.map((x) =>
          x.id === item.id ? { ...x, quantity: x.quantity + quantity } : x
        );
      }
      return [
        ...current,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity,
          category: item.category,
        },
      ];
    });
  };

  const increaseQuantity = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Quantity never drops below 1 here; removing an item is done with removeFromCart
  const decreaseQuantity = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const placeNewOrder = (pickupLocation: string, paymentMethod: string): Order => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `QB-${orderNum}`;
    
    // Estimated pickup in 20 minutes
    const pickupDate = new Date(Date.now() + 20 * 60 * 1000);
    const hours = pickupDate.getHours();
    const minutes = pickupDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const pickupTimeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const now = new Date();
    const dateStr = now.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: orderId,
      items: [...items],
      subtotal,
      orderDate: dateStr,
      pickupTime: pickupTimeStr,
      status: 'Placed',
      userName: userName.trim() || 'Guest Student',
      pickupLocation: pickupLocation || 'Campus Central Cafeteria - Counter 2',
      paymentMethod: paymentMethod || 'Campus Student Card',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string): OrderStatus => {
    const statusCycle: OrderStatus[] = ['Placed', 'Preparing', 'Ready for Pickup'];

    let nextStatus: OrderStatus = 'Ready for Pickup';

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const currentIndex = statusCycle.indexOf(order.status);
          const nextIndex = Math.min(currentIndex + 1, statusCycle.length - 1);
          nextStatus = statusCycle[nextIndex];
          return { ...order, status: nextStatus };
        }
        return order;
      })
    );

    setCurrentOrder((prev) => {
      if (prev && prev.id === orderId) {
        const currentIndex = statusCycle.indexOf(prev.status);
        const nextIndex = Math.min(currentIndex + 1, statusCycle.length - 1);
        return { ...prev, status: statusCycle[nextIndex] };
      }
      return prev;
    });

    return nextStatus;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        userName,
        setUserName,
        orders,
        currentOrder,
        setCurrentOrder,
        placeNewOrder,
        advanceOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
