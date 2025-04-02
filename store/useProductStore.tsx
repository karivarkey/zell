import { create } from "zustand";
import axios from "axios";
import { Product } from "@/types/types";
import { API } from "@/constants/constants";

interface ProductStore {
  products: Product[];
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  fetchProducts: async () => {
    try {
      const res = await axios.get<Product[]>(`${API}/user/home`);
      set({ products: res.data });
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  },
}));
