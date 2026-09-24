# QuickBite – Campus Food Ordering App
## Final Testing & Submission Report

**Module:** INTE22283 Mobile Applications Development
**Test date:** 24 September 2026
**Build under test:** `master` branch (base commit `1586b8f`) plus the fixes listed in Section 5

---

### 1. Project Overview

QuickBite is a campus food ordering app built with React Native and Expo (TypeScript). One shared codebase targets Android and iOS. Students can:

- Continue as a guest, or enter their name.
- Browse a menu of Meals, Beverages and Snacks, with photos and prices.
- Search the menu and filter it by category.
- Open an item's details, choose a quantity and add it to the cart.
- Manage the cart and check out with a pickup counter and payment method.
- Receive an order number and an estimated pickup time.
- Track the order through **Placed → Preparing → Ready for Pickup**.
- Review past orders on the Profile screen.

The app has nine screens: Splash, Login, Home, Item Detail, Cart, Checkout, Order Confirmation, Order Tracking and Profile. They are connected with a React Navigation native stack. Cart, user and order state is shared through a single React Context (`CartContext`), so it stays consistent across every screen.

---

### 2. Testing Environment

| Item | Value |
|---|---|
| Host OS | Windows 11 Home Single Language 10.0.26200 |
| Node.js / npm | v22.19.0 / 10.9.3 |
| Expo SDK (`expo` package) | 57.0.24 |
| React Native / React | 0.86.3 / 19.2.3 |
| TypeScript | 6.0.3 |
| React Navigation | `@react-navigation/native` 7.4.1, `native-stack` 7.19.2 |
| Test device | Android Emulator, AVD `Pixel_10` (`sdk_gphone16k_x86_64`) |
| Android version | Android 17 (API 37) |
| Screen (default) | 1080 × 2424 px, 420 dpi (≈ 411 × 923 dp) |
| Small-phone test | 720 × 1280 px, 320 dpi (360 × 640 dp) via `adb shell wm size/density` |
| Tablet test | 1600 × 2560 px, 320 dpi (800 × 1280 dp) via `adb shell wm size/density` |
| Runtime | Expo Go 57.0.9, Metro dev server (`npx expo start --android`) |
| Physical device | **Not available during this session** (see TC-028) |
| iOS | **Not tested** (no macOS / iOS device available) |

The app was driven through `adb` (taps, text input and UI hierarchy dumps). All screenshots were captured from the emulator with `adb exec-out screencap`.

---

### 3. Functional Test Summary

All 30 planned test cases were attempted, with these results:
- **29 were executed** against the running app on the Android emulator.
- **1 was blocked**: TC-028, because no physical phone was connected.

**11 defects** were found during testing:
- 1 was an environment/configuration issue.
- 10 were app defects.

All 11 were fixed, and every affected test was re-run on the running app afterwards. In the final state, all 29 executed tests pass.

Tests that failed on first run and passed after fixes:
- **TC-004:** broken image.
- **TC-005:** search lost focus, and the clear button needed two taps.
- **TC-007, and all headers:** the header sat under the status bar.
- **TC-009:** "Added" banner text and the header's Clear button.
- **TC-012:** rapid minus taps removed items.
- **TC-018:** inconsistent item count.
- **TC-029:** last cart item hidden on small phones.

---

### 4. Detailed Test Log

