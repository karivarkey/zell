import { create } from "zustand";
import { Product } from "@/types/types"; // Importing the Product type

type CartState = {
  cart: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addItem: (product) =>
    set((state) => {
      // Avoid duplicates by checking if product exists
      if (state.cart.some((item) => item.id === product.id)) return state;
      return { cart: [...state.cart, product] };
    }),

  removeItem: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));
