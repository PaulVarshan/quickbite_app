# QuickBite – Campus Food Ordering App
## Activity Submission & Verification Report

**Module:** INTE22283 Mobile Applications Development  
**Application Name:** QuickBite (Campus Food Ordering MVP)  
**Framework:** React Native + Expo (TypeScript)  
**Navigation:** `@react-navigation/native` & `@react-navigation/native-stack`  
**State Management:** React Context API (`CartContext`)  
**Target Environment:** Physical Android Device (Expo Go) & Responsive Tablet/Web  

---

## 1. Executive Summary & Architecture

QuickBite is a cross-platform mobile application engineered for university students to streamline campus dining. The application allows students to browse meals, beverages, and snacks, filter by category or search query, view nutritional details and preparation times, customize quantities, add items to a real-time reactive cart, simulate order placement, track preparation progress through simulated kitchen statuses, and review their campus order history.

### Tech Stack
- **Core:** React Native `0.86.3`, React `19.2.3`, TypeScript `6.0.3`
- **Development Tooling:** Expo SDK 57 (`expo`), Expo Go
- **Navigation:** React Navigation Native Stack
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Safe Area:** `react-native-safe-area-context`

---

## 2. Screen & Flow Architecture

The application implements the complete 9-screen flow required by the specification:

```
[Splash Screen] (Auto-advances in 1.8s)
       ↓
[Login / Guest Screen] (Name validation or Guest mode)
       ↓
[Home Screen] (Responsive grid, search bar, category filter, badges)
   ├───→ [Profile Screen] (Student stats, full order history, sign out)
   └───→ [Item Detail Screen] (Large photo, specs, quantity counter)
              ↓
         [Cart Screen] (Items list, line controls, subtotal computation)
              ↓
         [Checkout Screen] (Pickup counter selector, payment simulation)
              ↓
         [Order Confirmation Screen] (QB-XXXX ticket, estimated pickup time)
              ↓
         [Order Tracking Screen] (3-stage live stepper, manual advance control)
```

---

## 3. Key Code Snippets & Implementation Explanations

### 3.1 Cart Context & Centralized State (`src/context/CartContext.tsx`)
```tsx
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userName, setUserName] = useState<string>('Guest Student');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Dynamic itemCount and subtotal computations
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  ...
```
*Explanation:* Uses `useMemo` hooks so `itemCount` and `subtotal` recompute efficiently only when `items` array changes.

### 3.2 Add to Cart & Quantity Modification Logic
```tsx
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
```
*Explanation:* Avoids duplicates in cart by increasing the `quantity` attribute of an existing item if already selected.

### 3.3 Order ID Generation & Estimated Pickup Calculation (`placeNewOrder`)
```tsx
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
```
*Explanation:* Generates a 4-digit formatted campus order code (e.g. `QB-4821`) and formats local time + 20 minutes in 12-hour AM/PM format.

### 3.4 Order Status Progression Simulation (`advanceOrderStatus`)
```tsx
const advanceOrderStatus = (orderId: string): OrderStatus => {
  const statusCycle: OrderStatus[] = ['Placed', 'Preparing', 'Ready for Pickup'];
  ...
  const currentIndex = statusCycle.indexOf(order.status);
  const nextIndex = Math.min(currentIndex + 1, statusCycle.length - 1);
  return statusCycle[nextIndex];
};
```
*Explanation:* Moves the order through the three required activity states (`Placed` ➔ `Preparing` ➔ `Ready for Pickup`) on demand.

### 3.5 Responsive Grid Adaptation (`HomeScreen.tsx`)
```tsx
const { width } = useWindowDimensions();
const numColumns = width >= 700 ? 3 : 2;
const horizontalPadding = 16;
const gap = 12;
const totalGapsWidth = gap * (numColumns - 1);
const availableWidth = width - horizontalPadding * 2 - totalGapsWidth;
const cardWidth = Math.floor(availableWidth / numColumns);
```
*Explanation:* Detects screen width dynamically. If the screen is a tablet or wide window (≥700px), it renders 3 columns; on standard smartphones it renders 2 columns with mathematically exact card widths, avoiding horizontal overflow.

---

## 4. Manual Test Log (Pass/Fail Evidence)

| Test ID | Test Case | Action Performed | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC01** | App Launch & Splash | Launch application | Splash animation displays QuickBite logo and transitions to Login within 1.8s | Splash shows with scale/fade animation and auto-replaces to Login | **PASS** |
| **TC02** | Continue as Guest | Click "Continue as Guest" | Navigates directly to Home with guest user session | Home screen opens with greeting "Hello, Guest Student 👋" | **PASS** |
| **TC03** | User Name Input | Enter name "Kasun Perera" and tap continue | Validates non-empty input, sets student name, navigates to Home | Greets "Hello, Kasun Perera 👋" on Home and sets Profile name | **PASS** |
| **TC04** | Menu Search | Type "rice" into the search bar | Filters menu in real-time showing matching meals | Displays "Crispy Chicken Rice" and "Campus Vegetable Bowl" | **PASS** |
| **TC05** | Category Filter | Tap "Beverages" category pill | Only beverages are listed | Displays Lemon Iced Tea, Iced Caramel Macchiato, and Mango Smoothie | **PASS** |
| **TC06** | Item Detail & Quantity | Tap on a food card, increase quantity to 3 | Opens detail screen, quantity updates, total price multiplies | Detail screen shows full specs and updates total to unit price × 3 | **PASS** |
| **TC07** | Add to Cart & Badge | Tap "Add to Cart" or quick add (+) | Item adds to cart state, header cart icon badge increments | Header badge shows live item count; toast confirms addition | **PASS** |
| **TC08** | Cart Modification | Go to Cart, tap (+) and (-) and trash icon | Quantity increments/decrements; line and subtotal recompute; delete removes item | Items update live; subtotal reflects exact math; empty state shows when cleared | **PASS** |
| **TC09** | Order Placement | Proceed to Checkout, pick counter, click "Place Order" | Generates QB-XXXX order ID, +20m pickup estimate, navigates to Confirmation | Order Confirmation displays generated order ticket and pickup estimate | **PASS** |
| **TC10** | Order Tracking Stepper | Click "Track Order Status" and tap "Advance Status" | Order advances: Placed ➔ Preparing ➔ Ready for Pickup | Stepper checkmarks and status pill transition cleanly | **PASS** |
| **TC11** | Profile & Order History | Navigate to Profile screen | Order history lists placed order with items, counter, total, and status | Order card appears in history; clicking it opens tracking | **PASS** |
| **TC12** | Responsive Layout | Test on smartphone width vs. tablet width | 2 columns on phone; 3 columns on tablet/expanded viewport | Layout adjusts automatically without horizontal clipping or overflow | **PASS** |

---

## 5. Running on Physical Android Device via Expo Go

To run and test the app on a physical Android phone:

1. **Install Expo Go** from the Google Play Store on your Android phone.
2. In the terminal, run:
   ```bash
   cd quickbite_app
   npx expo start
   ```
3. Ensure the phone and PC are connected to the same Wi-Fi network, and scan the terminal QR code with the Expo Go camera.
4. If on separate networks (or campus Wi-Fi blocks LAN discovery), launch in tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