| Test ID | Test Case | Expected Result | Actual Result | Result | Evidence |
|---|---|---|---|---|---|
| TC-001 | App Launch / Splash | App launches, splash shows, moves to next screen | Splash shows the QuickBite logo, tagline "Campus Food Ordering", "FAST • FRESH • ON-CAMPUS" badge and loading text, then moves to Login after ~1.8 s. No crash. | PASS | SS-01 |
| TC-002 | Login / Guest Access | Guest access reaches Home | "Continue as Guest" opens Home with the greeting "Hello, Guest Student 👋" | PASS | SS-02 |
| TC-003 | Login Input Validation | Empty or invalid name rejected; valid name accepted | Empty name and spaces-only name ("   ") both show "Please enter your name or continue as a guest" and stay on Login. "Test Student" opens Home with "Hello, Test Student 👋". The Student ID field is optional. The app uses name/guest identification only; there is no password authentication. | PASS | – |
| TC-004 | Home / Menu Loading | Items, names, prices, images and categories visible | 10 items shown ("10 items available"): 4 Meals, 3 Beverages, 3 Snacks, each with a category badge, rating, name, description and LKR price. **First run: "Golden Seasoned Fries" image was blank (BUG-004).** After the fix, all 10 images load. | PASS (after fix) | SS-03 |
| TC-005 | Search | Matching items shown; empty result explained; clearing restores | Typing "pasta" letter by letter shows only "Creamy Alfredo Pasta" (1 item). "pizzaxyz" shows 0 items, the message "No food items found" and a "View All Menu" button. ✕ and "View All Menu" both restore 10 items. A spaces-only search shows all 10. **First run: input lost focus after the first letter (BUG-003); ✕ needed two taps while the keyboard was open (BUG-005).** | PASS (after fix) | SS-04 |
| TC-006 | Category Filtering | Only the selected category's items shown | Meals → 4 items (all MEALS). Beverages → 3 (Lemon Iced Tea, Iced Caramel Macchiato, Mango Smoothie). Snacks → 3 (Fries, Chicken Wings, Cheese Sandwich). All → 10. "Reset filter" returns to All. Beverages plus search "iced" → 2 items. | PASS | SS-05 |
| TC-007 | Item Detail | Name, image, price, description, quantity selector, Add to Cart | Grilled Beef Burger shows its image, MEALS badge, ★4.9, 12-18 mins, 720 kcal, In Stock, description, "LKR 520 each", quantity selector, total price and Add to Cart. **First run: header buttons were drawn under the Android status bar (BUG-002).** | PASS (after fix) | SS-06 |
| TC-008 | Quantity Selector | Quantity changes; never invalid | Minus is disabled at 1 (a tap leaves it at 1). Plus ×2 → 3 (LKR 1,560). Minus → 2 (LKR 1,040). 10 rapid plus taps → 12 (LKR 6,240). 16 rapid minus taps → 1 (LKR 520). | PASS | – |
| TC-009 | Add Item to Cart | Correct item, quantity and price in cart | Burger qty 2 → Add to Cart → banner "Added 2x Grilled Beef Burger to cart!" and cart badge shows 2. Cart shows Grilled Beef Burger, 2 × LKR 520 = LKR 1,040. **First run: changing the selector after adding changed the banner to "Added 3x" while only 2 were in the cart (BUG-006).** | PASS (after fix) | SS-07 |
| TC-010 | Add Same Item Twice | Existing cart quantity increases; no duplicate row | Burger ×2, then Burger ×1 again → one cart row with quantity 3, badge 3. Banner stayed "Added 1x" while the selector was changed to 3. | PASS | – |
| TC-011 | Increase Cart Quantity | Quantity, line total, subtotal and count update | Iced Tea 1 → 2: line LKR 360, subtotal 2,180 → 2,360, count 6 → 7 items | PASS | – |
| TC-012 | Decrease Cart Quantity | Quantity and totals recalculate; invalid values prevented | Burger 3 → 2: subtotal 2,360 → 1,840. Iced Tea 2 → 1: subtotal 1,660. Minus at 1 is disabled. **First run: 14 rapid minus taps on Fries (qty 12) removed the item from the cart (BUG-008).** After the fix, 20 rapid minus taps on Burger (qty 7) stop at 1. | PASS (after fix) | – |
| TC-013 | Remove Cart Item | Item disappears; subtotal and count update | Trash on Iced Tea: row removed, subtotal 920 → 740, "2 items" | PASS | – |
| TC-014 | Empty Cart | Clear empty state; no checkout | "Clear" shows "Your cart is empty" with a "Browse Menu" button. The Order Summary and Proceed to Checkout are hidden, and the header Clear action disappears. | PASS | SS-07b |
| TC-015 | Subtotal Calculation | Subtotal = Σ(price × qty) | Burger 520×3 + Iced Tea 180×1 + Fries 220×2 = 1,560 + 180 + 440 = **LKR 2,180** (shown 2,180). Other combinations checked: 2,360; 1,840; 1,660; 3,860 (1,040 + 180 + 2,640); 1,490; 1,800; 2,150; 1,260. All matched the manual calculation. | PASS | SS-07 |
| TC-016 | Cart Item Count | Badge/count consistent | The badge and "Total Items" count **total quantity** (sum of quantities), not product lines. Examples: Burger 3 + Tea 1 + Fries 2 → badge 6, "6 items". Checkout and the Profile "Items Ordered" stat use the same rule after BUG-009 was fixed. The badge shows "99+" above 99 (checked in code only). | PASS | SS-07 |
| TC-017 | Cart Persistence During Navigation | Contents, quantities and subtotal unchanged | Cart (Burger 1, Fries 1, LKR 740) → Home (badge 2) → Spicy Chicken Wings detail (header badge 2) → header cart icon → cart still Burger 1 + Fries 1, LKR 740 | PASS | – |
| TC-018 | Checkout Summary | Items, quantities, prices, subtotal and confirm action shown | Checkout lists "1x Crispy Chicken Rice LKR 450" and "2x Grilled Beef Burger LKR 1040", Grand Total LKR 1,490, pickup counters, payment options, and the button "Place Order (LKR 1490)". **First run: heading said "Order Summary (2 items)" while the cart said "3 items" (BUG-009).** | PASS (after fix) | SS-08 |
| TC-019 | Place Order | Order created; confirmation shown; cart reset | Place Order → "Order Confirmed!" with the same items and total. The selected counter ("Meals Counter 2") and payment ("Cash on Pickup") are carried over. Back from the confirmation shows "Your cart is empty". | PASS | SS-09 |
| TC-020 | Order Number | Non-blank ID, clearly shown, consistent | "QB-8828" shown under ORDER NUMBER. The same ID appears in the tracking header "Track #QB-8828", in "Order Details (QB-8828)" and in Order History. | PASS | SS-09 |
| TC-021 | Estimated Pickup Time | Valid formatted time | "ESTIMATED PICKUP TIME 12:02 PM" for an order placed at 11:42 (+20 min). A second order at ~11:49 showed 12:09 PM. No null, undefined or NaN values. | PASS | SS-09 |
| TC-022 | Initial Tracking Status | Valid initial status | Tracking shows "LIVE STATUS · Order Placed", with step 1 highlighted and steps 2–3 pending | PASS | SS-10 |
| TC-023 | Status Progression | Statuses change and UI reflects the current one | Advance → "Preparing Food" (step 1 ticked, step 2 highlighted). Advance → "Ready for Pickup" (badge "READY NOW", steps 1–2 ticked). | PASS | SS-11, SS-12 |
| TC-024 | Final Status | Final status stable; no extra state | At Ready for Pickup the button becomes a disabled green "Order Ready for Pickup". 5 more taps: status unchanged, no invalid state. Profile history also shows "Ready for Pickup". | PASS | SS-12 |
| TC-025 | Profile | Profile loads with user info | Shows avatar initial "G", "Guest Student", badges, stats (Orders Placed, Items Ordered, ~20m Avg. Pickup), Order History and a sign-out icon. No broken UI. | PASS | SS-13 |
| TC-026 | Order History | Recent order appears, consistent with confirmation | QB-8828 listed with date "Sep 24, 11:42 AM", "1x Crispy Chicken Rice, 2x Grilled Beef Burger", Meals Counter 2 and LKR 1,490, all matching the confirmation. Tapping it opens its tracking screen. After a 2nd order, the newest (QB-6164) is listed first: "2 orders", Items Ordered 4. | PASS | SS-13 |
| TC-027 | Navigation / Back Navigation | Full flow works; back keeps state; no blank screens | Splash → Login → Home → Detail → Cart → Checkout → Confirmation → Tracking → Profile all completed. The Android back button and header back arrows work, with no crashes or blank screens. "Track Order Status" opens the new order (QB-6164). Tracking's back goes to Home. Sign-out returns to Login. | PASS | – |
| TC-028 | Physical Android Device | App runs on a real phone via Expo Go | **Not executed.** No physical Android phone was connected (`adb devices` listed only the emulator), so no physical-device result or screenshot is claimed. | BLOCKED | NOT PERFORMED |
| TC-029 | Phone Responsiveness (360 × 640 dp) | No overflow, clipping or unreachable controls | Login, Home, Detail, Cart and Checkout are usable. Long names are truncated with an ellipsis, and the category row scrolls horizontally. **First run: with 4+ cart items, the last item's quantity controls stayed hidden behind the Order Summary panel (BUG-011).** After the fix the last item is fully visible and its + button works (Vegetable Bowl 1 → 2, subtotal 1,800 → 2,150). | PASS (after fix) | SS-14b, SS-14c |
| TC-030 | Tablet Responsiveness (800 × 1280 dp) | Layout adapts; content readable | Home switches to a 3-column grid (2 columns on phones). Detail, Cart, Checkout and Profile render without breakage. Content stretches to full width (cosmetic, see Section 11). | PASS | SS-15, SS-15b |

