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
      const res = await axios.get(`${API}/user/home`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        params: {
          _timestamp: new Date().getTime(), // Bypass cache
        },
      });
      console.log("Fetched Products:", res.data);

      set((state) => {
        return { products: [...res.data] }; // Spread to force update
      });
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  },
}));
