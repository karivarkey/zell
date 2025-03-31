import { create } from "zustand";
import { Product } from "@/types/types";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      let newCart;
      if (existingItem) {
        // If item exists, update quantity
        newCart = state.cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Otherwise, add new item with quantity 1
        newCart = [...state.cartItems, { ...item, quantity: 1 }];
      }

      console.log("Cart Updated (Added):", newCart);
      return { cartItems: newCart };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === id
      );

      let newCart;
      if (existingItem && existingItem.quantity > 1) {
        // Reduce quantity if more than 1
        newCart = state.cartItems.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        // Remove item if only 1 left
        newCart = state.cartItems.filter((cartItem) => cartItem.id !== id);
      }

      console.log("Cart Updated (Removed):", newCart);
      return { cartItems: newCart };
    }),
}));

// Log cart changes globally
useCartStore.subscribe((state) => {
  console.log("Cart State Changed:", state.cartItems);
});