**Additional edge cases executed**

| Case | Result |
|---|---|
| Empty search (spaces only) | Treated as no filter; all 10 items shown |
| No search results | "No food items found" message with a "View All Menu" recovery button |
| Rapid quantity changes (detail and cart) | Quantity never below 1; totals stay correct (after BUG-008 fix) |
| Empty-cart checkout | Checkout is not reachable: the button is hidden when the cart is empty. `handlePlaceOrder` also guards against an empty cart in code. |
| Device back button | Works on Detail, Cart and Confirmation. Back from Confirmation shows the cleared cart, not a stale checkout. |
| Repeated Place Order taps | 3 rapid taps, and later 2 rapid taps, each created exactly **one** order (Profile: "1 order") |
| State across screen transitions | Cart and orders preserved while navigating (TC-017, TC-026) |
| UI text scan | No `undefined`, `null`, `NaN`, raw errors or debug text found on any screen |

---

### 5. Bugs Found and Fixed

| Bug ID | Test Case | Problem | Severity | Fix | Retest Result |
|---|---|---|---|---|---|
| BUG-001 | Setup | `expo-doctor` failed: `expo-font`, a required peer dependency of `@expo/vector-icons`, was not installed | Medium | Installed with `npx expo install expo-font` (SDK-matched 57.0.4). `expo-doctor` now passes 21/21. | PASS |
| BUG-002 | TC-007, TC-027 | On every screen except Home, the header (back and cart buttons) was drawn under the Android status bar and clock. React Native's built-in `SafeAreaView` does nothing on Android and shows a deprecation warning. | High | All 8 screens now use `SafeAreaView` from `react-native-safe-area-context`. Home's manual `StatusBar.currentHeight` padding was removed so it isn't applied twice. | PASS |
| BUG-003 | TC-005 | Search box lost focus after each keystroke, so only the first letter was entered. `ListHeaderComponent` received a function that was re-created every render, so the TextInput remounted. | High | `ListHeaderComponent={renderHeader()}` now passes an element instead of a component | PASS |
| BUG-004 | TC-004 | "Golden Seasoned Fries" showed an empty grey image because its Unsplash URL returned HTTP 404 | Medium | Replaced with a working Unsplash fries photo (HTTP 200); all 10 URLs verified | PASS |
| BUG-005 | TC-005 | With the keyboard open, the first tap on the search ✕ only closed the keyboard; a second tap was needed | Low | Added `keyboardShouldPersistTaps="handled"` to the Home `FlatList` | PASS |
| BUG-006 | TC-009 | The detail banner read the live selector value, so after adding 2 and pressing + it showed "Added 3x …" while the cart held 2 | Low | The banner now shows the quantity stored at the moment of adding (`addedQuantity` state) | PASS |
| BUG-007 | TC-009 | The cart header's "Clear" text wrapped onto two lines ("Cle / ar") because the header's side slots were a fixed 44 dp wide | Low | Header side containers changed from `width: 44` to `minWidth: 44` | PASS |
| BUG-008 | TC-012 | Rapid minus taps in the cart removed the item. `decreaseQuantity` let quantity reach 0 and filtered it out before the disabled button state rendered. | Medium | `decreaseQuantity` now clamps with `Math.max(1, …)`; removal happens only through `removeFromCart` (trash / Clear) | PASS |
| BUG-009 | TC-018, TC-016 | Checkout said "Order Summary (2 items)" for a cart the Cart screen called "3 items" (line count vs quantity). Profile "Items Ordered" had the same problem. | Low | Checkout uses `itemCount` (total quantity); Profile sums item quantities | PASS |
| BUG-010 | TC-027 | Cart summary showed "1 items" | Low | Singular/plural handling ("1 item") | PASS |
| BUG-011 | TC-029 | On a 360 × 640 dp phone, the last cart item's quantity controls stayed hidden behind the Order Summary panel even when scrolled to the end. The panel was absolutely positioned (~258 dp) over a list with only 220 dp of bottom padding. | Medium | The summary panel is now laid out below the list instead of overlaying it; the fixed 220 dp padding was removed | PASS |

