export type Category = 'All' | 'Meals' | 'Beverages' | 'Snacks';

export type MenuItem = {
  id: string;
  name: string;
  category: 'Meals' | 'Beverages' | 'Snacks';
  price: number;
  image: string;
  description: string;
  rating?: number;
  prepTime?: string;
  calories?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
};

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready for Pickup';

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  orderDate: string;
  pickupTime: string;
  status: OrderStatus;
  userName: string;
  pickupLocation: string;
  paymentMethod: string;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  ItemDetail: { item: MenuItem };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { order: Order };
  OrderTracking: { orderId?: string };
  Profile: undefined;
};