Before/after evidence for the visual bugs is in `screenshots/bugs/`.

---

### 6. Regression Testing

After each fix, the app was reloaded on the emulator and the affected tests were re-run:

| Fix | Tests re-run |
|---|---|
| BUG-002 (safe area, all screens) | TC-002, TC-007, TC-009, TC-014, TC-017–TC-027, TC-029, TC-030 (every screen re-inspected for header position) |
| BUG-003 / BUG-005 (Home search) | TC-004, TC-005, TC-006 |
| BUG-004 (menu data) | TC-004, TC-030 |
| BUG-006 (detail banner) | TC-009, TC-010 |
| BUG-007 (HeaderBar) | TC-007, TC-009, TC-014, TC-018, TC-022, TC-025 (all screens using HeaderBar) |
| BUG-008 (cart context) | TC-008, TC-011, TC-012, TC-013, TC-015, TC-016 |
| BUG-009 / BUG-010 (counts) | TC-016, TC-018, TC-025, TC-026 |
| BUG-011 (cart layout) | TC-009–TC-015, TC-029, TC-030 |

A final regression pass then ran on the finished code at the default phone size. Each step matched its expected values:
- **Cart:** Guest login → Burger ×2 via detail → Fries via quick-add → Cart (LKR 1,260, 3 items) → + (1,480) → rapid minus (stays at 1, 1,260) → remove (1,040).
- **Order:** Checkout "(2 items)" → double-tapped Place Order → exactly one order, QB-7827, pickup 12:22 PM.
- **Tracking:** Placed → Preparing → Ready, and stays Ready on further taps.
- **Profile and cart:** Profile shows 1 order, Ready for Pickup, 2 items. The cart is empty after ordering.

`npx tsc --noEmit` passes with no errors, and `npx expo-doctor` passes 21/21 checks.

---

### 7. Screenshot Evidence

All screenshots were taken on the Android emulator (Expo Go) after the feature was working. The Expo Go floating tools button was hidden for clean captures.

#### SS-01 Splash Screen
![Splash Screen](screenshots/SS-01-Splash.png)

#### SS-02 Login / Guest Access
![Login / Guest](screenshots/SS-02-Login-Guest.png)

#### SS-03 Home Menu
![Home Menu](screenshots/SS-03-Home-Menu.png)

#### SS-04 Search ("pasta")
![Search](screenshots/SS-04-Search.png)

#### SS-05 Category Filter (Beverages)
![Category Filter](screenshots/SS-05-Category-Filter.png)

#### SS-06 Item Detail
![Item Detail](screenshots/SS-06-Item-Detail.png)

#### SS-07 Cart
![Cart](screenshots/SS-07-Cart.png)

#### SS-07b Empty Cart
![Empty Cart](screenshots/SS-07b-Empty-Cart.png)

#### SS-08 Checkout
![Checkout](screenshots/SS-08-Checkout.png)

#### SS-09 Order Confirmation
![Order Confirmation](screenshots/SS-09-Order-Confirmation.png)

#### SS-10 Order Tracking – Placed
![Tracking Placed](screenshots/SS-10-Order-Tracking-Placed.png)

#### SS-11 Order Tracking – Preparing
![Tracking Preparing](screenshots/SS-11-Order-Tracking-Preparing.png)

#### SS-12 Order Tracking – Ready for Pickup
![Tracking Ready](screenshots/SS-12-Order-Tracking-Ready.png)

#### SS-13 Profile & Order History
![Profile](screenshots/SS-13-Profile.png)

#### SS-14 Physical Phone
**NOT PERFORMED.** No physical Android device was available during this test session, so no physical-device screenshot exists. Small-phone responsiveness was tested on the emulator instead (SS-14b, SS-14c).

#### SS-14b Small Phone (360 × 640 dp) – Home
![Small Phone Home](screenshots/SS-14b-Small-Phone-Home.png)

#### SS-14c Small Phone (360 × 640 dp) – Cart with 4 items, scrolled to end
![Small Phone Cart](screenshots/SS-14c-Small-Phone-Cart.png)

#### SS-15 Tablet (800 × 1280 dp) – Home, 3-column grid
![Tablet Home](screenshots/SS-15-Tablet-Responsive.png)

#### SS-15b Tablet – Cart
![Tablet Cart](screenshots/SS-15b-Tablet-Cart.png)

#### Bug evidence (before / after)
| Bug | Screenshot |
|---|---|
| BUG-002 before | ![](screenshots/bugs/BUG-002-before-header-under-status-bar.png) |
| BUG-003 before | ![](screenshots/bugs/BUG-003-before-search-loses-focus.png) |
| BUG-004 before / after | ![](screenshots/bugs/BUG-004-before-broken-fries-image.png) ![](screenshots/bugs/BUG-004-after-fries-image.png) |
| BUG-007 before | ![](screenshots/bugs/BUG-007-before-clear-wraps.png) |
| BUG-011 before / after | ![](screenshots/bugs/BUG-011-before-last-item-hidden.png) ![](screenshots/bugs/BUG-011-after-last-item-visible.png) |

Some "before" screenshots include the Expo Go tools button, a development warning toast or the emulator keyboard's floating toolbar. They were captured before those were hidden.

---

### 8. Requirement Coverage

| Requirement | Test Case(s) | Evidence | Result |
|---|---|---|---|
| Splash screen | TC-001 | SS-01 | PASS |
| Login / Guest access | TC-002, TC-003 | SS-02 | PASS |
| Home screen | TC-004 | SS-03 | PASS |
| Menu categories (Meals, Beverages, Snacks) | TC-004, TC-006 | SS-03, SS-05 | PASS |
| Menu item images and prices | TC-004 | SS-03 | PASS |
| Search / filter | TC-005, TC-006 | SS-04, SS-05 | PASS |
| Item detail screen | TC-007 | SS-06 | PASS |
| Add to Cart and quantity selector | TC-008, TC-009, TC-010 | SS-06, SS-07 | PASS |
| Cart: selected items, quantities, subtotal | TC-009–TC-016 | SS-07, SS-07b | PASS |
| Shared cart state while navigating | TC-017, TC-027 | – | PASS |
| Checkout | TC-018 | SS-08 | PASS |
| Order confirmation, order number, pickup time | TC-019–TC-021 | SS-09 | PASS |
| Order tracking (Placed / Preparing / Ready for pickup) | TC-022–TC-024 | SS-10–SS-12 | PASS |
| Basic profile and order history | TC-025, TC-026 | SS-13 | PASS |
| Responsive UI | TC-029, TC-030 | SS-14b, SS-14c, SS-15, SS-15b | PASS |
| Physical Android device run | TC-028 | – | BLOCKED (not performed) |
| Android/iOS shared codebase | Code review | Single codebase: `App.tsx`, `src/` | Android verified on emulator; iOS **not tested** |
| ≥ 6 functional test cases | Sections 4–6 | – | 29 executed |

---

### 9. Key Implementation Evidence

| Area | File(s) | Function / construct |
|---|---|---|
| Navigation | `src/navigation/AppNavigator.tsx` | `createNativeStackNavigator`; 9 routes, `initialRouteName="Splash"` |
| Menu data | `src/data/menu.ts` | `MENU_ITEMS` (10 items: id, name, category, price, image, description, rating, prepTime, calories) |
| Search / filter | `src/screens/HomeScreen.tsx` | `filteredItems` `useMemo` |
| Cart state | `src/context/CartContext.tsx` | `CartProvider`, `addToCart`, `increaseQuantity`, `decreaseQuantity`, `removeFromCart`, `clearCart` |
| Subtotal / count | `src/context/CartContext.tsx` | `subtotal` and `itemCount` `useMemo` |
| Checkout | `src/screens/CheckoutScreen.tsx` | `handlePlaceOrder` (with `isSubmitting` guard) |
| Order creation | `src/context/CartContext.tsx` | `placeNewOrder` |
| Order tracking | `src/context/CartContext.tsx`, `src/screens/OrderTrackingScreen.tsx` | `advanceOrderStatus`, `STATUS_STEPS` |
| Profile / history | `src/screens/ProfileScreen.tsx` | `orders` list from context |
| Responsive layout | `src/screens/HomeScreen.tsx` | `useWindowDimensions`, `numColumns` |
| Safe areas | all screens | `SafeAreaView` from `react-native-safe-area-context` |

**Search and category filter** (`HomeScreen.tsx`):

```tsx
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
```
Search matches the name or the description, case-insensitively, and combines with the selected category.

**Adding to the cart without duplicate rows** (`CartContext.tsx`):

```tsx
const existing = current.find((x) => x.id === item.id);
if (existing) {
  return current.map((x) =>
    x.id === item.id ? { ...x, quantity: x.quantity + quantity } : x
  );
}
```
Adding an item that is already in the cart increases its quantity instead of creating a second row (verified in TC-010).

**Quantity floor (BUG-008 fix)** (`CartContext.tsx`):

```tsx
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
```

**Subtotal and item count** (`CartContext.tsx`):

```tsx
const itemCount = useMemo(
  () => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
const subtotal = useMemo(
  () => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
```
Both values are derived from the one `items` array, so the badge, cart, checkout and confirmation can't disagree.

**Order creation** (`placeNewOrder`, abridged):

```tsx
const orderId = `QB-${Math.floor(1000 + Math.random() * 9000)}`;
const pickupDate = new Date(Date.now() + 20 * 60 * 1000); // +20 minutes
...
setOrders((prev) => [newOrder, ...prev]);   // newest first in history
setCurrentOrder(newOrder);
clearCart();
```

**Status progression** (`advanceOrderStatus`):

```tsx
const statusCycle: OrderStatus[] = ['Placed', 'Preparing', 'Ready for Pickup'];
const nextIndex = Math.min(currentIndex + 1, statusCycle.length - 1);
```
`Math.min` keeps the order at "Ready for Pickup" once it gets there. The tracking screen also disables the button at that status (verified in TC-024).

**Responsive grid** (`HomeScreen.tsx`):

```tsx
const { width } = useWindowDimensions();
const numColumns = width >= 700 ? 3 : 2;
const cardWidth = Math.floor(
  (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns);
```
This gives 2 columns on phones and 3 at 700 dp or wider (verified at 800 dp in TC-030).

---

### 10. GitHub Repository

https://github.com/PaulVarshan/quickbite_app

This is the `origin` remote of the local repository. The fixes and test evidence from this report are local changes; they reach the repository only once they are committed and pushed.

---

### 11. Final Test Summary

```text
Total Tests Executed:   29 (of 30 planned)
Passed:                 29
Failed:                 0  (final state; 7 test cases failed on first run and passed after fixes)
Blocked:                1  (TC-028 – no physical Android device available)
Bugs Found:             11 (1 environment/configuration, 10 application)
Bugs Fixed:             11
Regression Tests:       All tests affected by each fix re-run (Section 6), plus a full
                        cart → checkout → order → tracking → profile regression pass
Remaining Known Issues: see below
```

**Remaining known issues and limitations (not fixed)**

1. **Special request is not saved.** Text typed in Checkout's "Special Request (Optional)" field is not stored on the order or shown anywhere afterwards. (Low)
2. **Data is in memory only.** Cart and order history are lost when the app is reloaded or restarted. The activity only requires the cart to persist while navigating, which works (TC-017).
3. **Sign-out keeps order history.** After signing out, the next user on the same device still sees earlier orders. (Low)
4. **No maximum quantity.** There is no upper limit on item quantity; 12+ was accepted. (Observation)
5. **Tablet layout stretches.** On tablets, Detail, Cart and Checkout stretch to full width, and the detail hero image is cropped more tightly. The content is still readable. (Cosmetic)
6. **Profile screens can stack.** The profile icon on the Tracking screen opens a new Profile screen on top of the stack, so back goes Profile → Tracking → Home. Nothing is lost and it doesn't crash. (Observation)
7. **Physical device not tested.** A real phone could not be tested in this session (TC-028).
8. **iOS not tested.**
9. **No linter configured.** The project has no ESLint configuration, so `npx expo lint` was not run; running it would add new configuration and dependencies to the project. The TypeScript check passes.
